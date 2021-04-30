const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employees",
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("SQL connected");
    start();
});

function start() {
    inquirer
        .prompt([{
            type: "list",
            name: "start",
            message: "we have information on employees,departments,and employee roles. what would like to do?",
            choices: ["view", "Add", "update", "Exit"],
        }, ])
        .then(function(res) {
            switch (res.start) {
                case "view":
                    view();
                    break;
                case "Add":
                    add();
                    break;
                case "update":
                    updateEmployee();
                    break;
                case "Exit":
                    console.log("-----------------");
                    console.log("All done");
                    console.log("------------");
                    break;
                default:
                    console.log("default");
            }
        });
}

function view() {
    inquirer
        .prompt([{
            type: "list",
            name: "view",
            message: "select one to view",
            choices: ["All employees", "By department", "By role"],
        }, ])
        .then(function(res) {
            switch (res.view) {
                case "All employees":
                    viewAllEmployees();
                    break;
                case "By department":
                    viewByDepartment();
                    break;
                case "By role":
                    viewByRole();
                    break;
                case "Exit":
                    console.log("-----------------");
                    console.log("All done");
                    console.log("------------");
                    break;
                default:
                    console.log("default");
            }
        });
}

function viewAllEmployees() {
    // connection.query(
    //     "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, employee.role_id AS Role, role.salary, manager.last_name AS Manager, department.name AS Department FROM employee  LEFT JOIN employee manager.ON employee.manager_id manager.id LEFT JOIN role  ON employee.role_id = role.title LEFT JOIN department  ON role.department_id =  department.id",
    //     function(err, results) {
    //         if (err) throw err;
    //         console.table(results);
    //         start();
    //     }
    // );
    connection.query("SELECT * FROM employee", function(err, results) {
        console.table(results);
        start();
        if (err) throw err;
        // inquirer
        //     .prompt([{
        //         type: "rawlist",
        //         name: "choice",
        //         choices: function() {
        //             let choicesArr = [];
        //             for (i = 0; i < results.length; i++) {
        //                 choicesArr.push(
        //                     results[i].first_name + " " + results[i].last_name
        //                 );
        //             }

        //             return choicesArr;
        //         },
        //         massage: "select employee",
        //     }, ])
        //     .then(function(answer) {
        //         console.log(answer, "answer");
        //         connection.query(
        //             "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, employee.role_id AS Role, role.salary, manager.last_name AS Manager, department.name AS Department FROM employee  LEFT JOIN employee, manager.ON, employee.manager_id, manager.id LEFT JOIN role  ON employee.role_id = role.title LEFT JOIN department  ON role.department_id =  department.id WHERE employee.name =?", [answer.choice],
        //             function(err, results) {
        //                 if (err) throw err;
        //                 console.table(results);
        //                 start();
        //             }
        //         );
        //     });
    });
}

function viewByDepartment() {
    connection.query("SELECT *FROM department", function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                type: "rawlist",
                name: "choice",
                choices: function() {
                    let choicesArr = [];
                    for (i = 0; i < results.length; i++) {
                        const opj = {
                            name: results[i].name,
                            value: results[i].id,
                        };
                        choicesArr.push(opj);
                    }
                    return choicesArr;
                },
                massage: "select department",
            }, ])
            .then(function(answer) {
                console.log(answer);
                connection.query(
                    "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
                    answer.choice,
                    function(err, results) {
                        if (err) throw err;
                        console.table(results);
                        start();
                    }
                );
            });
    });
}

function viewByRole() {
    connection.query("SELECT id, title FROM role", function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                type: "rawlist",
                name: "choice",
                massage: "select role",
                choices: function() {
                    let choiceArr = [];
                    for (i = 0; i < results.length; i++) {
                        const opj = {
                            name: results[i].title,
                            value: results[i].id,
                        };
                        choiceArr.push(opj);
                    }
                    return choiceArr;
                },
            }, ])
            .then(function(answer) {
                console.log(answer);

                connection.query(
                    "select * from employee where employee.role_id = ?",
                    answer.choice,

                    function(err, results) {
                        if (err) throw err;
                        console.table(results);
                        start();
                    }
                );
            });
    });
}

function add() {
    inquirer
        .prompt([{
            type: "list",
            name: "add",
            message: "what would you like to add?",
            choices: ["Department", "Employee role", "Employee"],
        }, ])
        .then(function(res) {
            switch (res.add) {
                case "Department":
                    addDepartment();
                    break;
                case "Employee role":
                    addEmployeeRole();
                    break;
                case "Employee":
                    addEmployee();
                    break;

                default:
                    console.log("default");
            }
        });
}

function addDepartment() {
    inquirer
        .prompt([{
            type: "input",
            name: "department",
            message: "what would you like the department name to be?",
        }, ])
        .then(function(answer) {
            connection.query(
                "INSERT INTO department VALUES (DEFAULT, ?)", [answer.department],
                function(err) {
                    if (err) throw err;
                    console.log("-----------------");
                    console.log("Departments updated with" * answer.department);
                    console.log("------------");
                    start();
                }
            );
        });
}

function addEmployeeRole() {
    inquirer
        .prompt([{
                type: "input",
                name: "role",
                message: "Enter role title:",
            },
            {
                type: "number",
                name: "salary",
                message: "Enter salary",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
            },
            {
                type: "number",
                name: "department_id",
                message: "Enter department id",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
            },
        ])
        .then(function(answer) {
            connection.query(
                "INSERT INTO role set?", {
                    title: answer.role,
                    salary: answer.salary,
                    department_id: answer.department_id,
                },
                function(err) {
                    if (err) throw err;
                    console.log("-----------------");
                    console.log("Employee Roles updated with" * answer.role);
                    console.log("------------");
                    start();
                }
            );
        });
}

function addEmployee() {
    connection.query("SELECT title FROM role", function(err, resolts) {
        if (err) throw err;
        inquirer
            .prompt([{
                    type: "input",
                    name: "firstName",
                    message: "Enter employee first name",
                },
                {
                    type: "input",
                    name: "lasttName",
                    message: "Enter employee last name",
                },
                {
                    type: "rawlist",
                    name: "role",
                    choices: function() {
                        let choiceArr = [];
                        for (i = 0; i < results.length; i++) {
                            choicesArr.push(resolts[i].title);
                        }
                        return choicesArr;
                    },
                    massage: "select title",
                },
                {
                    type: "number",
                    name: "manager",

                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    },
                    message: "Enter manager ID",
                    default: "1",
                },
            ])
            .then(function(answer) {
                connection.query("INSERT INTO employee SET ?", {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.role,
                    manager_id: answer.manager,
                });
                console.log("-----------------");
                console.log("Employee added successfuly");
                console.log("------------");
                start();
            });
    });
}

function updateEmployee() {
    connection.query("SELECT * FROM employee", function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                type: "rawlist",
                name: "choice",
                choices: function() {
                    let choicesArr = [];
                    for (i = 0; i < results.length; i++) {
                        choicesArr.push(results[i].last_name);
                    }
                    return choicesArr;
                },
                massage: "select employee to update",
            }, ])
            .then(function(answer) {
                const saveName = answer.choices;
                connection.query("SELECT * FROM employee", function(err, results) {
                    if (err) throw err;
                    inquirer
                        .prompt([{
                                type: "rawlist",
                                name: "role",
                                choices: function() {
                                    let choicesArr = [];
                                    for (i = 0; i < results.length; i++) {
                                        choicesArr.push(results[i].role_id);
                                    }
                                    return choicesArr;
                                },
                                massage: "select title",
                            },
                            {
                                type: "number",
                                name: "manager",

                                validate: function(value) {
                                    if (isNaN(value) === false) {
                                        return true;
                                    }
                                    return false;
                                },
                                message: "Enter manager ID",
                                default: "1",
                            },
                        ])
                        .then(function(answer) {
                            console.log(answer);
                            console.log(saveName);
                            connection.query("UPDATE employee SET ? WHERE last_name = ?", [{
                                        role_id: answer.role,
                                        manager_id: answer.manager,
                                    },
                                    saveName,
                                ]),
                                console.log("-----------------");
                            console.log("Employee update");
                            console.log("------------");
                            start();
                        });
                });
            });
    });
}

function quit() {
    console.log("Goodbye!");
    process.exit();
}