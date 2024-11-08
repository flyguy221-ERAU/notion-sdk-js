// ./scripts/get-props.js

import dotenv from 'dotenv'; // Load environment variables
import { Client } from '@notionhq/client';
import { improvedNormalizeString } from '../src/utils/normalize-utils.js';
import { logToFile } from '../src/utils/log-utils.js';

// Load the .env file
dotenv.config();

const LOG_LEVEL_NONE = 0;
const LOG_LEVEL_WARN = 1;
const LOG_LEVEL_VERBOSE = 2;

const DEBUG_LEVEL = LOG_LEVEL_VERBOSE; // 0 = No logs, 1 = Minimal logs, 2 = Full logs

const log = async (level, message) => {
  if (DEBUG_LEVEL >= level) {
    if (level === LOG_LEVEL_WARN) {
      console.warn(message); // Warning and error level logs
    } else {
      console.log(message); // General logs
    }
    await logToFile(message); // Assuming logToFile is an async function
  }
};

// Initializing a Notion client
const notion = new Client({
  auth: process.env.NOTION_KEY,
});
await log(LOG_LEVEL_WARN, "Notion client initialized successfully.");

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
      await log(LOG_LEVEL_VERBOSE, `Checking database ID for ${dbName}: ${dbId}`);
      if (!dbId || dbId.length === 0) {
        await log(LOG_LEVEL_WARN, `Database ID for ${dbName} is missing or invalid.`);
        continue;
      }

      await log(LOG_LEVEL_VERBOSE, `Attempting to retrieve properties for database: ${dbName} (ID: ${dbId})`);
      
      // Add a delay to avoid hitting Notion's rate limit
      await sleep(process.env.RATE_LIMIT_DELAY || 200);

      const response = await notion.databases.retrieve({ database_id: dbId });
      await log(LOG_LEVEL_VERBOSE, `Successfully retrieved properties for database: ${dbName}`);

      if (response && response.properties) {
        const normalizedProperties = {};

        for (const [propName, propInfo] of Object.entries(response.properties)) {
          const normalizedPropName = improvedNormalizeString(propName);
          await log(LOG_LEVEL_VERBOSE, `Original prop: "${propName}" -> Normalized prop: "${normalizedPropName}"`);

          normalizedProperties[normalizedPropName] = propInfo;
        }

        const normalizedDbName = improvedNormalizeString(dbName);
        allProperties[normalizedDbName] = normalizedProperties;

        await log(LOG_LEVEL_WARN, `Properties for database "${dbName}" normalized and stored under: "${normalizedDbName}"`);
      } else {
        await log(LOG_LEVEL_WARN, `No properties found for database "${dbName}" (ID: ${dbId})`);
      }
    } catch (error) {
      await log(LOG_LEVEL_WARN, `Error retrieving properties for database "${dbName}" (ID: ${dbId}): ${error.message}`);
      continue; // Continue to the next database in case of an error
    }
  }

  await log(LOG_LEVEL_WARN, 'Final normalized properties object:', JSON.stringify(allProperties, null, 2));
  return allProperties;
};

const RATE_LIMIT_DELAY = process.env.RATE_LIMIT_DELAY || 200; // Fallback to 200ms

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Call the function if running as a standalone script
getAllDatabaseProperties().then(async (allProperties) => {
  console.log("Final normalized properties object:", JSON.stringify(allProperties, null, 2));
  await log(LOG_LEVEL_WARN, `Final normalized properties object: ${JSON.stringify(allProperties, null, 2)}`);
}).catch(async (error) => {
  console.error("An error occurred during database property retrieval:", error);
  await log(LOG_LEVEL_WARN, `An error occurred during database property retrieval: ${error.message}`);
});

export default getAllDatabaseProperties;
