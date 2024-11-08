require('dotenv').config();  // Load environment variables
const { Client } = require('@notionhq/client');
const { normalizeString } = require('../src/utils/normalize-utils');
const { logToFile } = require('../src/utils/log-utils');

const DEBUG_LEVEL = 2; // 0 = No logs, 1 = Minimal logs, 2 = Full logs

const log = (level, message) => {
  if (DEBUG_LEVEL >= level) {
    if (level === 1) {
      console.warn(message); // Warning and error level logs
    } else {
      console.log(message); // General logs
    }
    logToFile(message);
  }
};

// Initializing a Notion client
const notion = new Client({
  auth: process.env.NOTION_KEY,
});
log(1, "Notion client initialized successfully.");

// Database IDs from environment variables
const databaseIds = {
  keywords: process.env.NOTION_KEYWORD_ID,
  references: process.env.NOTION_REFERENCES_ID,
  projects: process.env.NOTION_PROJECTS_ID,
  tasks: process.env.NOTION_TASKS_ID,
  notes: process.env.NOTION_NOTES_ID,
  goals: process.env.NOTION_GOALS_ID,
  milestones: process.env.NOTION_MILESTONES_ID,
  areas: process.env.NOTION_AREAS_ID,
  entities: process.env.NOTION_ENTITIES_ID,
  slipbox: process.env.NOTION_SLIPBOX_ID,
};

// Function to retrieve properties for all databases
const getAllDatabaseProperties = async () => {
  const allProperties = {};

  for (const [dbName, dbId] of Object.entries(databaseIds)) {
    try {
      log(2, `Checking database ID for ${dbName}: ${dbId}`);
      if (!dbId || dbId.length === 0) {
        log(1, `Database ID for ${dbName} is missing or invalid.`);
        continue;
      }

      log(2, `Attempting to retrieve properties for database: ${dbName} (ID: ${dbId})`);
      
      // Add a delay to avoid hitting Notion's rate limit
      await sleep(200);

      const response = await notion.databases.retrieve({ database_id: dbId });
      log(2, `Successfully retrieved properties for database: ${dbName}`);

      if (response && response.properties) {
        const normalizedProperties = {};

        for (const [propName, propInfo] of Object.entries(response.properties)) {
          const normalizedPropName = normalizeString(propName);
          log(2, `Original prop: "${propName}" -> Normalized prop: "${normalizedPropName}"`);

          normalizedProperties[normalizedPropName] = propInfo;
        }

        const normalizedDbName = normalizeString(dbName);
        allProperties[normalizedDbName] = normalizedProperties;

        log(1, `Properties for database "${dbName}" normalized and stored under: "${normalizedDbName}"`);
      } else {
        log(1, `No properties found for database "${dbName}" (ID: ${dbId})`);
      }
    } catch (error) {
      log(1, `Error retrieving properties for database "${dbName}" (ID: ${dbId}): ${error.message}`);
      continue; // Continue to the next database in case of an error
    }
  }

  log(1, 'Final normalized properties object:', JSON.stringify(allProperties, null, 2));
  return allProperties;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Call the function if running as a standalone script
getAllDatabaseProperties().then((allProperties) => {
  console.log("Final normalized properties object:", JSON.stringify(allProperties, null, 2));
  log(1, `Final normalized properties object: ${JSON.stringify(allProperties, null, 2)}`);
}).catch((error) => {
  console.error("An error occurred during database property retrieval:", error);
  log(1, `An error occurred during database property retrieval: ${error.message}`);
});

module.exports = getAllDatabaseProperties;
