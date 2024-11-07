// Load the necessary data
const dbAliasMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'output', 'db-aliases.json'), 'utf-8'));
const graphData = JSON.parse(fs.readFileSync(path.join(__dirname, 'graph-data.json'), 'utf-8'));

// Function to generate descriptive alias
const generateAlias = (nodeId, label, type) => {
  let alias = nodeId;

  // Step 1: Replace Database IDs with their corresponding aliases
  if (dbAliasMap[nodeId]) {
    alias = dbAliasMap[nodeId];
  }

  // Step 2: For non-database nodes, generate detailed alias using label and type
  if (label && type) {
    alias = `${alias}_${label}_${type}`; // e.g., "Projects_DB_⚙️ Related Projects_relation"
  }

  return alias;
};

// Update nodes with more descriptive aliases
graphData.nodes.forEach(node => {
  const { id, label, type } = node.data;

  // Generate a more descriptive alias
  const descriptiveAlias = generateAlias(id, label, type);
  node.data.label = descriptiveAlias;
  node.data.id = descriptiveAlias; // Update ID with the alias for consistent referencing
});

// Update edges to use transformed node IDs
graphData.edges.forEach(edge => {
  const { source, target, type } = edge.data;

  // Update source and target using the alias mapping or descriptive generation
  if (dbAliasMap[source]) {
    edge.data.source = dbAliasMap[source]; // Database source replacement
  } else {
    // Generate alias for relations
    const sourceNode = graphData.nodes.find(node => node.data.id === source);
    if (sourceNode) {
      edge.data.source = generateAlias(sourceNode.data.id, sourceNode.data.label, sourceNode.data.type);
    }
  }

  if (dbAliasMap[target]) {
    edge.data.target = dbAliasMap[target]; // Database target replacement
  } else {
    // Generate alias for relations
    const targetNode = graphData.nodes.find(node => node.data.id === target);
    if (targetNode) {
      edge.data.target = generateAlias(targetNode.data.id, targetNode.data.label, targetNode.data.type);
    }
  }

  // Optionally, add an alias to the edge itself for better understanding in visualizations
  edge.data.label = `${edge.data.source}_${edge.data.target}_${type}`;
});

// Save the transformed graph data to the output folder
const transformedGraphOutputPath = path.join(outputFolder, 'graph-data-transformed.json');
fs.writeFileSync(transformedGraphOutputPath, JSON.stringify(graphData, null, 2));
console.log('Transformed graph data saved as:', transformedGraphOutputPath);
