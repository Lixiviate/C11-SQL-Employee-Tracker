// Import necessary modules
const express = require("express");
const inquirer = require("inquirer");
const app = express();
const { Pool } = require("pg");
// Load environment variables
require("dotenv").config();

// Middleware for the parsing of JSON data
app.use(express.json());
// Middleware for parsing of URL encoded data
// Does this need to be false?
app.use(express.urlencoded({ extended: false }));

// Connect to PostgreSQL database
const pool = new Pool(
  {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
  },
  console.warn("Access to org_db established.")
);

// Display application banner
console.table(`
  ************************
  *-- EMPLOYEE TRACKER --*
  ************************
  
----------------------------
`);

// Main menu function using inquirer
const mainMenu = () => {
  inquirer
    .prompt({
      type: "list",
      name: "selection",
      message: "Please select an option:",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Exit",
      ],
    })
    .then((answer) => {
      // Handle menu selection
      switch (answer.selection) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Exit":
          console.warn("Exiting the app....");
          pool.end(); // Close DB connection
          process.exit(0); // Exit application
          break;
      }
    });
};

pool.connect(); // Establish DB connection

// View all employees with their details
const viewEmployees = () => {
  pool.query(
    `
    SELECT 
      employee.id AS employee_id,
      employee.first_name,
      employee.last_name,
      role.title AS job_title,
      department.name AS department,
      role.salary,
      manager.first_name AS manager_first_name,
      manager.last_name AS manager_last_name
    FROM
      employee
    LEFT JOIN
      role ON employee.role_id = role.id
    LEFT JOIN
      department ON role.department_id = department.id
    LEFT JOIN
      employee AS manager ON employee.manager_id = manager.id
    `,
    function (err, res) {
      console.table(res.rows);
      mainMenu();
    }
  );
};

// Add a new employee
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter the First Name of the new employee:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter the Last Name of the new employee:",
      },
      {
        type: "input",
        name: "role_id",
        message: "Enter the Role ID of the new employee:",
      },
      {
        type: "input",
        name: "manager_id",
        message: "Enter the Manager ID of the new employee:",
      },
    ])
    .then((answer) => {
      // Insert new employee into DB
      pool.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
        [
          answer.first_name,
          answer.last_name,
          answer.role_id,
          answer.manager_id,
        ],
        (err, res) => {
          if (err) {
            console.error("Entry Failure:", err.message);
          } else {
            console.warn(
              `Added ${answer.first_name} ${answer.last_name} to the database`
            );
          }
          mainMenu();
        }
      );
    });
};

// Update an employee's role
const updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employee_id",
        message: "Enter the Employee ID for the role you want to update:",
      },
      {
        type: "input",
        name: "role_id",
        message: "Enter the new Role ID of the employee:",
      },
    ])
    .then((answer) => {
      // Update role in DB
      pool.query(
        "UPDATE employee SET role_id = $1 WHERE id = $2",
        [answer.role_id, answer.employee_id],
        (err, res) => {
          if (err) {
            console.error("Entry Failure:", err.message);
          } else {
            console.warn(`Updated employee role in database.`);
          }
          mainMenu();
        }
      );
    });
};

// View all roles with department info
const viewRoles = () => {
  pool.query(
    `
    SELECT
      role.id AS role_id,
      role.title AS role_title,
      role.salary AS role_salary,
      department.id AS department_id,
      department.name AS department_name
    FROM
      role
    LEFT JOIN
      department ON role.department_id = department.id
    `,
    function (err, res) {
      console.table(res.rows);
      mainMenu();
    }
  );
};

// Add a new role
const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the title of the new role:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary of the new role:",
      },
      {
        type: "input",
        name: "department_id",
        message: "Enter the Department ID of the new role:",
      },
    ])
    .then((answer) => {
      // Insert new role into DB
      pool.query(
        "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
        [answer.title, answer.salary, answer.department_id],
        (err, res) => {
          if (err) {
            console.error("Entry Failure:", err.message);
          } else {
            console.warn(`Added ${answer.title} to the database`);
          }
          mainMenu();
        }
      );
    });
};

// View all departments
const viewDepartments = () => {
  pool.query("SELECT * FROM department", function (err, res) {
    console.table(res.rows);
    mainMenu();
  });
};

// Add a new department
const addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "Enter the name of the new department:",
    })
    .then((answer) => {
      pool.query(
        "INSERT INTO department (name) VALUES ($1)",
        [answer.name],
        (err, res) => {
          if (err) {
            console.error("Entry Failure:", err.message);
          } else {
            console.warn(`Added the ${answer.name} department to the database`);
          }
          mainMenu();
        }
      );
    });
};

// Start the app by calling main menu
mainMenu();

// Handle 404 errors
app.use((req, res) => {
  res.status(404).end();
});
