const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../employees.json');

/**
 * Read employees data from JSON file
 * @returns {Promise<Array>} Array of employee objects
 */
async function read() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    if (error.code === 'ENOENT') {
      console.log('employees.json not found. Creating new file...');
      await write([]);
      return [];
    }
    console.error('Error reading employees.json:', error.message);
    throw error;
  }
}

/**
 * Write employees data to JSON file
 * @param {Array} data - Array of employee objects
 * @returns {Promise<void>}
 */
async function write(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Data successfully written to employees.json');
  } catch (error) {
    console.error('Error writing to employees.json:', error.message);
    throw error;
  }
}

/**
 * Find employee by ID
 * @param {number} id - Employee ID
 * @returns {Promise<Object|null>} Employee object or null if not found
 */
async function findById(id) {
  try {
    const employees = await read();
    return employees.find(emp => emp.id === parseInt(id)) || null;
  } catch (error) {
    console.error('Error finding employee:', error.message);
    throw error;
  }
}

/**
 * Add new employee
 * @param {Object} employee - Employee object
 * @returns {Promise<void>}
 */
async function addEmployee(employee) {
  try {
    const employees = await read();
    employees.push(employee);
    await write(employees);
  } catch (error) {
    console.error('Error adding employee:', error.message);
    throw error;
  }
}

/**
 * Update employee by ID
 * @param {number} id - Employee ID
 * @param {Object} updatedData - Updated employee data
 * @returns {Promise<boolean>} True if updated, false if not found
 */
async function updateEmployee(id, updatedData) {
  try {
    const employees = await read();
    const index = employees.findIndex(emp => emp.id === parseInt(id));
    
    if (index === -1) {
      return false;
    }
    
    employees[index] = { ...employees[index], ...updatedData };
    await write(employees);
    return true;
  } catch (error) {
    console.error('Error updating employee:', error.message);
    throw error;
  }
}

/**
 * Delete employee by ID
 * @param {number} id - Employee ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteEmployee(id) {
  try {
    const employees = await read();
    const filteredEmployees = employees.filter(emp => emp.id !== parseInt(id));
    
    if (filteredEmployees.length === employees.length) {
      return false; // Employee not found
    }
    
    await write(filteredEmployees);
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error.message);
    throw error;
  }
}

module.exports = {
  read,
  write,
  findById,
  addEmployee,
  updateEmployee,
  deleteEmployee
};
