const mysql = require("mysql")

let connection = mysql.createConnection({
    // socketPath : 'pccudic-test:asia-northeast1:pccudb',
    host: '34.85.88.229',
    user: 'root',
    password: "GzArALz'URI$k1e(",
    database: 'pccudb'
});

module.exports = connection