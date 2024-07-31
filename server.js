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
          viewAllDept();
          break;
        case "View all roles":
          break;
        case "View all employees":
          break;
        case "Add a department":
          break;
        case "Add a role":
          break;
        case "Add an employee":
          break;
        case "Update an employee role":
          break;
        case "Exit":
          pool.end();
          break;
      }
    });
};

pool.connect();

const viewAllDept = () => {
  pool.query("SELECT * FROM department", function (err, res) {
    console.log(res.rows);
    mainMenu();
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
