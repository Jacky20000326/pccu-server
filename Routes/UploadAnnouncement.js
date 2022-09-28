const Route = require("express").Router()
const Connection = require("../getMysqlConnection")
const multer = require("multer")
// const imgFilePath = require("../../src/images/PathExport")


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/images/Announcement_Images");
    },
    filename: (req, file, cb) => {
        const fileName = new Date() + file.originalname;
        cb(null, fileName)
    }
})

// 驗證檔名
let upload = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})



Route.post('/post/announcement', upload.single('upload'), (req, res) => {

    let { category, title, html, poster, smellTitle } = req.body

    let findSameAnnouncement = `SELECT * FROM Announcement WHERE A_title = '${title}'`

    Connection.query(findSameAnnouncement, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            if (data.length == 0) {
                let image = new Date() + req.file.originalname
                let insertAnnouncementToTable = `
    INSERT INTO Announcement (A_category,A_title,A_smellTitle,A_img,A_content,M_name) VALUES ('${category}','${title}','${smellTitle}','${image}','${html}','${poster}')
    `
                Connection.query(insertAnnouncementToTable, (err, data) => {
                    if (err) {
                        res.json({ result: "fail", msg: "上傳失敗" })
                        console.log({ result: "fail", msg: "上傳失敗" })
                        console.log(err)
                        return
                    }
                    res.json({ result: "success", msg: "資料已更新" })
                    console.log({ result: "success", msg: "資料上傳" })

                    console.log(data)
                })
            } else {
                res.json({ result: "fail", msg: "已有相同公告" })

            }
        }
    })






})

Route.post("/post/content", upload.single('wangeditor-uploaded-image'), (req, res) => {
    let fileName = req.file.filename
    console.log({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url": `http://localhost:3003/api/UploadAnnouncement/image/${fileName}`, // 图片 src ，必须
            "alt": "yyy", // 图片描述文字，非必须
            "href": "zzz" // 图片的链接，非必须
        }
    })
    res.json({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url": `http://localhost:3003/api/UploadAnnouncement/image/${fileName}`, // 图片 src ，必须
            "alt": "yyy", // 图片描述文字，非必须
            "href": "zzz" // 图片的链接，非必须
        }
    })

})

// Route.get('/image/:fileName', (req, res) => {
//     const { fileName } = req.params
//     res.sendFile(imgFilePath + '/Announcement_Images/' + fileName)

// })

Route.get('/get/PerAnnouncement', (req, res) => {
    let getAnnouncement = `
    SELECT * FROM Announcement
    `
    Connection.query(getAnnouncement, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.json({ data })
    })
})

Route.post('/get/search/Announcement', (req, res) => {
    let { id } = req.body
    let getAnnouncement = `
    SELECT * FROM Announcement WHERE A_id = '${id}'
    `
    Connection.query(getAnnouncement, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(data)
        res.json(data)
    })
})

Route.post("/find/Announcement", (req, res) => {
    let { title } = req.body

    let findAnnouncement = `
    SELECT * FROM Announcement WHERE A_title = '${title}'
    `
    Connection.query(findAnnouncement, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        if (data.length == 0) {
            res.send({ result: "NOT FOUND" })
            console.log({ result: "NOT FOUND" })
        } else {
            res.send({ result: data })
            console.log({ result: data })

        }
    })
})

Route.post("/update/Announcement", upload.single('upload'), (req, res) => {
    let { category, title, html, poster, smellTitle } = req.body
    let image = new Date() + req.file.originalname
    let findSameAnnouncement = `SELECT * FROM Announcement WHERE A_title = '${title}'`
    let UpdateTeacherTable = `
    UPDATE Announcement SET A_category = "${category}",A_title = "${title}",A_img = "${image}",A_smellTitle = "${smellTitle}",A_content ="${html}",M_name="${poster}" WHERE A_title = "${title}"
    `

    Connection.query(findSameAnnouncement, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        if (data.length == 0) {
            res.send({ result: "fail", msg: "找此無公告" })
            console.log({ result: "NOT FOUND" })
        } else {
            Connection.query(UpdateTeacherTable, (err, data) => {
                if (err) {
                    console.log(err)
                    return
                }
                res.json({ result: "success", msg: "公告已更新" })
                console.log({ result: "success", msg: "公告已更新" })
            })

        }
    })
})


module.exports = Route