const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("../secrets");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.delete = (req, res, next) => {
    const url = req.body.params.url;
    const filename = url.substring(url.length - 36, url.length);
    const promise = s3
        .deleteObject({
            Bucket: "aloha.surfspots",
            Key: filename,
        })
        .promise();
    promise
        .then(() => {
            console.log("amazon deletion successful");
            next();
        })
        .catch((err) => {
            console.log(
                "Something went wrong with the image deletion at S3",
                err
            );
            res.sendStatus(500);
        });
};

module.exports.upload = (req, res, next) => {
    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "aloha.surfspots",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("amazon upload complete");
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log(
                "Something went wrong with the image upload to S3",
                err
            );
            res.sendStatus(500);
        });
};
