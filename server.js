const inquirer = requier("inquirer");
const mysql = requier("mysql");
const cTable = requier("console.table");

const connection = mysql.ceateConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_db",
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
            choices: ["All employee", "By department", "By role"],
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
    connection.query(
        "SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m.ON e.manager_id m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.department_id =  d.id",
        function(err, results) {
            if (err) throw err;
            console.table(results);
            start();
        }
    );
}

function viewByDepartment() {
    connection.query("SELECT *FRON department", function(err, resolts) {
        if (err) throw err;
        inquirer
            .prompt([{
                type: "rawlist",
                name: "choice",
                choices: function() {
                    let choiceArr = [];
                    for (i = 0; i < results.length; i++) {
                        choicesArr.push(resolts[i].name);
                    }
                    return choicesArr;
                },
                massage: "select department",
            }, ])
            .then(function(answer) {
                connection.query(
                    "SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m.ON e.manager_id m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.department_id =  d.id WHERE d.name =?", [answer.choice],
                    function(err, results) {
                        if (err) throw err;
                        console.table(resolts);
                        start();
                    }
                );
            });
    });
}

function viewByRole() {
    connection.query("SELECT title FROM role", function(err, resolts) {
        if (err) throw err;
        inquirer
            .prompt([{
                type: "rawlist",
                name: "choice",
                choices: function() {
                    let choiceArr = [];
                    for (i = 0; i < results.length; i++) {
                        choicesArr.push(resolts[i].title);
                    }
                    return choicesArr;
                },
                massage: "select role",
            }, ])
            .then(function(answer) {
                console.log(answer.choice);
                connection.query(
                    "SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m.ON e.manager_id m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.department_id =  d.id WHERE d.name =?", [answer.choice],
                    function(err, results) {
                        if (err) throw err;
                        console.table(resolts);
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
    connection.query("SELECT * FROM employee",
        function(err, resolts) {
            if (err) throw err;
            inquirer.prompt([{

                type: "rawlist",
                name: "choice",
                choices: function() {
                    let choiceArr = [];
                    for (i = 0; i < results.length; i++) {
                        choicesArr.push(resolts[i].last_name);
                    }
                    return choicesArr
                },
                massage: "select employee to update",
            }]).then(function(answer) {
                    const saveName = answer.choices;
                    connection.query("SELECT * FROM employee",
                        function(err, resolts) {
                            if (err) throw err;
                            inquirer.prompt([{
                                type: "rawlist",
                                name: "role",
                                choices: function() {
                                    let choiceArr = [];
                                    for (i = 0; i < results.length; i++) {
                                        choicesArr.push(resolts[i].role_id);
                                    }
                                    return choicesArr
                                },
                                massage: "select title",
                            } {
                                type: "number",
                                name: "manager",

                                validate: function(value) {
                                    if (isNaN(value) === false) {
                                        return true;

                                    }
                                    return false;
                                },
                                message: "Enter manager ID",
                                default: "1"
                            }]).then(function(answer) {
                                    console.log(answer);
                                    console.log(saveName);
                                    connection.query("UPDATE employee SET ? WHERE last_name = ?", [{
                                            role_id: answer.role,
                                            manager_id: answer.manager
                                        }, saveName],
                                    },
                                },
                                console.log("-----------------"); console.log("Employee update"); console.log("------------"); start();
                            });
                    })
            })
    })
}