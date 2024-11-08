const fs = require('fs');
const path = require('path');

// Define the output folder path
const outputFolder = path.join(__dirname, 'output');

// Helper function to normalize UUIDs
const normalizeUUID = (uuid) => uuid.replace(/-/g, '');

// Load alias mapping and graph data
const dbAliasMap = JSON.parse(fs.readFileSync(path.join(outputFolder, 'db-aliases.json'), 'utf-8'));
const graphData = JSON.parse(fs.readFileSync(path.join(outputFolder, 'graph-data.json'), 'utf-8'));

// Function to generate descriptive alias
const generateAlias = (nodeId, label, type) => {
  // Step 1: Replace Database IDs with their corresponding aliases
  let alias = dbAliasMap[normalizeUUID(nodeId)] || dbAliasMap[nodeId] || null;

  // Step 2: Fallback to a combination of node ID, label, and type if alias not found
  if (!alias && label && type) {
    alias = `${nodeId}_${label}_${type}`; // e.g., "Projects_DB_⚙️ Related Projects_relation"
  } else if (!alias) {
    // If there's no alias and no label/type available, fallback to using a clear identifier
    alias = `UNKNOWN_${nodeId}`;
  }

  return alias;
};

// Main transformation function
const transformData = (allProperties) => {
  const nodes = [];
  const edges = [];
  const existingNodes = new Set();

  // Iterate through allProperties to create nodes and edges
  for (const [dbId, dbProperties] of Object.entries(allProperties)) {
    // Normalize dbId to match the alias map
    const normalizedDbId = normalizeUUID(dbId);
    const dbAlias = dbAliasMap[normalizedDbId] || dbAliasMap[dbId] || null;

    if (!dbAlias) {
      console.warn(`Warning: Alias not found for database ID ${dbId}`);
      continue; // Skip any database that does not have an alias
    }

    // Add a node for each database using its alias
    if (!existingNodes.has(dbAlias)) {
      nodes.push({ data: { id: dbAlias, label: dbAlias, type: 'database' } });
      existingNodes.add(dbAlias);
    }

    for (const [propertyName, propertyDetails] of Object.entries(dbProperties)) {
      // Create a unique ID for each property node by combining the database alias and property name
      const propertyId = `${dbAlias}-${propertyDetails.id}`;
      const propertyAlias = generateAlias(propertyId, propertyName, propertyDetails.type);

      if (!existingNodes.has(propertyAlias)) {
        nodes.push({ data: { id: propertyAlias, label: propertyName, type: propertyDetails.type } });
        existingNodes.add(propertyAlias);
      }

      // Connect database node to property node
      edges.push({ data: { source: dbAlias, target: propertyAlias, type: 'contains' } });

      // Handle relations
      if (propertyDetails.type === "relation" && propertyDetails.relation?.database_id) {
        const relatedDatabaseId = propertyDetails.relation.database_id;
        const normalizedRelatedId = normalizeUUID(relatedDatabaseId);
        const relatedAlias = dbAliasMap[normalizedRelatedId] || dbAliasMap[relatedDatabaseId] || null;

        if (!relatedAlias) {
          console.warn(`Warning: Alias not found for related database ID ${relatedDatabaseId}`);
          continue; // Skip any relationship if the related database ID doesn't have an alias
        }

        // Ensure related database is in the nodes list
        if (!existingNodes.has(relatedAlias)) {
          nodes.push({ data: { id: relatedAlias, label: relatedAlias, type: 'database' } });
          existingNodes.add(relatedAlias);
        }

        // Create an edge to represent the relationship
        edges.push({ data: { source: propertyAlias, target: relatedAlias, type: 'relation' } });
      }
    }
  }

  // Ensure the output folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  // Export the nodes and edges to a new JSON file
  const transformedGraphOutputPath = path.join(outputFolder, 'graph-data-transformed.json');
  const transformedGraphData = { nodes, edges };
  fs.writeFileSync(transformedGraphOutputPath, JSON.stringify(transformedGraphData, null, 2));
  console.log('Transformed graph data saved as:', transformedGraphOutputPath);

  return transformedGraphData;
};

// Export the transformData function
module.exports = transformData;
