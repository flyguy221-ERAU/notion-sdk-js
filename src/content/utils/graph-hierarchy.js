const fs = require('fs');
const path = require('path');

// Load the graph data from the transformed JSON file
const graphFilePath = path.join(__dirname, 'output', 'graph-data-transformed.json');
let graphData;

try {
  graphData = JSON.parse(fs.readFileSync(graphFilePath, 'utf-8'));
} catch (error) {
  console.error(`Error reading graph data from ${graphFilePath}:`, error.message);
  process.exit(1);
}

const { nodes, edges } = graphData;

// Function to extract and organize database information
function extractDatabaseHierarchy(nodes) {
  let output = '';

  // Create a map to hold database properties
  const databaseMap = {};

  // First, gather all database nodes
  nodes.forEach(node => {
    const { id, label, type } = node.data;

    // If the node is a database, initialize its properties structure
    if (type === 'database') {
      databaseMap[id] = {
        label: label,
        properties: {}
      };
    }
  });

  // Then, associate properties to the databases
  nodes.forEach(node => {
    const { id, label, type } = node.data;

    // Check if the node is a property type (e.g., relation, rollup)
    if (type === 'relation' || type === 'rollup' || type === 'select' || type === 'multi_select' || type === 'rich_text' || type === 'title' || type === 'date' || type === 'checkbox' || type === 'formula' || type === 'created_time' || type === 'last_edited_time') {
      // Extract database alias (the source of this property)
      edges.forEach(edge => {
        if (edge.data.target === id && databaseMap[edge.data.source]) {
          // Add property to the corresponding database
          databaseMap[edge.data.source].properties[label] = type;
        }
      });
    }
  });

  // Generate output based on the databaseMap
  for (const [dbId, dbInfo] of Object.entries(databaseMap)) {
    output += `# ${dbInfo.label}\n\n`;
    output += `**Database ID**: ${dbId}\n\n`;
    output += `## Properties:\n\n`;

    for (const [propertyName, propertyType] of Object.entries(dbInfo.properties)) {
      output += `- **${propertyName}** (${propertyType})\n`;
    }

    output += '\n---\n\n';
  }

  return output;
}

// Extract the database hierarchy information
const databaseHierarchy = extractDatabaseHierarchy(nodes);

// Write the hierarchy to a text file
const outputFilePath = path.join(__dirname, 'output', 'graph_hierarchy.txt');
fs.writeFileSync(outputFilePath, databaseHierarchy);
console.log(`Database hierarchy saved to: ${outputFilePath}`);
