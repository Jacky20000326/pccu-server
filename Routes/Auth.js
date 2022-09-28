const Route = require("express").Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;
const Connection = require("../getMysqlConnection")
const memberSchamsJoi = require("../JoiValidate/memberJoi")
const jwt = require('jsonwebtoken');




Route.post("/Register", (req, res) => {
    let { name, mail, password } = req.body
    let typingError = memberSchamsJoi(req.body);
    if (!typingError.error) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                let registerToTable = `INSERT INTO member (M_name,M_password,M_gmail) VALUES ('${name}','${hash}','${mail}')`
                Connection.query(registerToTable, (err, data) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    res.send({ result: "success" })
                })
            });
        });
    } else {
        res.send({ result: "格式輸入有誤" })
        console.log({ err: typingError.error.details[0].message })
    }
})

Route.post("/login", (req, res) => {
    let { email, password } = req.body
    let compareEmail = `SELECT * FROM member Where M_gmail = '${email}'`

    Connection.query(compareEmail, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        if (data.length == 0) {
            res.send({ result: "找不到用戶" })
            console.log("Not Found Data")
            return
        }
        if (!data[0].M_validate) {
            res.send({ result: "找不到用戶" })
            console.log("The User is not validate")
            return
        }
        bcrypt.compare(password, data[0].M_password, (err, isMatch) => {
            if (err) {
                console.log(err)
                return
            }
            if (isMatch) {
                let token = jwt.sign({ id: data[0].M_id, name: data[0].M_name }, process.env.MYTOKENISJWTTOKEN)
                res.send({ result: { success: true, token: "Bearer  " + token, user: data } })
                console.log({ result: { success: true, token: "Bearer  " + token, user: data } })

            } else {
                res.send({ result: "密碼錯誤" })
                console.log("Password is not correct")

            }
        })


    })
})

Route.post("/protect", (req, res) => {
    res.send("success")
})

Route.get("/getAllMember", (req, res) => {
    let GetAllMember = `SELECT * FROM member`
    Connection.query(GetAllMember, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.json({ data })
    })
})

Route.post("/delete/permissions", (req, res) => {
    let { id } = req.body
    console.log(id)
    let FindMember = `SELECT * FROM member WHERE M_id = '${id}'`
    let deletePermissions = `UPDATE member SET M_validate = 0 WHERE M_id ='${id}'`
    let getPermissions = `UPDATE member SET M_validate = 1 WHERE M_id ='${id}'`

    Connection.query(FindMember, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(data[0].M_validate)
        if (data[0].M_validate == 1) {
            Connection.query(deletePermissions, (err, data) => {
                if (err) {
                    console.log(err)
                    return
                }
                res.json({ result: "success", msg: "資料已更新" })
                console.log(data)
            })
        } else {
            Connection.query(getPermissions, (err, data) => {
                if (err) {
                    console.log(err)
                    return
                }
                res.json({ result: "success", msg: "資料已更新" })
            })
        }


    })
})
module.exports = Route