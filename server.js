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