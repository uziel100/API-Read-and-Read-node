const express = require('express')
const fileUpload = require("express-fileupload");
const { checkToken } = require("../middlewares/autentication");
const { validTypeCollection, validTypeFile, checkIfThereIsFile } = require('../middlewares/validateFile')
const aws = require('../config/aws')
const app = express();


// default options
app.use(fileUpload());

app.post('/upload/:type/:id',
    [
    // checkToken,
    validTypeCollection,
    checkIfThereIsFile,
    validTypeFile
    ],
    (req, res) => {
    const { type } = req.params;
    const { fileName, fileType }  = req;
    const file = req.files.file         
       
    const s3 = new aws.S3();
    const s3Params = {
        Bucket: process.env.S3_BUCKET + '/' + type,
        Key: fileName,
        Body: file.data,        
        ContentType: fileType,        
    };
    
    s3.upload( s3Params, (err) => {    
        if (err) {            
            return res.json({ success: false, error: err })
        }                

        res.json({ status: true, urlName: fileName });
    });    
})

module.exports = app;



