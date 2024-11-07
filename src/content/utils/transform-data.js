const fs = require('fs');

// Modified version to save nodes and edges to a JSON file
const transformData = (allProperties) => {
  const nodes = [];
  const edges = [];
  const existingNodes = new Set();

  for (const [dbName, dbProperties] of Object.entries(allProperties)) {
    nodes.push({ data: { id: dbName, label: dbName, type: 'database' } });
    existingNodes.add(dbName);

    for (const [propertyName, propertyDetails] of Object.entries(dbProperties)) {
      const propertyId = `${dbName}-${propertyDetails.id}`;
      nodes.push({ data: { id: propertyId, label: propertyName, type: propertyDetails.type } });
      existingNodes.add(propertyId);

      edges.push({ data: { source: dbName, target: propertyId, type: 'contains' } });

      if (propertyDetails.type === "relation" && propertyDetails.relation?.database_id) {
        const relatedDatabase = propertyDetails.relation.database_id;

        if (!existingNodes.has(relatedDatabase)) {
          nodes.push({ data: { id: relatedDatabase, label: `Database ${relatedDatabase}`, type: 'database' } });
          existingNodes.add(relatedDatabase);
        }

        edges.push({ data: { source: propertyId, target: relatedDatabase, type: 'relation' } });
      }
    }
  }

  // Export the nodes and edges to a file
  const graphData = { nodes, edges };
  fs.writeFileSync('graph-data.json', JSON.stringify(graphData, null, 2));

  return graphData;
};

module.exports = transformData;
