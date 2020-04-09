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
        choices: ["View All Employees", "View Roles / Departments", "Add Employee", "Delete Employee", "Update Role", "Add Role", "Delete Role", "Add Department", "Delete Department", "Add Manager", "Delete Manager"]
      })
      .then(function(answer) {
        // call different functions based on their answer
        if (answer.action === "View All Employees") {
            viewAllEmployees();
        }
        else if(answer.action === "View Roles / Departments") {
            viewRoles();
        }
        else if(answer.action === "Add Employee") {
            addEmployee();
        }
        else if(answer.action === "Delete Employee") {
            deleteEmployee();
        }
        else if(answer.action === "Update Role") {
            updateRole();
        }
        else if(answer.action === "Add Role") {
            addRole();
        }
        else if(answer.action === "Delete Role") {
            deleteRole();
        }
        else if(answer.action === "Add Department") {
            addDepartment();
        }
        else if(answer.action === "Delete Department") {
            deleteDep();
        }
        else if(answer.action === "Add Manager") {
            addManager();
        }
        else if(answer.action === "Delete Manager") {
            deleteManager();
        }
        else{
          connection.end();
        }
      });
}

//function to view all tables joined as list of employees with id, title, department, salary, and manager
function viewAllEmployees() {
    connection.query(
        "SELECT employees.id AS Id, CONCAT(employees.first_name,' ', employees.last_name) AS Full_Name, roles.title AS Title, departments.name AS Department, roles.salary AS Salary, managers.manager AS Manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN managers ON employees.manager_id = managers.id",
        (err, res) => {
            if(err) {
                throw err;
            }
            console.table(res);
            start();
        }
    )   
}

//function to view all roles, salaries and departments
function viewRoles() {
  connection.query(
    "SELECT roles.title AS Title, departments.name AS Department FROM roles LEFT JOIN departments ON roles.department_id = departments.id",
      (err, res) => {
          if(err) {
              throw err;
          }
          console.table(res);
          start();
      }
  )   
}

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

//function to add roles to db
async function addRole() {
  const depquery = "SELECT id, name FROM departments";
  const departments = await connection.query(depquery);
  const department = departments.map(({ id, name }) => ({
              name: name,
              value: id
  }));   
    // prompt the user to answer questions about the role they want to add
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
            choices: department
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new role into the table
        connection.query(
          "INSERT INTO roles SET ?",
          {
            title: answer.role,
            salary: answer.salary,
            department_id: answer.department
          },
          function(err) {
            if (err) throw err;
            console.log("The role was added successfully!");
            // re-prompt the user if they want to take another action
            start();
          }
        );
      });
  }

//function to add departments into the db
async function addDepartment() {
    inquirer
      .prompt([
        {
            name: "department",
            type: "input",
            message: "What department would you like to add?"
        },
      ])
      .then(function(answer) {
        // when finished prompting, insert a new department into the table
        connection.query(
          "INSERT INTO departments SET ?",
          {
            name: answer.department
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

//function to add managers into the db
async function addManager() {
  inquirer
    .prompt([
      {
          name: "manager",
          type: "input",
          message: "Who is the manager you want to add?"
      },
    ])
    .then(function(answer) {
      // when finished prompting, insert a new manager into the table
      connection.query(
        "INSERT INTO managers SET ?",
        {
          manager: answer.manager
        },
        function(err) {
          if (err) throw err;
          console.log("The manager was added successfully!");
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
          message: "What is their new role?",
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

//function to delete employees from the db
async function deleteEmployee() {
  const employeequery = "SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees";
  const employees = await connection.query(employeequery);
  const employee = employees.map(({ id, full_name }) => ({
    name: full_name,
    value: id
  })); 
    inquirer
      .prompt([
        {
            name: "employee",
            type: "list",
            message: "Which employee do you want to remove?",
            choices: employee
        }      
      ])
      .then(function(answer) {
        // delete the employee from the table
        connection.query(
          "DELETE FROM employees WHERE ?",
          {
            id: answer.employee
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



//function to delete roles from the db
async function deleteRole() {
  const rolequery = "SELECT id, title FROM roles";
  const roles = await connection.query(rolequery);
  const role = roles.map(({ id, title }) => ({
              name: title,
              value: id
          }));  
    inquirer
      .prompt([
        {
            name: "role",
            type: "list",
            message: "Which role do you want to delete?",
            choices: role
        }      
      ])
      .then(function(answer) {
        // delete the role from the table
        connection.query(
          "DELETE FROM roles WHERE ?",
          {
            id: answer.role
          },
          function(err) {
            if (err) throw err;
            console.log("The role was deleted successfully.");
            // re-prompt the user if they want to take another action
            start();
          }
        );
      });
  }

//function to delete departments from the db
async function deleteDep() {
  const depquery = "SELECT id, name FROM departments";
  const departments = await connection.query(depquery);
  const department = departments.map(({ id, name }) => ({
              name: name,
              value: id
          }));  
    inquirer
      .prompt([
        {
            name: "department",
            type: "list",
            message: "Which department do you want to delete?",
            choices: department
        }      
      ])
      .then(function(answer) {
        // delete the department from the table
        connection.query(
          "DELETE FROM departments WHERE ?",
          {
            id: answer.department
          },
          function(err) {
            if (err) throw err;
            console.log("The department was deleted successfully.");
            // re-prompt the user if they want to take another action
            start();
          }
        );
      });
  }

//function to delete managers from the db
async function deleteManager() {
  const manquery = "SELECT id, manager FROM managers";
  const managers = await connection.query(manquery);
  const manager = managers.map(({ id, manager }) => ({
              name: manager,
              value: id
          }));  
    inquirer
      .prompt([
        {
            name: "manager",
            type: "list",
            message: "Which manager do you want to remove?",
            choices: manager
        }      
      ])
      .then(function(answer) {
        // delete the manager from the table
        connection.query(
          "DELETE FROM managers WHERE ?",
          {
            id: answer.manager
          },
          function(err) {
            if (err) throw err;
            console.log("The manager was deleted successfully.");
            // re-prompt the user if they want to take another action
            start();
          }
        );
      });
  }

//calling function that asks the user what action they would like to take
start();