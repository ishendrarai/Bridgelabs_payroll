const express = require('express');
const app = express();
const ExcelJS = require('exceljs');
const fileHandler = require('./modules/fileHandler');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ─── Dashboard ────────────────────────────────────────────────────────────────
app.get('/', async (req, res) => {
  const employees = await fileHandler.read();
  const totalBasic  = employees.reduce((sum, e) => sum + Number(e.salary), 0);
  const totalTax    = totalBasic * 0.12;
  const totalNet    = totalBasic - totalTax;
  const avgSalary   = employees.length ? totalBasic / employees.length : 0;
  const departments = new Set(employees.map(e => e.department)).size;
  res.render('index', { employees, totalBasic, totalTax, totalNet, avgSalary, totalEmployees: employees.length, departments });
});

// ─── Export to Excel ──────────────────────────────────────────────────────────
app.get('/export', async (req, res) => {
  const employees = await fileHandler.read();

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Employee Payroll System';
  wb.created = new Date();

  // ── Sheet 1: Employee Payroll ─────────────────────────────────────────────
  const ws = wb.addWorksheet('Employee Payroll', {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true }
  });

  ws.columns = [
    { key: 'sno',        width: 6  },
    { key: 'name',       width: 24 },
    { key: 'gender',     width: 10 },
    { key: 'department', width: 18 },
    { key: 'salary',     width: 20 },
    { key: 'tax',        width: 20 },
    { key: 'net',        width: 20 },
    { key: 'startDate',  width: 16 },
  ];

  const MONEY_FMT    = '₹#,##0.00';
  const INDIGO_DARK  = 'FF312E81';
  const INDIGO_MED   = 'FF3730A3';
  const INDIGO_LIGHT = 'FFEEF2FF';
  const WHITE        = 'FFFFFFFF';
  const RED          = 'FFC0392B';
  const GREEN        = 'FF0F9D58';
  const ROW_ALT      = 'FFF5F3FF';

  const hCenter = { horizontal: 'center', vertical: 'middle' };
  const hRight  = { horizontal: 'right',  vertical: 'middle' };
  const hLeft   = { horizontal: 'left',   vertical: 'middle' };

  // Title row
  ws.mergeCells('A1:H1');
  const titleCell = ws.getCell('A1');
  titleCell.value = 'Employee Payroll Report';
  titleCell.font      = { name: 'Arial', size: 16, bold: true, color: { argb: WHITE } };
  titleCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: INDIGO_MED } };
  titleCell.alignment = hCenter;
  ws.getRow(1).height = 42;

  // Subtitle row
  ws.mergeCells('A2:H2');
  const subCell = ws.getCell('A2');
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  subCell.value     = `Generated on ${today}   •   Total Employees: ${employees.length}`;
  subCell.font      = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF6366F1' } };
  subCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: INDIGO_LIGHT } };
  subCell.alignment = hCenter;
  ws.getRow(2).height = 22;

  ws.addRow([]); // spacer row 3

  // Header row
  const headers = ['#', 'Employee Name', 'Gender', 'Department', 'Basic Salary (₹)', 'Tax 12% (₹)', 'Net Salary (₹)', 'Start Date'];
  const headerRow = ws.addRow(headers);
  headerRow.height = 28;
  headerRow.eachCell(cell => {
    cell.font      = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: INDIGO_DARK } };
    cell.alignment = hCenter;
    cell.border    = { bottom: { style: 'medium', color: { argb: '6366F1' } } };
  });

  // Data rows — all VALUES, no formula strings
  let grandBasic = 0, grandTax = 0, grandNet = 0;

  employees.forEach((emp, i) => {
    const basic = Number(emp.salary);
    const tax   = Math.round(basic * 0.12 * 100) / 100;
    const net   = Math.round((basic - tax) * 100) / 100;
    grandBasic += basic;
    grandTax   += tax;
    grandNet   += net;

    const row = ws.addRow([
      i + 1,
      emp.name,
      emp.gender,
      emp.department,
      basic,
      tax,
      net,
      emp.startDate ? new Date(emp.startDate) : ''
    ]);
    row.height = 22;
    const fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: i % 2 === 0 ? WHITE : ROW_ALT } };
    const thinBorder = { style: 'thin', color: { argb: 'FFE0E0E0' } };

    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      cell.fill   = fill;
      cell.border = { bottom: thinBorder, right: thinBorder };
      cell.font   = { name: 'Arial', size: 10 };
      cell.alignment = colNum <= 2 ? hLeft : colNum === 8 ? hCenter : hRight;
    });

    row.getCell(5).numFmt = MONEY_FMT;
    row.getCell(6).numFmt = MONEY_FMT;
    row.getCell(7).numFmt = MONEY_FMT;
    row.getCell(8).numFmt = 'DD-MMM-YYYY';

    row.getCell(6).font = { name: 'Arial', size: 10, color: { argb: RED } };
    row.getCell(7).font = { name: 'Arial', size: 10, bold: true, color: { argb: GREEN } };
  });

  // Totals row — also real values
  const totalsRow = ws.addRow(['', 'TOTALS', '', '', grandBasic, grandTax, grandNet, '']);
  totalsRow.height = 28;
  totalsRow.eachCell({ includeEmpty: true }, (cell, colNum) => {
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: INDIGO_DARK } };
    cell.font      = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
    cell.alignment = colNum === 2 ? hLeft : hRight;
    cell.border    = { top: { style: 'medium', color: { argb: '6366F1' } } };
  });
  totalsRow.getCell(5).numFmt = MONEY_FMT;
  totalsRow.getCell(6).numFmt = MONEY_FMT;
  totalsRow.getCell(7).numFmt = MONEY_FMT;

  // ── Sheet 2: Summary ──────────────────────────────────────────────────────
  const ws2 = wb.addWorksheet('Summary');
  ws2.columns = [{ width: 28 }, { width: 22 }];

  ws2.mergeCells('A1:B1');
  const s1 = ws2.getCell('A1');
  s1.value     = 'Payroll Summary';
  s1.font      = { name: 'Arial', size: 14, bold: true, color: { argb: WHITE } };
  s1.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: INDIGO_MED } };
  s1.alignment = hCenter;
  ws2.getRow(1).height = 36;

  const depts   = new Set(employees.map(e => e.department)).size;
  const avgBasic = employees.length ? grandBasic / employees.length : 0;

  const summaryRows = [
    ['Total Employees',     employees.length, null],
    ['Active Departments',  depts,             null],
    ['Total Basic Salary',  grandBasic,        MONEY_FMT],
    ['Total Tax (12%)',     grandTax,          MONEY_FMT],
    ['Total Net Salary',    grandNet,          MONEY_FMT],
    ['Average Basic Salary',avgBasic,          MONEY_FMT],
  ];

  summaryRows.forEach(([label, val, fmt]) => {
    const r = ws2.addRow([label, val]);
    r.height = 26;
    r.getCell(1).fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: INDIGO_LIGHT } };
    r.getCell(1).font      = { name: 'Arial', size: 10, bold: true, color: { argb: INDIGO_DARK } };
    r.getCell(2).font      = { name: 'Arial', size: 10, color: { argb: 'FF111827' } };
    r.getCell(1).alignment = hLeft;
    r.getCell(2).alignment = hRight;
    if (fmt) r.getCell(2).numFmt = fmt;
    r.eachCell(c => {
      c.border = { bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } } };
    });
  });

  // ── Stream to browser ─────────────────────────────────────────────────────
  const filename = `payroll-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  await wb.xlsx.write(res);
  res.end();
});

// ─── Add Employee ─────────────────────────────────────────────────────────────
app.get('/add', (req, res) => res.render('add', { error: null }));
app.post('/add', async (req, res) => {
  const { name, gender, department, salary, startDate } = req.body;
  if (!name.trim() || Number(salary) < 0 || !department.trim())
    return res.render('add', { error: 'Please fill all fields correctly.' });
  const employees = await fileHandler.read();
  employees.push({ id: Date.now(), name: name.trim(), gender, department: department.trim(), salary: Number(salary), startDate });
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
  const employees = await fileHandler.read();
  const idx = employees.findIndex(e => e.id === Number(req.params.id));
  if (!name.trim() || Number(salary) < 0 || !department.trim())
    return res.render('edit', { employee: employees[idx], error: 'Please fill all fields correctly.' });
  if (idx !== -1) {
    employees[idx] = { ...employees[idx], name: name.trim(), gender, department: department.trim(), salary: Number(salary), startDate };
    await fileHandler.write(employees);
  }
  res.redirect('/');
});

// ─── Delete Employee ──────────────────────────────────────────────────────────
app.get('/delete/:id', async (req, res) => {
  const employees = await fileHandler.read();
  await fileHandler.write(employees.filter(e => e.id !== Number(req.params.id)));
  res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅  Payroll System → http://localhost:${PORT}`);
  fileHandler.read().then(d => console.log(`📋  ${d.length} employee(s) loaded`));
});
