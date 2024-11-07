// src/content/utils/visualize-graph.js

const cytoscape = require('cytoscape');

const visualizeGraph = (nodes, edges) => {
  // Assuming there's a DOM element with id 'cy' to contain the graph
  document.addEventListener('DOMContentLoaded', function () {
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: {
        nodes,
        edges,
      },
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'width': 50,
            'height': 50,
            'background-color': '#0074D9',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
          },
        },
      ],
      layout: {
        name: 'cose',
        animate: true,
      },
    });
  });
};

module.exports = visualizeGraph;
