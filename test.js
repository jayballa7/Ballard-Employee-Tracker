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
    //   connection.end();
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
            viewAllEmployees();
        }
        else if(answer.action === "Add Employee") {
            getAllRoles();
        } 
        else if(answer.action === "Delete Employee") {
            deleteEmployee();
        }
        else{
          connection.end();
        }
      });
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
        }
    );
}

function viewAllEmployees() {
    connection.query(
        "SELECT employees.id AS Id, CONCAT(employees.first_name,' ', employees.last_name) AS Full_Name, roles.title AS Title, departments.name AS Department, roles.salary AS Salary FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id",
        (err, res) => {
            if(err) {
                throw err;
            }
            console.log('triggered');
            console.table(res);
        }
    )   
}

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
            choices: ["Chris Kelsey", "Brian D"]
        }
      ])
      .then(function(answer) {
          console.log(answer);
        // when finished prompting, insert a new employee into the db
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


// function deleteEmployee() {
//     // prompt the user to input who they want to delete
//     inquirer
//       .prompt([
//         {
//             name: "remove",
//             type: "list",
//             message: "Who do you want to remove?",
//             choices: []
//         },
//       ])
//       .then(function(answer) {
//         // when finished prompting, delete the employee from the db
//         connection.query(
//             "DELETE FROM employees WHERE ?",
//             {
              
//             },
//           function(err) {
//             if (err) throw err;
//             console.log("The employee was deleted successfully.");
//             // re-prompt the user if they want to take another action
//             start();
//           }
//         );
//       });
//   }





start();