const fs = require('fs');
const path = require('path');

// Define the output folder path
const outputFolder = path.join(__dirname, 'output');

// Load the graph data from JSON file
const graphDataPath = path.join(outputFolder, 'graph-data-transformed.json');
if (!fs.existsSync(graphDataPath)) {
  console.error('Error: graph-data-transformed.json not found in the output folder. Make sure you have run the transformation script.');
  process.exit(1);
}

const graphData = JSON.parse(fs.readFileSync(graphDataPath, 'utf-8'));

// Extract nodes and edges
const { nodes, edges } = graphData;

if (!nodes || !edges) {
  console.error('Error: Nodes or edges data missing in the graph data.');
  process.exit(1);
}

// Prepare CSV content for nodes
let nodesCsv = 'Id,Label,Type\n';
nodes.forEach(node => {
  const { id, label, type } = node.data;
  nodesCsv += `"${id}","${label}","${type}"\n`; // Using quotes to handle special characters safely
});

// Ensure the output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Write nodes CSV to file
const nodesCsvPath = path.join(outputFolder, 'nodes.csv');
fs.writeFileSync(nodesCsvPath, nodesCsv);
console.log(`Nodes CSV file written: ${nodesCsvPath}`);

// Prepare CSV content for edges
let edgesCsv = 'Source,Target,Type\n';
edges.forEach(edge => {
  const { source, target, type } = edge.data;
  edgesCsv += `"${source}","${target}","${type}"\n`; // Using quotes to handle special characters safely
});

// Write edges CSV to file
const edgesCsvPath = path.join(outputFolder, 'edges.csv');
fs.writeFileSync(edgesCsvPath, edgesCsv);
console.log(`Edges CSV file written: ${edgesCsvPath}`);
