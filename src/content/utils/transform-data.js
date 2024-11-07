// src/content/utils/transform-data.js

const transformData = (allProperties) => {
  const nodes = [];
  const edges = [];
  const existingNodes = new Set();

  // Create nodes for each database and its properties
  for (const [dbName, dbProperties] of Object.entries(allProperties)) {
    // Add a node for each database
    nodes.push({ data: { id: dbName, label: dbName, type: 'database' } });
    existingNodes.add(dbName);

    for (const [propertyName, propertyDetails] of Object.entries(dbProperties)) {
      // Create a unique ID for each property node
      const propertyId = `${dbName}-${propertyDetails.id}`;
      nodes.push({ data: { id: propertyId, label: propertyName, type: propertyDetails.type } });
      existingNodes.add(propertyId);

      // Connect database node to property node
      edges.push({ data: { source: dbName, target: propertyId, type: 'contains' } });

      // Handle relations
      if (propertyDetails.type === "relation") {
        const relationDetails = propertyDetails.relation;

        // Check if the relation has a database_id, indicating the target database
        if (relationDetails && relationDetails.database_id) {
          const relatedDatabase = relationDetails.database_id;

          // Ensure the related database node exists
          if (!existingNodes.has(relatedDatabase)) {
            nodes.push({ data: { id: relatedDatabase, label: `Database ${relatedDatabase}`, type: 'database' } });
            existingNodes.add(relatedDatabase);
          }

          // Create an edge to represent the relationship
          edges.push({ data: { source: propertyId, target: relatedDatabase, type: 'relation' } });
        } else {
          console.warn(`Relation details for property '${propertyName}' in database '${dbName}' are incomplete:`, relationDetails);
        }
      }
    }
  }

  return { nodes, edges };
};

module.exports = transformData;
