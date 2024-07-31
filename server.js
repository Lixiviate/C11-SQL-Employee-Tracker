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
  console.log("Access to org_db established.")
);

const mainMenu = () => {
  inquirer
    .prompt({
      type: "list",
      name: "selection",
      message: "Please select an option:",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.selection) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          pool.end();
          break;
      }
    });
};

pool.connect();

const viewDepartments = () => {
  pool.query("SELECT * FROM department", function (err, res) {
    console.table(res.rows);
    mainMenu();
  });
};

const viewRoles = () => {
  pool.query("SELECT * FROM role", function (err, res) {
    console.table(res.rows);
    mainMenu();
  });
};

const viewEmployees = () => {
  pool.query("SELECT * FROM employee", function (err, res) {
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
            console.log(err);
          } else {
            console.log(`Added ${answer.name} to the database`);
          }
          mainMenu();
        }
      );
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
            console.log(err);
          } else {
            console.log(`Added ${answer.title} to the database`);
          }
          mainMenu();
        }
      );
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
            console.log(err);
          } else {
            console.log(
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
            console.log(err);
          } else {
            console.log(`Added ${answer.title} to the database`);
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

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
