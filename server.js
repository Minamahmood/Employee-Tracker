const inquirer = requier("inquirer");
const mysql = requier("mysql");
const cTable = requier("console.table");

const connection = mysql.ceateConnection({
    host: "localhost",
    port: 3306,
    user "root",
    password: "password",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("SQL connected");
    start();
})

function start() {
    inquirer.prompt([{
            type: "list",
            name: "start",
            message: "we have information on employees,departments,and employee roles. what would like to do?",
            choices: ["view", "Add", "update", "Exit"]
        }

    ]).then(function(res) {
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