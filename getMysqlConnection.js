const mysql = require("mysql")

let connection = mysql.createConnection({
    host: '1.200.80.150',
    user: 'root',
    password: '8903260326',
    database: 'pccudev'
});

module.exports = connection