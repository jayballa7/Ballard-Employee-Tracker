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
  });


// function which prompts the user for what action they should take
function start() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Add Role", "Add Department", "Delete Employee"]
      })
      .then(function(answer) {
        // call different functions based on their answer
        if (answer.action === "View All Employees") {
            viewAllEmployees();
        }
        else if(answer.action === "Add Employee") {
            getAllRoles();
        }
        else if(answer.action === "Add Role") {
            getDepartments();
        }
        else if(answer.action === "Add Department") {
            addDepartment();
        }
        else if(answer.action === "Delete Employee") {
            getEmployeeList();
        }
        else{
          connection.end();
        }
      });
}

//function to view all tables joined as list of employees with id, title, department, salary, and manager
function viewAllEmployees() {
    connection.query(
        "SELECT employees.id AS Id, CONCAT(employees.first_name,' ', employees.last_name) AS Full_Name, roles.title AS Title, departments.name AS Department, roles.salary AS Salary FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id",
        (err, res) => {
            if(err) {
                throw err;
            }
            console.table(res);
            start();
        }
    )   
}

function getAllRoles() {
    var query = "SELECT id, title FROM roles";
    connection.query(query, (err, res) => {
            if(err) {
                throw err;
            }
            const allRoles = res.map(({ id, title }) => ({
                name: title,
                value: id
            }));
        addEmployee(allRoles);
    }); 

}

// function getManagers() {
//     var query = "SELECT id, manager FROM managers";
//     connection.query(query, (err, res) => {
//         if(err) {
//             throw err;
//         }
//         const managers = res.map(({ id, manager }) => ({
//                 name: manager,
//                 value: id
//         }));
//     console.log(managers);
//     })
// }

// let managerNames = {};
        
// function getManagers() {
//     var query = "SELECT id, manager FROM managers";
//     connection.query(query, (err, res) => {
//         if(err) {
//             throw err;
//         }
//         const managers = res.map(({ id, manager }) => ({
//                 name: manager,
//                 value: id
//         }));
//     managerNames.push(managers);
//     })
// }

//function to add Employees to db
function addEmployee(roles) {
    // prompt the user to answer questions about the employee's name, role, and manager
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
            choices: roles
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
          "INSERT INTO employees SET ?",
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.role,
            manager_id: answer.manager
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

//function to map departments
function getDepartments() {
    var query = "SELECT id, name FROM departments";
    connection.query(query, (err, res) => {
            if(err) {
                throw err;
            }
            const allDepartments = res.map(({ id, name }) => ({
                name: name,
                value: id
            }));
        addRole(allDepartments);
    });
}

//function to add Roles to db
function addRole(dep) {
    // prompt the user to answer questions about the employee's name, role, and manager
    inquirer
      .prompt([
        {
            name: "role",
            type: "input",
            message: "What role would you like to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for the role?"
        },
        {
            name: "department",
            type: "list",
            message: "Which department would you like to add the role to?",
            choices: dep
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new employee into the db
        connection.query(
          "INSERT INTO roles SET ?",
          {
            title: answer.role,
            salary: answer.salary,
            department_id: answer.department
          },
          function(err) {
            if (err) throw err;
            console.log("The role was created successfully!");
            // re-prompt the user if they want to take another action
            start();
          }
        );
      });
  }

//function to add department to db
function addDepartment() {
    inquirer
      .prompt([
        {
            name: "department",
            type: "input",
            message: "What department would you like to add?",
        }
      ])
      .then(function(ans) {
        // when finished prompting, insert the new department into the table
        connection.query(
          "INSERT INTO departments SET ?",
          {
            name: ans.department
          },
          function(err) {
            if (err) throw err;
            console.log("The department was added successfully!");
            // re-prompt the user if they want to take another action
            start();
          }
        );
      });
  }

//query to get list of all employees
function getEmployeeList() {
    var query = "SELECT id, first_name, last_name FROM employees";
    connection.query(query, (err, res) => {
            if(err) {
                throw err;
            }
            const allNames = res.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id
            }));
        deleteEmployee(allNames);
    });
}

//function to delete employees from db
function deleteEmployee(nameList) {
    // prompt the user to choose who they want to delete
    inquirer
      .prompt([
        {
            name: "remove",
            type: "list",
            message: "Who do you want to remove?",
            choices: nameList
        },
      ])
      .then(function(answer) {
        // when finished prompting, delete the employee from the db
        connection.query(
            "DELETE FROM employees WHERE ?",
            {
               id: answer.remove,
            },
          function(err) {
            if (err) throw err;
            console.log("The employee was deleted successfully.");
            // re-prompt the user if they want to take another action
            start();
          }
        );
      });
  }

start();