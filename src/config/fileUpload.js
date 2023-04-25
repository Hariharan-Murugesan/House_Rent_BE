require('dotenv').config();
const AWS = require('aws-sdk');
const { CONSTANT_MSG } = require('../config/constant_messages');
const { v4: uuidv4 } = require('uuid');
const { readS3File } = require('../validator/validation');
// const fetch = require("node-fetch");

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports.multiFileUpload = async (req, res) => {
    try {
        const folder_name = "owner-uploads";
        let arrayOfFile = [];
        if (!req.files) {
            return res.status(400).send({ statusCode: 400, status: CONSTANT_MSG.STATUS.ERROR, message: "Provide any files" });
        }
        for (const file of req.files) {
            const id = uuidv4();
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: `${folder_name}/` + `${id}_${file.originalname}`,
                Body: file.buffer
            };
            const s3File = await s3.upload(params).promise();
            arrayOfFile.push(s3File.Key);
        }
        return res.status(200).send({ statusCode: 200, status: CONSTANT_MSG.STATUS.SUCCESS, message: "Uploaded successfully", data: arrayOfFile });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
}

module.exports.singleFileUpload = async (req, res) => {
    try {
        const folder_name = "owner-uploads";
        const id = uuidv4();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${folder_name}/` + `${id}_${req.file.originalname}`,
            Body: req.file.buffer
        };
        const s3File = await s3.upload(params).promise();
        return res.status(200).send({ statusCode: 200, status: CONSTANT_MSG.STATUS.SUCCESS, message: "Uploaded successfully", data: s3File.Key });
    } catch (error) {
        console.log('error', error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
}

module.exports.readS3File = async (req, res) => {
    try {
        await readS3File.validateAsync(req.query);
        const url = await s3.getSignedUrl('getObject', {
            Bucket: process.env.BUCKET_NAME,
            Key: req.query.key,
            Expires: 600
        })
        return res.status(200).send({ statusCode: 200, status: CONSTANT_MSG.STATUS.SUCCESS, message: "Uploaded successfully", data: url });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
}

module.exports.productUpload = async (req, format) => {
    try {
        const folder_name = "owner-uploads";
        const id = uuidv4();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${folder_name}/` + `${id}${format}`,
            Body: req
        };
        const s3File = await s3.upload(params).promise();
        //  console.log('s3File.Key', s3File);
        return s3File.Key;
    } catch (error) {
        console.log('error', error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
}

// module.exports.pdfFileUpload = async (req, res) => {
//     try {
//         const folder_name = "user-uploads";
//         const id = uuidv4();
//         const params = {
//             Bucket: process.env.BUCKET_NAME,
//             Key: `${folder_name}/` + `${id}_invoice.pdf`,
//             Body: req.file
//         };
//         const s3File = await s3.upload(params).promise();
//         return s3File;
//         // return res.status(200).send({ statusCode: 200, status: CONSTANT_MSG.STATUS.SUCCESS, message: "Uploaded successfully", data: s3File.Key});
//     } catch (error) {
//         console.log('error', error);
//         return error
//     }
// }

module.exports.productTemplate = async (req, res) => {
    try {
        // const folder_name = "rs-files";
        const folder_name = "owner-uploads";
        const id = uuidv4();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${folder_name}/` + `${id}_template.xlsx`,
            Body: req.file
        };
        const s3File = await s3.upload(params).promise();
        // console.log('s3File',s3File);
        return s3File;
        // return res.status(200).send({ statusCode: 200, status: CONSTANT_MSG.STATUS.SUCCESS, message: "Uploaded successfully", data: s3File.Key});
    } catch (error) {
        console.log('error', error);
        return error
    }
}

// module.exports.downloadBulkUploadFile = async (fileKeys, res) => {
//     try {
//         const response = await fetch(fileKeys);
//         const arrayBuffer = await response.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
//         return buffer;
//     } catch (error) {
//         console.log('error', error);
//         return error
//     }
// }

module.exports.readS3FileBuffer = async (s3Key) => {
    try {
        const file = await s3.getObject({ Bucket: process.env.BUCKET_NAME, Key: s3Key }).promise()
        return file
    } catch (error) {
        console.log('error', error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
}