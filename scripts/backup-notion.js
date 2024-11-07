require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');

// Initialize Notion client with API key from environment variable
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Get the backup path from environment variable
const backupPath = process.env.BACKUP_PATH;
if (!backupPath) {
  console.error('Error: BACKUP_PATH is not defined in the .env file.');
  process.exit(1);
}

// Ensure the backup path exists
if (!fs.existsSync(backupPath)) {
  fs.mkdirSync(backupPath, { recursive: true });
}

// Function to retrieve a list of Notion databases
async function getDatabases() {
  try {
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'database',
      },
    });
    return response.results;
  } catch (error) {
    console.error('Error retrieving databases:', error.message);
    process.exit(1);
  }
}

// Function to retrieve pages from a database
async function getPagesFromDatabase(databaseId) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    return response.results;
  } catch (error) {
    console.error(`Error retrieving pages from database ${databaseId}:`, error.message);
    return [];
  }
}

// Main function to back up Notion data
async function backupNotion() {
  try {
    console.log('Starting Notion backup...');
    const databases = await getDatabases();

    for (const database of databases) {
      const dbName = database.title[0]?.plain_text || 'Untitled';
      const dbId = database.id.replace(/-/g, ''); // Normalize the ID (removing hyphens)
      const dbBackupPath = path.join(backupPath, `${dbName}_${dbId}.json`);

      console.log(`Backing up database: ${dbName} (ID: ${dbId})...`);

      // Retrieve pages from the database
      const pages = await getPagesFromDatabase(database.id);

      // Prepare the backup data
      const backupData = {
        databaseName: dbName,
        databaseId: dbId,
        pages: pages,
      };

      // Write backup data to a file
      fs.writeFileSync(dbBackupPath, JSON.stringify(backupData, null, 2));
      console.log(`Database ${dbName} backed up to ${dbBackupPath}`);
    }

    console.log('Notion backup completed successfully!');
  } catch (error) {
    console.error('Error during Notion backup:', error.message);
  }
}

// Execute the backup function
backupNotion();
