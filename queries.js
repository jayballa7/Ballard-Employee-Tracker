// var inquirer = require('inquirer');

// class queries {
//     constructor(connection) {
//         this.connection = connection;
//     }




// // function which prompts the user for what action they should take
// // function start() {
// //     inquirer
// //       .prompt({
// //         name: "action",
// //         type: "list",
// //         message: "What would you like to do?",
// //         choices: ["View All Employees", "Add Employee", "Delete Employee"]
// //       })
// //       .then(function(answer) {
// //         // based on their answer, either call the bid or the post functions
// //         if (answer.action === "View All Employees") {
// //             viewAll();
// //         }
// //         else if(answer.action === "Add Employee") {
// //             addEmployee();
// //         } 
// //         else if(answer.action === "Delete Employee") {
// //             deleteEmployee();
// //         }
// //         else{
// //           connection.end();
// //         }
// //       });
// //   }
  
// // function to add Employees to db
// // function addEmployee() {
// //     // prompt the user to answer questions about the employee's name, role, and manager
// //     inquirer
// //       .prompt([
// //         // {
// //         //     name: "firstName",
// //         //     type: "input",
// //         //     message: "What is the employee's first name?"
// //         // },
// //         // {
// //         //     name: "lastName",
// //         //     type: "input",
// //         //     message: "What is the employee's last name?"
// //         // },
// //         {
// //             name: "role",
// //             type: "list",
// //             message: "What is the employee's role?",
// //             choices: ["Salesperson", "Sales Lead", "Software Engineer", "Lead Engineer", "Accountant", "Account Manager", "Lawyer", "Legal Team Lead"]
// //         },
// //         // {
// //         //     name: "manager",
// //         //     type: "list",
// //         //     message: "Who is the employee's manager?",
// //         //     choices: ["Chris Kelsey", "Brian D"]
// //         // }
// //       ])
// //       .then(function(answer) {
// //           console.log(answer);
// //         // when finished prompting, insert a new employee into the db
// //         // connection.query(
// //         //   "INSERT INTO employees SET ?",
// //         //   {
// //         //     first_name: answer.firstName,
// //         //     last_name: answer.lastName,
// //         //     role_id: 4, 
// //         //     manager_id: 5
// //         //   },
// //         //   function(err) {
// //         //     if (err) throw err;
// //         //     console.log("The employee was added successfully!");
// //         //     // re-prompt the user if they want to take another action
// //         //     start();
// //         //   }
// //         // );
// //       });
// //   }

// // function to add Employees to db
// // function deleteEmployee() {
// //     // prompt the user to input who they want to delete
// //     inquirer
// //       .prompt([
// //         {
// //             name: "remove",
// //             type: "list",
// //             message: "Who do you want to remove?",
// //             choices: []
// //         },
// //       ])
// //       .then(function(answer) {
// //         // when finished prompting, delete the employee from the db
// //         connection.query(
// //             "DELETE FROM employees WHERE ?",
// //             {
              
// //             },
// //           function(err) {
// //             if (err) throw err;
// //             console.log("The employee was deleted successfully.");
// //             // re-prompt the user if they want to take another action
// //             start();
// //           }
// //         );
// //       });
// //   }

// function getAllRoles() {
//     const rolesMap = {};
//     const query = connection.query(
//         "SELECT id, title FROM roles",
//         function(err, res) {
//             rolesMap = res.map(({id,title})=>({
//                 name: title,
//                 id: id
//             }));
//         }
//     );
//     return rolesMap;
// }

// console.log(getAllRoles());


// start();
  




















// }

// module.exports = queries;
