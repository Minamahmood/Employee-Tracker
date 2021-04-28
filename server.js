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