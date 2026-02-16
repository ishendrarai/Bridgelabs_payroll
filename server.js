const express = require('express');
const path = require('path');
const fileHandler = require('./modules/fileHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Configuration
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==================== ROUTES ====================

/**
 * Dashboard - Display all employees
 * GET /
 */
app.get('/', async (req, res) => {
  try {
    const employees = await fileHandler.read();
    res.render('index', { employees });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
});

/**
 * Add Employee Form
 * GET /add
 */
app.get('/add', (req, res) => {
  res.render('add');
});

/**
 * Add Employee - Process Form
 * POST /add
 */
app.post('/add', async (req, res) => {
  try {
    const { name, department, basicSalary } = req.body;

    // Validation
    if (!name || !department || !basicSalary) {
      return res.status(400).send('All fields are required');
    }

    if (name.trim() === '') {
      return res.status(400).send('Employee name cannot be empty');
    }

    const salary = Number(basicSalary);
    if (isNaN(salary) || salary <= 0) {
      return res.status(400).send('Salary must be a positive number');
    }

    // Create new employee object
    const newEmployee = {
      id: Date.now(), // Unique ID using timestamp
      name: name.trim(),
      department: department.trim(),
      basicSalary: salary
    };

    // Add to database
    await fileHandler.addEmployee(newEmployee);

    console.log(`✅ New employee added: ${newEmployee.name}`);
    
    // Redirect to dashboard
    res.redirect('/');
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).send('Error adding employee');
  }
});

/**
 * Edit Employee Form
 * GET /edit/:id
 */
app.get('/edit/:id', async (req, res) => {
  try {
    const employee = await fileHandler.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).send('Employee not found');
    }

    res.render('edit', { employee });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.status(500).send('Error loading edit form');
  }
});

/**
 * Update Employee - Process Form
 * POST /edit/:id
 */
app.post('/edit/:id', async (req, res) => {
  try {
    const { name, department, basicSalary } = req.body;

    // Validation
    if (!name || !department || !basicSalary) {
      return res.status(400).send('All fields are required');
    }

    if (name.trim() === '') {
      return res.status(400).send('Employee name cannot be empty');
    }

    const salary = Number(basicSalary);
    if (isNaN(salary) || salary <= 0) {
      return res.status(400).send('Salary must be a positive number');
    }

    // Update employee data
    const updatedData = {
      name: name.trim(),
      department: department.trim(),
      basicSalary: salary
    };

    const success = await fileHandler.updateEmployee(req.params.id, updatedData);

    if (!success) {
      return res.status(404).send('Employee not found');
    }

    console.log(`✅ Employee updated: ${updatedData.name}`);
    
    // Redirect to dashboard
    res.redirect('/');
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).send('Error updating employee');
  }
});

/**
 * Delete Employee
 * GET /delete/:id
 */
app.get('/delete/:id', async (req, res) => {
  try {
    const success = await fileHandler.deleteEmployee(req.params.id);

    if (!success) {
      return res.status(404).send('Employee not found');
    }

    console.log(`🗑️ Employee deleted (ID: ${req.params.id})`);
    
    // Redirect to dashboard
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).send('Error deleting employee');
  }
});

/**
 * 404 Handler - Page Not Found
 */
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>404 - Page Not Found</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
        }
        .container {
          background: white;
          padding: 3rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        h1 { font-size: 4rem; color: #e74c3c; margin: 0; }
        p { font-size: 1.2rem; color: #7f8c8d; margin: 1rem 0; }
        a {
          display: inline-block;
          padding: 1rem 2rem;
          background: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          margin-top: 1rem;
          font-weight: 600;
        }
        a:hover { background: #2980b9; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <a href="/">← Back to Dashboard</a>
      </div>
    </body>
    </html>
  `);
});

// ==================== SERVER START ====================

/**
 * Start the server and verify data file
 */
app.listen(PORT, async () => {
  console.log('='.repeat(50));
  console.log('🚀 Employee Payroll System');
  console.log('='.repeat(50));
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ View Dashboard: http://localhost:${PORT}`);
  console.log(`✓ Add Employee: http://localhost:${PORT}/add`);
  console.log('='.repeat(50));

  // Log initial employee data
  try {
    const employees = await fileHandler.read();
    console.log(`📊 Current Employees: ${employees.length}`);
    if (employees.length > 0) {
      console.log('\nEmployee List:');
      employees.forEach((emp, index) => {
        const tax = emp.basicSalary * 0.12;
        const netSalary = emp.basicSalary - tax;
        console.log(`${index + 1}. ${emp.name} (${emp.department})`);
        console.log(`   Basic: $${emp.basicSalary.toLocaleString()} | Tax: $${tax.toLocaleString()} | Net: $${netSalary.toLocaleString()}`);
      });
    }
    console.log('='.repeat(50));
  } catch (error) {
    console.error('Warning: Could not read employee data:', error.message);
  }
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server gracefully...');
  process.exit(0);
});
