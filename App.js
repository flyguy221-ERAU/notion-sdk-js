// app.js
const express = require('express');
const path = require('path');
const getAllDatabaseProperties = require('./scripts/get-props');
const transformData = require('./scripts/transform-data');
const visualizeGraph = require('./scripts/visualize-graph');
const { getDatabaseAlias } = require('./src/utils/alias-utils'); // Refactored alias utility

const app = express();
const PORT = 3000;

// Static middleware to serve any files from the views folder
app.use(express.static(path.join(__dirname, 'views')));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Endpoint to get transformed graph data
app.get('/graph-data', async (req, res) => {
  try {
    // Step 1: Retrieve properties from Notion
    const allProperties = await getAllDatabaseProperties();

    // Step 2: Generate aliases for database IDs
    const dbAliasMap = {};  // Initialize an empty map
    for (const dbId of Object.keys(allProperties)) {
      dbAliasMap[dbId] = getDatabaseAlias(dbId); // Use your refactored utility
    }

    // Step 3: Transform properties into nodes and edges for visualization
    const { nodes, edges } = transformData(allProperties, dbAliasMap);

    // Step 4: Optionally visualize or add further formatting
    const finalGraphData = visualizeGraph(nodes, edges);

    // Return the graph data as JSON
    res.json(finalGraphData);
  } catch (error) {
    console.error("Error in generating the graph data:", error.message);
    res.status(500).send("Error generating the graph data");
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
