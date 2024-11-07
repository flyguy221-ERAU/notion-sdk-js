// app.js
const express = require('express');
const path = require('path');
const getAllDatabaseProperties = require('./src/content/utils/get-props');
const transformData = require('./src/content/utils/transform-data');
const visualizeGraph = require('./src/content/utils/visualize-graph');

const app = express();
const PORT = 3000;

// Static middleware to serve any files from the views folder
app.use(express.static(path.join(__dirname, 'views')));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Example endpoint to get transformed data if needed
app.get('/graph-data', async (req, res) => {
  try {
    // Step 1: Get properties from Notion
    const allProperties = await getAllDatabaseProperties();

    // Step 2: Transform properties into nodes and edges for visualization
    const { nodes, edges } = transformData(allProperties);

    // Return graph data as JSON (could be useful for dynamic visualization)
    res.json({ nodes, edges });
  } catch (error) {
    console.error("Error in generating the graph data:", error.message);
    res.status(500).send("Error generating the graph data");
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
