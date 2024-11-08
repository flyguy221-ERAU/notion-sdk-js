// src/content/utils/print-db-heads.js

require('dotenv').config();  // This will load all variables from .env file

// Accessing the API token and database ID from environment variables
const { Client } = require("@notionhq/client")

// Initializing a client
const notion = new Client({
	auth: process.env.NOTION_KEY,
})

const KEYWORD_ID = process.env.NOTION_KEYWORD_ID;
const REFERENCES_ID = process.env.NOTION_REFERENCES_ID;
const PROJECTS_ID = process.env.NOTION_PROJECTS_ID;
const TASKS_ID = process.env.NOTION_TASKS_ID;
const NOTES_ID = process.env.NOTION_NOTES_ID;
const GOALS_ID = process.env.NOTION_GOALS_ID;
const MILESTONES_ID = process.env.NOTION_MILESTONES_ID;
const AREAS_ID = process.env.NOTION_AREAS_ID;
const ENTITIES_ID = process.env.NOTION_ENTITIES_ID;
const SLIPBOX_ID = process.env.NOTION_SLIPBOX_ID;

const retrieveProperties = async (databaseId) => {
  const response = await notion.databases.retrieve({ database_id: databaseId });
  if (response && response.properties) {
    const properties = Object.keys(response.properties).map(propertyName => {
      const property = response.properties[propertyName];
      return {
        name: property.name,
        id: property.id,
        type: property.type
      };
    });
    console.table(properties);
  }
};

// List of all database IDs
const databaseIds = [
  KEYWORD_ID,
  REFERENCES_ID,
  PROJECTS_ID,
  TASKS_ID,
  NOTES_ID,
  GOALS_ID,
  MILESTONES_ID,
  AREAS_ID,
  ENTITIES_ID,
  SLIPBOX_ID
];

// Iterate over all database IDs
databaseIds.forEach(databaseId => {
  retrieveProperties(databaseId);
});