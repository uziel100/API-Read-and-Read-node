const aws = require('aws-sdk');

aws.config.update({
    region: process.env.S3region,
    accessKeyId: process.env.S3accessKeyId,
    secretAccessKey: process.env.S3secretAccessKey
})

module.exports = aws;



