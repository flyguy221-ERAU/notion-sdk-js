// centralized-alias-utils.js

const fs = require('fs');
const path = require('path');

// Load the .env file for environment variables
require('dotenv').config();

// Define cache for alias lookup to improve performance
const aliasCache = {};

// Load the database alias mapping from db-aliases.json
let dbAliasMap = {};
const aliasFilePath = path.join(__dirname, 'output', 'db-aliases.json');

// Helper function to load alias map from file
const loadAliasMap = () => {
  if (!dbAliasMap || Object.keys(dbAliasMap).length === 0) {
    try {
      dbAliasMap = JSON.parse(fs.readFileSync(aliasFilePath, 'utf-8'));
    } catch (error) {
      console.warn('Warning: Unable to load db-aliases.json:', error.message);
    }
  }
  return dbAliasMap;
};

// Helper function to normalize UUIDs
const normalizeUUID = (uuid) => uuid.replace(/-/g, '');

// Centralized alias generation function
const generateAlias = (nodeId, label = '', type = '') => {
  loadAliasMap(); // Ensure the alias map is loaded

  // First, check the cache to avoid redundant work
  if (aliasCache[nodeId]) {
    return aliasCache[nodeId];
  }

  // Normalize UUID before checking alias map
  const normalizedUuid = normalizeUUID(nodeId);

  // Step 1: Try to get alias from dbAliasMap using both the original and normalized UUID
  let alias = dbAliasMap[normalizedUuid] || dbAliasMap[nodeId] || null;

  // Step 2: Fallback to generating a detailed alias if not found in dbAliasMap
  if (!alias && label && type) {
    alias = `${normalizedUuid}_${label}_${type}`; // e.g., "30d88b7b-d7ee-42be_PROJECTS_relation"
  } else if (!alias) {
    alias = `UNKNOWN_${nodeId}`; // Fallback if label and type are also unavailable
  }

  // Step 3: Cache the generated alias for future lookups
  aliasCache[nodeId] = alias;

  return alias;
};

module.exports = {
  generateAlias,
  normalizeUUID,
};

// Example Usage in Other Scripts
// const { generateAlias, normalizeUUID } = require('./centralized-alias-utils');
// const alias = generateAlias(nodeId, label, type);
