const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "admin",
    password: "123456@Abc",
    database: "classicmodels",
    port: 3306
});

module.exports = connection;
