var mysql = require('mysql');
var inquirer = require('inquirer');
var util = require("util");

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

connection.query = util.promisify(connection.query);

// function which prompts the user for what action they should take
function start() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Add Role", "Update Role", "Add Department", "Delete Employee"]
      })
      .then(function(answer) {
        // call different functions based on their answer
        if (answer.action === "View All Employees") {
            viewAllEmployees();
        }
        else if(answer.action === "Add Employee") {
            addEmployee();
        }
        else if(answer.action === "Add Role") {
            getDepartments();
        }
        else if(answer.action === "Update Role") {
          updateRole();
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


//function to add Employees to db
async function addEmployee() {
  const rolequery = "SELECT id, title FROM roles";
  const managerquery = "SELECT id, manager FROM managers";
  const roles = await connection.query(rolequery);
  const role = roles.map(({ id, title }) => ({
              name: title,
              value: id
          }));  
  const managers = await connection.query(managerquery);
  const manager = managers.map(({ id, manager }) => ({
    name: manager,
    value: id
})); 
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
            choices: role
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: manager
        }
          
      ])
      .then(function(answer) {
        // when finished prompting, insert a new employee into the db
        console.log(answer);
        connection.query(
          "INSERT INTO employees SET ?",
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.role,
            manager_id: 5
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

  async function updateRole() {
    const rolequery = "SELECT id, title FROM roles";
    const employeequery = "SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees";
    const roles = await connection.query(rolequery);
    const role = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));  
    const employees = await connection.query(employeequery);
    const employee = employees.map(({ id, full_name }) => ({
      name: full_name,
      value: id
    })); 
    // prompt the user to choose who they want to update
    inquirer
      .prompt([
        {
            name: "updateRole",
            type: "list",
            message: "Who do you want to update?",
            choices: employee
        },
        {
          name: "roleList",
          type: "list",
          message: "What is their role?",
          choices: role
      },
      ])
      .then(function(answer) {
        console.log(answer);
        // when finished prompting, update the employee's role in the db
        connection.query(
            "UPDATE employees SET role_id = ? WHERE id = ?",
            [
               answer.roleList, answer.updateRole
            ],
          function(err) {
            if (err) throw err;
            console.log("The role has been updated");
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