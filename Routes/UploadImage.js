const Route = require("express").Router()
const multer = require("multer")
const Connection = require("../getMysqlConnection")
// const imageFilePath = require("../../src/images/PathExport")
const fs = require("fs")
const rootPath = require.main.path + '/images'


// multer config


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, rootPath);
    },
    filename: (req, file, cb) => {
        const fileName = String(file.originalname);
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


// Routes

Route.post("/post/image", upload.single('Image_Path'), (req, res) => {
    let insertImageToTable = `
    INSERT INTO image (I_file) VALUES (?)
    `
    let data = String(req.file.originalname)
    Connection.query(insertImageToTable, data, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.send("success upload images")
    })
    console.log(req.file.path)
})

// 取得上傳圖片
Route.get('/getImage', (req, res) => {
    let GetImage = `SELECT * FROM image`
    Connection.query(GetImage, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.send(data)
    })

})

Route.post("/delete/uploadImage", (req, res) => {
    let { fileName } = req.body
    console.log(fileName)
    let sql = `DELETE FROM image WHERE I_file = ?`
    let data = fileName
    Connection.query(sql, data, (err, data) => {
        if (err) {
            console.log({ msg: err.sqlMessage })
            return
        }
        res.json({ msg: "文件刪除成功" })
        console.log({ msg: "文件刪除成功" })

        // fs.unlinkSync(`${imageFilePath}/${fileName}`)

    })


    // fs.access(filepath, (err, isExist) => {
    //     if (err.code == "ENOENT") {
    //         console.log("找無此檔案")
    //     } else {
    //         console.log(isExist)
    //     }
    // })


})

module.exports = Route
