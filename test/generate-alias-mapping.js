const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load the .env file
dotenv.config();

// Create a map to store the database ID aliases from the .env file
const dbAliasMap = {};

// Extract relevant keys from process.env
Object.keys(process.env).forEach(key => {
  if (key.startsWith('NOTION_') && key.endsWith('_ID')) {
    const dbAlias = key.replace('NOTION_', '').replace('_ID', '');
    dbAliasMap[process.env[key]] = `${dbAlias}_DB`;
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
