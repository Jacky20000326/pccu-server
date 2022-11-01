const express = require("express");
const app = express();
const cors = require("cors")
const PORT = process.env.PORT || 3003
const passport = require("passport")
const https = require('https');
const fs = require('fs');
const UploadImageRoute = require("./Routes/index").UploadImage
const UploadVideoRoute = require("./Routes/index").UploadVideo
const UploadTeacher = require("./Routes/index").UploadTeacher
const UploadTopic = require("./Routes/index").UploadTopic
const UploadAnnouncement = require("./Routes/index").UploadAnnouncement
const Passport = require("./Routes/index").Passport
const Auth = require("./Routes/index").Auth


// https 憑證設定
const privateKey  = fs.readFileSync('./ssl/server.key');
const certificate = fs.readFileSync('./ssl/wildcard.pccu.edu.tw.crt');
const credentials = { key: privateKey, cert: certificate};
const httpsServer = https.createServer(credentials ,app);

require("dotenv").config()
require("./config/passport")(passport)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use("/api/uploadImage", UploadImageRoute)
app.use("/api/UploadVideo", UploadVideoRoute)
app.use("/api/UploadTeacher", UploadTeacher)
app.use("/api/UploadTopic", UploadTopic)
app.use("/api/UploadAnnouncement", UploadAnnouncement)
app.use("/api/Passport", Passport)
app.use("/api/Auth", Auth)
// app.use("/api/Auth", passport.authenticate('jwt', { session: false }), Auth)

// app.get('/protect', passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.send("success")
// })


app.get("/", (req, res) => {
    res.send("Home Page")
})



// app.listen(PORT, () => {
//     console.log(`It's port ${PORT}`)
// })
httpsServer.listen(PORT,()=>{
    console.log(`It's port ${PORT}`)
} );