const fs = require('fs').promises;
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'employees.json');

async function read() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading file:', err.message);
    return [];
  }
}

async function write(data) {
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing file:', err.message);
  }
}

module.exports = { read, write };
