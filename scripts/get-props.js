require('dotenv').config();  // Load environment variables
const { Client } = require('@notionhq/client');
const { normalizeString } = require('./normalize-utils');

// Initializing a Notion client
const notion = new Client({
  auth: process.env.NOTION_KEY,
});

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
      console.log(`Retrieving properties for database: ${dbName} (ID: ${dbId})`); // Step verification
      const response = await notion.databases.retrieve({ database_id: dbId });

      // Log the response to check if it is as expected
      console.log(`Response for ${dbName}:`, response);

      if (response && response.properties) {
        // Normalize properties before saving them
        const normalizedProperties = {};
        for (const [propName, propInfo] of Object.entries(response.properties)) {
          // Normalize property name
          const normalizedPropName = normalizeString(propName);

          // Log the normalized property name for verification
          console.log(`Original prop: "${propName}" -> Normalized prop: "${normalizedPropName}"`);

          // Store normalized property info
          normalizedProperties[normalizedPropName] = propInfo;
        }

        // Normalize the database name and save properties
        const normalizedDbName = normalizeString(dbName);
        allProperties[normalizedDbName] = normalizedProperties;
        console.log(`Properties for database ${dbName} normalized and stored under: "${normalizedDbName}"`);
      } else {
        console.warn(`No properties found for database ${dbName} (ID: ${dbId})`);
      }
    } catch (error) {
      console.error(`Error retrieving properties for database ${dbName} (ID: ${dbId}):`, error);
    }
  }

  console.log('Final normalized properties object:', allProperties); // Log the entire normalized output
  return allProperties;
};

module.exports = getAllDatabaseProperties;
