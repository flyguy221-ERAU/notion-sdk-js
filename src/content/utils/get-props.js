require('dotenv').config();  // Load environment variables
const { Client } = require('@notionhq/client');

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
      const response = await notion.databases.retrieve({ database_id: dbId });
      if (response && response.properties) {
        console.log(`Properties for database: ${dbName}`);
        console.dir(response.properties, { depth: null }); // Use console.dir for better visualization of objects
        allProperties[dbName] = response.properties;
      }
    } catch (error) {
      console.error(`Error retrieving properties for database ${dbName}:`, error.message);
    }
  }

  return allProperties;
};

module.exports = getAllDatabaseProperties;
