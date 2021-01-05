const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("../secrets");
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1",
});

exports.sendEmail = function (rec, msg, subj) {
    return ses
        .sendEmail({
            Source: "Thorsten from UxFix <thorsten.staender@uxfix.net>",
            Destination: {
                ToAddresses: [rec],
                BccAddresses: ["thorsten.staender@uxfix.net"],
            },
            Message: {
                Body: {
                    Text: {
                        Data: msg,
                    },
                },
                Subject: {
                    Data: subj,
                },
            },
        })
        .promise()
        .then(() => console.log("ses.sendEmail successfull!"))
        .catch((err) => console.log("err in ses.sendEmail: ", err));
};
