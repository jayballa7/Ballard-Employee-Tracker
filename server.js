var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Lionroar*7",
    database: "employees_DB"
  });
  
  connection.connect(function(err) {
      if(err) {
          throw err;
      }
      console.log('connected as id ' + connection.threadId);
      connection.end();
  });

// function which prompts the user for what action they should take
function start() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Delete Employee"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.action === "View All Employees") {
            viewAll();
        }
        else if(answer.action === "Add Employee") {
            addEmployee();
        } 
        else if(answer.action === "Delete Employee") {
            deleteEmployee();
        }
        else{
          connection.end();
        }
      });
  }
  
// function to handle posting new items up for auction
function addEmployee() {
    // prompt for info about the item being put up for auction
    inquirer
      .prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "role",
            type: "list",
            message: "What is the employee's role?",
            choices: []
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: []
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new employee into the db
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
          },
          function(err) {
            if (err) throw err;
            console.log("The employee was added successfully!");
            // re-prompt the user if they want to take another action
            start();
          }
        );
      });
  }
  
  