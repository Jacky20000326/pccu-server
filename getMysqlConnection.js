const mysql = require("mysql")

let connection = mysql.createConnection({
    host: '34.85.88.229',
    user: 'root',
    password: "GzArALz'URI$k1e(",
    database: 'pccudb'
});

module.exports = connection