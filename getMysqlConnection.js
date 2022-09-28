const mysql = require("mysql")

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pccupassword',
    database: 'pccudb'
});

module.exports = connection