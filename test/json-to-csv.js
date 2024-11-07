const fs = require('fs');
const path = require('path');

// Load the graph data from JSON file
const graphData = JSON.parse(fs.readFileSync('graph-data.json', 'utf-8'));

// Extract nodes and edges
const { nodes, edges } = graphData;

// Prepare CSV content for nodes
let nodesCsv = 'Id,Label,Type\n';
nodes.forEach(node => {
  const { id, label, type } = node.data;
  nodesCsv += `${id},${label},${type}\n`;
});

// Ensure the output folder exists
const outputFolder = path.join(__dirname, 'output');
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Write nodes CSV to file
fs.writeFileSync(path.join(outputFolder, 'nodes.csv'), nodesCsv);
console.log('Nodes CSV file written: nodes.csv');

// Prepare CSV content for edges
let edgesCsv = 'Source,Target,Type\n';
edges.forEach(edge => {
  const { source, target, type } = edge.data;
  edgesCsv += `${source},${target},${type}\n`;
});



// Write edges CSV to file
fs.writeFileSync(path.join(outputFolder, 'edges.csv'), edgesCsv);
console.log('Edges CSV file written: edges.csv');
