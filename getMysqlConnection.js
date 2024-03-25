const mysql = require("mysql")

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '8903260326',
    database: 'pccudev'
});

module.exports = connection