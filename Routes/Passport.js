const Route = require("express").Router()
const Connection = require("../getMysqlConnection")
Route.post('/validation', (req, res) => {
    let { password } = req.body
    let FindPassport = `SELECT * FROM Passport WHERE passport  = '${password}'`
    Connection.query(FindPassport, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        if (data.length == 0) {
            res.json({ data: "驗證碼不正確" })
            console.log({ data: "驗證碼不正確" })
        } else {
            res.json({ data: "success" })
            console.log({ data: "success" })
        }
    })
})
module.exports = Route