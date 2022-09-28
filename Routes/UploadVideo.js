const Route = require("express").Router()
const Connection = require("../getMysqlConnection")
Route.post('/upload/video', (req, res) => {
    const { link, title, content } = req.body
    console.log(link, title, content)
    let insertVideoToTable = `
    INSERT INTO video (V_title,V_content,V_link) VALUES ('${title}','${content}','${link}')
    `
    Connection.query(insertVideoToTable, (err, data) => {
        if (err) {
            console.log(err.sqlMessage)
            res.json({ result: "fail", msg: "上傳失敗" })
            return
        }
        console.log({ result: "success", msg: "上傳成功" })
        res.json({ result: "success", msg: "上傳成功" })
    })

})

Route.get('/getVideo', (req, res) => {
    let GetVideo = `SELECT * FROM video`
    Connection.query(GetVideo, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.json(data)
    })

})

Route.post('/DeleteVideo', (req, res) => {
    let { v_id } = req.body
    let DeleteVideo = `DELETE FROM video WHERE V_id = ${v_id}`
    Connection.query(DeleteVideo, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.json({ result: "success", msg: "刪除成功" })
        console.log("success")
    })
})
module.exports = Route