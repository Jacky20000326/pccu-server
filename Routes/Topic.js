const Route = require("express").Router()
const multer = require("multer")
const Connection = require("../getMysqlConnection")
const rootPath = require.main.path + '/images'
const { Storage } = require("@google-cloud/storage")
let getImageFilename

let projectId = 'pccudic-test';
let keyFilename = 'mykey.json';

const googleStorage = new Storage({
    projectId,
    keyFilename
})

const bucket = googleStorage.bucket('pccustorage')


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, rootPath);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname;
        cb(null, fileName)
    }
})

// 驗證檔名
let upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

Route.post('/post/topic', upload.array("Image_Path", 6), (req, res) => {
    let { title, content, fb_link, ig_link, website_link, film_Link, teacher, student } = req.body

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



    let insertTopicToTable = `
    INSERT INTO topic (TP_title,TP_content,TP_img,TP_fb_link,TP_ig_link,TP_website_link,TP_film_link,TP_students,TP_teachers) VALUES ('${title}','${content}','${req.files[0].originalname}','${fb_link}','${ig_link}','${website_link}','${film_Link}','${student}','${teacher}')
    `

    let queryTopic = `
        SELECT * FROM topic WHERE TP_title = '${title}'
    `


    Connection.query(insertTopicToTable, (err, data) => {
        if (err) {
            res.json({ result: "fail", msg: "上傳失敗" })
            console.log(err)
            return
        }
        Connection.query(queryTopic, (err, data) => {
            if (err) {
                res.json({ result: "fail", msg: "上傳失敗" })
                console.log(err)
                return
            }
            for (var i = 0; i <= req.files.length - 1; i++) {
                Connection.query(`INSERT INTO topicIMG (TPI_src,TP_id) VALUES ('${req.files[i].originalname}','${data[0].TP_id}')`, (err, data) => {
                    if (err) {
                        res.json({ result: "fail", msg: "上傳失敗" })
                        console.log(err)
                        return
                    }
                    console.log(data)

                })
            }
            res.json({ result: "success", msg: "上傳成功" })
        })
    })



})
Route.get('/get/topic', (req, res) => {
    let getAllTopic = `
    SELECT * FROM topic
`
    Connection.query(getAllTopic, (err, data) => {
        if (err) {
            res.json({ result: "fail", msg: "上傳失敗" })
            console.log(err)
            return
        }
        res.json({ data })

    })
})

Route.post('/get/topic/detail', (req, res) => {
    let { title } = req.body
    let getTopicDetail = `
        SELECT * FROM topicIMG JOIN topic ON topicIMG.TP_id = topic.TP_id WHERE TP_title = '${title}'
    `
    Connection.query(getTopicDetail, (err, data) => {
        if (err) {
            res.json({ result: "fail", msg: "取得失敗" })
            console.log(err)
            return
        }
        console.log({ data })
        res.json({ data })

    })

})

Route.get('/get/topic/detail', (req, res) => {

    let getTopicDetail = `
        SELECT * FROM topicIMG JOIN topic ON topicIMG.TP_id = topic.TP_id WHERE TP_title = '喬比女孩 Chubby Girl'
    `
    Connection.query(getTopicDetail, (err, data) => {
        if (err) {
            res.json({ result: "fail", msg: "取得失敗" })
            console.log(err)
            return
        }
        console.log({ data })
        res.json({ data })

    })

})

Route.post('/delete/topic', (req, res) => {
    let { title } = req.body


    let queryTopic = `SELECT * FROM topic WHERE TP_title = '${title}'`

    Connection.query(queryTopic, (err, data) => {
        if (err) {
            res.json({ result: "fail", msg: "刪除失敗" })
            console.log(err)
            return
        }
        if (data.length == 0) {
            res.json({ result: "fail", msg: "無刪除資料" })
            console.log({ result: "fail", msg: "無刪除資料" })
            return
        }

        let id = data[0].TP_id
        console.log(id)
        Connection.query(`DELETE FROM topic WHERE TP_id = '${id}'`, (err, data) => {
            if (err) {
                res.json({ result: "fail", msg: "刪除失敗" })
                console.log(err)
                return
            }
            res.json({ result: "success", msg: "刪除成功" })
            console.log({ result: "success", msg: "刪除成功", data: data })

        })


    })
})
module.exports = Route