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
// function start() {
//     inquirer
//       .prompt({
//         name: "action",
//         type: "list",
//         message: "What would you like to do?",
//         choices: ["View All Employees", "Add Employee", "Delete Employee"]
//       })
//       .then(function(answer) {
//         // based on their answer, either call the bid or the post functions
//         if (answer.action === "View All Employees") {
//             viewAll();
//         }
//         else if(answer.action === "Add Employee") {
//             addEmployee();
//         } 
//         else if(answer.action === "Delete Employee") {
//             deleteEmployee();
//         }
//         else{
//           connection.end();
//         }
//       });
//   }
  
// //function to add Employees to db
// function addEmployee() {
//     // prompt the user to answer questions about the employee's name, role, and manager
//     inquirer
//       .prompt([
//         {
//             name: "firstName",
//             type: "input",
//             message: "What is the employee's first name?"
//         },
//         {
//             name: "lastName",
//             type: "input",
//             message: "What is the employee's last name?"
//         },
//         {
//             name: "role",
//             type: "list",
//             message: "What is the employee's role?",
//             choices: ["Salesperson", "Sales Lead", "Software Engineer", "Lead Engineer", "Accountant", "Account Manager", "Lawyer", "Legal Team Lead"]
//         },
//         {
//             name: "manager",
//             type: "list",
//             message: "Who is the employee's manager?",
//             choices: ["Chris Kelsey", "Brian D"]
//         }
//       ])
//       .then(function(answer) {
//           console.log(answer);
//         // when finished prompting, insert a new employee into the db
//         connection.query(
//           "INSERT INTO employees SET ?",
//           {
//             first_name: answer.firstName,
//             last_name: answer.lastName,
//             role_id: 4, 
//             manager_id: 5
//           },
//           function(err) {
//             if (err) throw err;
//             console.log("The employee was added successfully!");
//             // re-prompt the user if they want to take another action
//             start();
//           }
//         );
//       });
//   }

// // function to add Employees to db
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



async function getAllRoles() {
    connection.query(
        "SELECT id, title FROM roles", (err, res) => {
            return res;
        }
    );
}


async function rolePrompt() {
    var roles = await getAllRoles();
    console.table(roles);
    // var rolesMap = roles.map(({id,title})=>({
    //     name: title,
    //     id: id
    // }));
}

console.log(rolePrompt());

// start();