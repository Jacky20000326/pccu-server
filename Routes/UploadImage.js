const Route = require("express").Router()
const multer = require("multer")
const Connection = require("../getMysqlConnection")
const { Storage } = require("@google-cloud/storage")
// const imageFilePath = require("../../src/images/PathExport")
const fs = require("fs")



let projectId = 'pccudic-test';
let keyFilename = 'mykey.json';


const googleStorage = new Storage({
    projectId,
    keyFilename
})

const bucket = googleStorage.bucket('pccustorage')





const rootPath = require.main.path + '/images'
const moment = require("moment")

// multer config


let storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, rootPath);
    // },
    storage:multer.memoryStorage,
    filename: (req, file, cb) => {
        const fileName = moment().format('YYYY-MM-DD-HH-mm-ss').replace(/:/g, '-') + file.originalname;
        cb(null, fileName)
    }
})

// 驗證檔名
let upload = multer({
    storage: multer.memoryStorage(),

    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "blob"|| file.mimetype == "image/jpeg") {
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

    // === google storage === 
    if(req.file){
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
                // contentType: req.file.mimetype,
                // 將存儲桶中的文件設置為公開
                // 請注意這僅適用於新上傳的文件，對於已存在的文件，你需要單獨設置公開權限
                predefinedAcl: 'publicRead'
            },
            resumable: false
        });
        blobStream.on("finish",()=>{
            console.log('success')
        })

        blobStream.end(req.file.buffer)
    }



    // let data =  moment().format('YYYY-MM-DD-HH-mm-ss').replace(/:/g, '-') +req.file.originalname
    let data = req.file.originalname
    Connection.query(insertImageToTable, data, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.send("success upload images")
    })
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
