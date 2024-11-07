const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load the .env file
dotenv.config();

// Helper function to normalize UUIDs
const normalizeUUID = (uuid) => uuid.replace(/-/g, '');

// Create a map to store the database ID aliases from the .env file
const dbAliasMap = {};

// Extract relevant keys from process.env
Object.keys(process.env).forEach(key => {
  if (key.startsWith('NOTION_') && key.endsWith('_ID')) {
    const readableName = key.replace('NOTION_', '').replace('_ID', '').toLowerCase(); // e.g., "projects"
    const uuid = process.env[key]; // e.g., "30d88b7b-d7ee-42be-b856-c9bc73cdc110"
    const normalizedUuid = normalizeUUID(uuid); // Normalize UUID by removing hyphens

    const dbAlias = `${readableName.toUpperCase()}_DB`; // e.g., "PROJECTS_DB"

    // Map both the UUID and the readable name to the alias
    dbAliasMap[normalizedUuid] = dbAlias;          // Normalized UUID as key
    dbAliasMap[readableName] = dbAlias;  // Readable name as key
  }
});

// Ensure the output folder exists
const outputFolder = path.join(__dirname, 'output');
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Save the alias map for reference
const aliasesOutputPath = path.join(outputFolder, 'db-aliases.json');
fs.writeFileSync(aliasesOutputPath, JSON.stringify(dbAliasMap, null, 2));
console.log('Database alias mapping generated:', dbAliasMap);
