// alias-gen.js
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { normalizeUUID, normalizeString } = require('./centralized-alias-utils');

// Load the .env file
dotenv.config();

// Check if environment variables are being loaded properly
console.log('Loaded environment variables:', process.env);

// Create a map to store the database ID aliases from the .env file
const dbAliasMap = {};

// Extract relevant keys from process.env
Object.keys(process.env).forEach(key => {
  if (key.startsWith('NOTION_') && key.endsWith('_ID')) {
    let readableName = key.replace('NOTION_', '').replace('_ID', '');
    readableName = normalizeString(readableName); // Clean up readable names
    const uuid = process.env[key]; // e.g., "32 character Notion Database ID"
    
    // Check if the UUID exists and is not empty
    if (!uuid) {
      console.warn(`Warning: Environment variable ${key} is not set or empty.`);
      return; // Skip this entry if the UUID is empty
    }

    const normalizedUuid = normalizeUUID(uuid); // Normalize UUID by removing hyphens
    const dbAlias = `${normalizeString(readableName.toUpperCase())}_DB`; // e.g., "PROJECTS_DB", ensuring no emojis or unwanted characters

    // Map both the UUID and the readable name to the alias
    dbAliasMap[normalizedUuid] = dbAlias;          // Normalized UUID as key
    dbAliasMap[normalizeString(readableName)] = dbAlias;  // Clean readable name as key

    // Log to ensure the entry is correctly added
    console.log(`Mapping added: ${uuid} (normalized: ${normalizedUuid}) to alias: ${dbAlias}`);
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

// Export alias map
module.exports = dbAliasMap;
