const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, '../../output/log.txt');

const logToFile = (message) => {
  fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
};

module.exports = { logToFile };
