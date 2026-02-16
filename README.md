# Employee Payroll System (EPS)

A server-side web application to manage employee records and calculate monthly payroll using Node.js, Express, and EJS.

## 🎯 Features

- **Dashboard**: View all employees with real-time payroll calculations
- **Payroll Calculation**: Automatic calculation of:
  - Tax (12% of basic salary)
  - Net Salary (Basic Salary - Tax)
- **CRUD Operations**:
  - ➕ Add new employees
  - ✏️ Edit existing employees
  - 🗑️ Delete employees
- **Data Persistence**: All data stored in `employees.json`
- **Professional UI**: Modern, responsive design with smooth animations
- **Form Validation**: Client-side and server-side validation
- **Real-time Preview**: Salary breakdown preview while entering data

## 📁 Project Structure

```
payroll-app/
├── modules/
│   └── fileHandler.js      # Custom module for file operations
├── public/
│   └── style.css           # Professional styling
├── views/
│   ├── index.ejs          # Dashboard (Employee Table)
│   ├── add.ejs            # Add Employee Form
│   └── edit.ejs           # Edit Employee Form
├── employees.json         # JSON database
├── server.js              # Main entry point
├── package.json           # Dependencies
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Extract the project files** to a directory of your choice

2. **Navigate to the project directory**:
   ```bash
   cd payroll-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Application

**Start the server**:
```bash
npm start
```

**For development (with auto-restart)**:
```bash
npm run dev
```

The application will be available at:
- **Dashboard**: http://localhost:3000
- **Add Employee**: http://localhost:3000/add

## 📝 Usage Guide

### 1. View Dashboard
- Access the main dashboard at http://localhost:3000
- View all employees with their salary calculations
- See summary statistics at the bottom

### 2. Add New Employee
- Click "➕ Add New Employee" button
- Fill in the form:
  - **Name**: Employee's full name (required)
  - **Department**: Select from dropdown (required)
  - **Basic Salary**: Monthly salary in USD (required, must be > 0)
- Real-time salary preview shows tax and net salary
- Click "Add Employee" to save

### 3. Edit Employee
- Click "✏️ Edit" button next to any employee
- Modify the employee details
- View current salary breakdown
- Real-time preview of new salary calculations
- Click "Update Employee" to save changes

### 4. Delete Employee
- Click "🗑️ Delete" button next to any employee
- Confirm the deletion in the popup dialog
- Employee will be removed from the system

## 💰 Salary Calculations

The system automatically calculates:

```
Tax = Basic Salary × 0.12 (12%)
Net Salary = Basic Salary - Tax
```

**Example**:
- Basic Salary: $75,000
- Tax (12%): $9,000
- Net Salary: $66,000

## 🎨 Design Features

- **Modern UI**: Gradient backgrounds with smooth animations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional Typography**: Clean, readable fonts
- **Color-Coded Departments**: Visual badges for each department
- **Interactive Elements**: Hover effects and smooth transitions
- **Form Validation**: Real-time feedback and error prevention

## 🔧 Technical Details

### Data Validation

**Server-side**:
- Name: Cannot be empty
- Salary: Must be a positive number
- Department: Must be selected
- All fields are required

**Client-side**:
- Real-time form validation
- Confirmation dialogs for deletions
- Input format checking

### File Operations

The `fileHandler.js` module provides:
- `read()`: Read all employees
- `write(data)`: Write employee data
- `findById(id)`: Find specific employee
- `addEmployee(employee)`: Add new employee
- `updateEmployee(id, data)`: Update employee
- `deleteEmployee(id)`: Delete employee

All operations use async/await with proper error handling.

### Unique IDs

Each employee is assigned a unique ID using `Date.now()`, ensuring no conflicts.

## 🛠️ Development

### Project Requirements Met

✅ Dashboard with employee table  
✅ Dynamic payroll calculations (Tax: 12%, Net Salary)  
✅ Registration form for new employees  
✅ Data persistence in employees.json  
✅ Custom module architecture (fileHandler.js)  
✅ Unique IDs for employees  
✅ Data validation (client & server)  
✅ Redirects after CRUD operations  
✅ Static files served from public folder  
✅ Edit and Delete functionality  

### Technologies Used

- **Backend**: Node.js, Express.js
- **Templating**: EJS (Embedded JavaScript)
- **Storage**: JSON file-based database
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Architecture**: MVC pattern with custom modules

## 📊 Sample Data

The system comes with 3 sample employees:
1. Sarah Johnson (Engineering) - $75,000
2. Michael Chen (Marketing) - $62,000
3. Emily Rodriguez (Human Resources) - $58,000

You can add, edit, or delete these as needed.

## 🐛 Troubleshooting

**Port already in use**:
```bash
# Use a different port
PORT=3001 npm start
```

**employees.json not found**:
- The system will automatically create the file on first run
- Or create it manually with: `[]`

**Server won't start**:
- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be v14+)

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ using Node.js, Express, and EJS

---

**Happy Coding! 🚀**
