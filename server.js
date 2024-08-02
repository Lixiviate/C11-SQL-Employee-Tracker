const express = require("express");
const inquirer = require("inquirer");
const { Pool } = require("pg");
const { database } = require("pg/lib/defaults");

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for the parsing of JSON data
app.use(express.json());
// Middleware for parsing of URL encoded data
// Does this need to be false?
app.use(express.urlencoded({ extended: false }));

// Access org_db
const pool = new Pool(
  {
    user: "postgres",
    password: "SQLpss",
    host: "127.0.0.1",
    database: "org_db",
  },
  console.warn("Access to org_db established.")
);

console.table(`
  ************************
  *-- EMPLOYEE TRACKER --*
  ************************`);

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
          pool.end();
          process.exit(0);
          break;
      }
    });
};

pool.connect();

const viewEmployees = () => {
  pool.query("SELECT * FROM employee", function (err, res) {
    console.table(res.rows);
    mainMenu();
  });
};

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

const viewRoles = () => {
  pool.query("SELECT * FROM role", function (err, res) {
    console.table(res.rows);
    mainMenu();
  });
};

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

const viewDepartments = () => {
  pool.query("SELECT * FROM department", function (err, res) {
    console.table(res.rows);
    mainMenu();
  });
};

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

// Start the app
mainMenu();

app.use((req, res) => {
  res.status(404).end();
});
