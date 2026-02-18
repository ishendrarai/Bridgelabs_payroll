const express = require('express');
const app = express();
const fileHandler = require('./modules/fileHandler');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ─── Dashboard ───────────────────────────────────────────────────────────────
app.get('/', async (req, res) => {
  const employees = await fileHandler.read();

  const totalBasic = employees.reduce((sum, e) => sum + Number(e.salary), 0);
  const totalTax   = totalBasic * 0.12;
  const totalNet   = totalBasic - totalTax;
  const avgSalary  = employees.length ? totalBasic / employees.length : 0;

  // Count unique departments
  const departments = new Set(employees.map(e => e.department)).size;

  res.render('index', {
    employees,
    totalBasic,
    totalTax,
    totalNet,
    avgSalary,
    totalEmployees: employees.length,
    departments
  });
});

// ─── Add Employee ─────────────────────────────────────────────────────────────
app.get('/add', (req, res) => res.render('add', { error: null }));

app.post('/add', async (req, res) => {
  const { name, gender, department, salary, startDate } = req.body;

  if (!name.trim() || Number(salary) < 0 || !department.trim()) {
    return res.render('add', { error: 'Please fill all fields correctly.' });
  }

  const employees = await fileHandler.read();
  employees.push({
    id: Date.now(),
    name: name.trim(),
    gender,
    department: department.trim(),
    salary: Number(salary),
    startDate
  });

  await fileHandler.write(employees);
  res.redirect('/');
});

// ─── Edit Employee ────────────────────────────────────────────────────────────
app.get('/edit/:id', async (req, res) => {
  const employees = await fileHandler.read();
  const employee  = employees.find(e => e.id === Number(req.params.id));
  if (!employee) return res.redirect('/');
  res.render('edit', { employee, error: null });
});

app.post('/edit/:id', async (req, res) => {
  const { name, gender, department, salary, startDate } = req.body;

  if (!name.trim() || Number(salary) < 0 || !department.trim()) {
    const employees = await fileHandler.read();
    const employee  = employees.find(e => e.id === Number(req.params.id));
    return res.render('edit', { employee, error: 'Please fill all fields correctly.' });
  }

  const employees = await fileHandler.read();
  const idx = employees.findIndex(e => e.id === Number(req.params.id));
  if (idx !== -1) {
    employees[idx] = {
      ...employees[idx],
      name: name.trim(),
      gender,
      department: department.trim(),
      salary: Number(salary),
      startDate
    };
    await fileHandler.write(employees);
  }
  res.redirect('/');
});

// ─── Delete Employee ──────────────────────────────────────────────────────────
app.get('/delete/:id', async (req, res) => {
  const employees = await fileHandler.read();
  const filtered  = employees.filter(e => e.id !== Number(req.params.id));
  await fileHandler.write(filtered);
  res.redirect('/');
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅  Employee Payroll System running at http://localhost:${PORT}`);
  fileHandler.read().then(data => {
    console.log(`📋  Loaded ${data.length} employee(s) from employees.json`);
  });
});
