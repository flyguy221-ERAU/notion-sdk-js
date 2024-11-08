const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Paths to the CSV files
const nodesFilePath = path.join(__dirname, 'output', 'nodes.csv');
const edgesFilePath = path.join(__dirname, 'output', 'edges.csv');

// Load nodes and edges data from CSV files
let nodes = [];
let edges = [];

// Load nodes data
fs.createReadStream(nodesFilePath)
  .pipe(csv())
  .on('data', (row) => {
    nodes.push(row);
  })
  .on('end', () => {
    console.log('Nodes CSV file successfully processed.');
    loadEdges();
  });

// Load edges data
function loadEdges() {
  fs.createReadStream(edgesFilePath)
    .pipe(csv())
    .on('data', (row) => {
      edges.push(row);
    })
    .on('end', () => {
      console.log('Edges CSV file successfully processed.');
      generateMermaidDiagram();
    });
}

// Function to normalize IDs for consistency
function normalizeId(id) {
  return id.replace(/[^a-zA-Z0-9_]/g, '').toUpperCase(); // Remove special characters and uppercase
}

// Function to generate Mermaid ERD code from nodes and edges data
function generateMermaidDiagram() {
  let mermaidCode = 'erDiagram\n';

  // Create a map of nodes to keep track of databases and their properties
  const databaseMap = {};

  // Helper function to clean property names for Mermaid
  const cleanName = (name) => {
    return name
      .replace(/[^a-zA-Z0-9_]/g, '_') // Replace non-alphanumeric characters with underscores
      .replace(/\s+/g, '_')            // Replace spaces with underscores
      .toUpperCase();                  // Convert to uppercase for consistency
  };

  // Iterate through nodes and build a map of databases and their properties
  nodes.forEach(node => {
    const { Id, Label, Type } = node;

    // Normalize ID for consistency
    const normalizedId = normalizeId(Id);
    
    console.log(`Processing Node - Original ID: ${Id}, Normalized ID: ${normalizedId}, Label: ${Label}, Type: ${Type}`);

    if (Type === 'database') {
      // Initialize database with its label and an empty properties list
      databaseMap[normalizedId] = {
        label: cleanName(Label), // Clean label for Mermaid compatibility
        properties: [],
      };
    } else {
      // If it's a property, add it to the corresponding database
      const parentId = normalizeId(Id.split('-')[0]);
      if (databaseMap[parentId]) {
        databaseMap[parentId].properties.push({ name: cleanName(Label), type: Type });
      } else {
        console.warn(`Warning: Parent database not found for property with ID: ${Id}`);
      }
    }
  });

  // Generate Mermaid syntax for databases (entities) and their properties
  for (const [dbId, dbInfo] of Object.entries(databaseMap)) {
    mermaidCode += `  ${dbInfo.label} {\n`;
    dbInfo.properties.forEach(property => {
      mermaidCode += `    ${property.type.toUpperCase()} ${property.name}\n`;
    });
    mermaidCode += `  }\n`;
  }

  // Generate Mermaid syntax for relationships between databases
  edges.forEach(edge => {
    const { Source, Target, Type } = edge;

    // Normalize IDs for matching
    const normalizedSource = normalizeId(Source);
    const normalizedTarget = normalizeId(Target);

    console.log(`Processing Edge - Original Source: ${Source}, Normalized Source: ${normalizedSource}, Original Target: ${Target}, Normalized Target: ${normalizedTarget}`);

    // Only add relationships if both Source and Target are databases
    if (databaseMap[normalizedSource] && databaseMap[normalizedTarget]) {
      const sourceLabel = databaseMap[normalizedSource].label;
      const targetLabel = databaseMap[normalizedTarget].label;

      // Log the relationship being added for debugging purposes
      console.log(`Adding relationship: ${sourceLabel} -> ${targetLabel} (${Type})`);

      // Differentiate between relation types
      if (Type === 'relation') {
        mermaidCode += `  ${sourceLabel} ||--o| ${targetLabel} : RELATION\n`;
      } else if (Type === 'rollup') {
        mermaidCode += `  ${sourceLabel} }o--o| ${targetLabel} : ROLLUP\n`;
      } else {
        console.warn(`Unknown edge type: ${Type}`);
      }
    } else {
      // Debug information if an edge was skipped
      if (!databaseMap[normalizedSource]) {
        console.warn(`Skipping edge: Source database not found for ID: ${Source} (Normalized: ${normalizedSource})`);
      }
      if (!databaseMap[normalizedTarget]) {
        console.warn(`Skipping edge: Target database not found for ID: ${Target} (Normalized: ${normalizedTarget})`);
      }
    }
  });

  // Write the Mermaid code to a file
  const outputFilePath = path.join(__dirname, 'output', 'database_mermaid_diagram.mmd');
  fs.writeFileSync(outputFilePath, mermaidCode);
  console.log(`Mermaid ER diagram saved to: ${outputFilePath}`);
}

