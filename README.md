# 🧾 Employee Payroll System (EPS)

A server-side web application to manage employee records and calculate monthly payroll — built with **Node.js**, **Express**, and **EJS**.

---

## 📸 Preview

> Dashboard showing employee details, payroll stats, and CRUD actions.

| Feature | Description |
|---|---|
| Dashboard | Live stats + employee table |
| Add Employee | Registration form with validation |
| Edit Employee | Pre-filled update form |
| Delete Employee | One-click removal with confirmation |
| Payroll Calc | Auto tax (12%) and net salary per row |

---

## 🗂️ Project Structure

```
payroll-app/
├── modules/
│   └── fileHandler.js     # Custom module for fs.promises read/write
├── public/
│   └── style.css          # Teal-themed UI styles
├── views/
│   ├── index.ejs          # Dashboard (stats + employee table)
│   ├── add.ejs            # Add new employee form
│   └── edit.ejs           # Edit existing employee form
├── employees.json         # JSON file database
├── server.js              # Main Express entry point
├── package.json
└── README.md
```

---

## ⚙️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Templating:** EJS (Embedded JavaScript)
- **Database:** JSON file (`employees.json`)
- **Styling:** Plain CSS (served as static files)

---

## 🚀 Getting Started

### 1. Clone / Extract the project

```bash
unzip payroll-app.zip
cd payroll-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
node server.js
```

### 4. Open in browser

```
http://localhost:3000
```

---

## 🔌 Routes

| Method | Route | Description |
|---|---|---|
| GET | `/` | Dashboard — list all employees |
| GET | `/add` | Show Add Employee form |
| POST | `/add` | Submit new employee |
| GET | `/edit/:id` | Show Edit Employee form |
| POST | `/edit/:id` | Submit updated employee |
| GET | `/delete/:id` | Delete employee by ID |

---

## 💰 Payroll Calculation Logic

All calculations happen dynamically in `index.ejs`:

```
Tax       = Basic Salary × 0.12   (12%)
Net Salary = Basic Salary − Tax
```

Dashboard summary cards aggregate across all employees:

```
Total Basic  = Σ all salaries
Total Tax    = Total Basic × 0.12
Total Net    = Total Basic − Total Tax
Avg Salary   = Total Basic ÷ Total Employees
```

---

## 🗃️ Data Model

Each employee stored in `employees.json` follows this shape:

```json
{
  "id": 1713830400000,
  "name": "Ravi Sharma",
  "gender": "Male",
  "department": "Engineering",
  "salary": 55000,
  "startDate": "2022-03-15"
}
```

> **IDs** are generated using `Date.now()` to ensure uniqueness.

---

## ✅ Validation Rules

- Name cannot be empty or whitespace
- Salary must be a non-negative number
- Department cannot be empty
- On failure, the form re-renders with an inline error message

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18.2 | Web server & routing |
| `ejs` | ^3.1.9 | Server-side HTML templating |

Install with:

```bash
npm install
```

---

## 🧩 Custom Module — `fileHandler.js`

Located at `modules/fileHandler.js`, this module wraps all file I/O using `fs.promises`:

```js
const { read, write } = require('./modules/fileHandler');

// Read all employees
const employees = await read();

// Save updated list
await write(employees);
```

Both functions use `try/catch` to prevent server crashes on file errors.

---

## 🎨 UI Highlights

- Teal navbar with branding
- 6 summary stat cards at the top
- Dark-header responsive table
- Gender-based colour-coded avatars
- Department badge chips
- Edit ✏️ and Delete 🗑️ action buttons per row
- Clean form pages with error alerts

---

## 👨‍💻 Author

Built as a project submission for **GLA University, Mathura**
Subject: Server-Side Web Development | Node.js & Express

---

## 📄 License

This project is for educational purposes only.
