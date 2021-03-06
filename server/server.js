const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const csurf = require("csurf");
const cookieSession = require("cookie-session");
const { compare, hash } = require("./bc");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const multer = require("multer"); // middleware for handling multipart/form-data (for uploading files)
const uidSafe = require("uid-safe"); // generating unique names for uploaded images
const s3 = require("./s3");
const { s3Url } = require("./config.json");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152, // = 2mb
    },
});

const cookieSessionMiddleware = cookieSession({
    secret: `crocs are awesome`,
    maxAge: 1000 * 60 * 60 * 24 * 14, // 1000ms * 60s * 60mins * 24hours * 14days valid
});

app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(cookieSessionMiddleware);

app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// redirecting
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/register", (req, res) => {
    const { first, last, email, pw } = req.body;
    if (!first || !last || !pw || !email || !email.includes("@")) {
        console.log("invalid input into fields");
        res.json({
            error: true,
        });
    } else {
        hash(pw)
            .then((hashedPw) => {
                return db.addUser(first, last, email, hashedPw);
            })
            .then(({ rows }) => {
                req.session.userId = rows[0].id;
                res.json({
                    error: false,
                });
            })
            .catch((err) => {
                console.log("error in hash() or db.addUser():: ", err);
                res.json({
                    error: true,
                });
            });
    }
});

app.post("/login", (req, res) => {
    const { email, pw } = req.body;
    if (!pw || !email) {
        console.log("invalid input into fields");
        res.json({
            error: true,
        });
    } else {
        db.checkLogin(email)
            .then(({ rows }) => {
                return compare(pw, rows[0].password).then((result) => {
                    if (result) {
                        req.session.userId = rows[0].id;
                        res.json({
                            error: false,
                        });
                    } else {
                        console.log(
                            "error in compare() --> pw appears to be not matching"
                        );
                        res.json({
                            error: true,
                        });
                    }
                });
            })
            .catch((err) => {
                console.log("error in db.checkLogin(): ", err);
                res.json({
                    error: true,
                });
            });
    }
});

app.post("/reset/email", (req, res) => {
    const { email } = req.body;
    db.checkExist(email)
        .then(({ rows }) => {
            if (rows.length == 0) {
                res.json({
                    error: true,
                    msg: "No user with such email!",
                    view: 1,
                });
            } else {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                return db
                    .createResetCode(email, secretCode)
                    .then(({ rows }) => {
                        return ses.sendEmail(
                            "thorsten.staender@wagestolz.de",
                            `your Reset code: ${rows[0].code}`,
                            "Reset your password"
                        );
                    })
                    .then(() => {
                        res.json({
                            error: false,
                            view: 2,
                        });
                    })
                    .catch((err) =>
                        console.log(
                            "error in ses.sendEmail() or createResetCode(): ",
                            err
                        )
                    );
            }
        })
        .catch((err) => {
            console.log("error in db.checkExist(): ", err);
        });
});

app.post("/reset/verify", (req, res) => {
    const { code, pw } = req.body;
    db.validateResetCode()
        .then(({ rows }) => {
            let match = rows.find((item) => item.code === code);
            if (match) {
                return hash(pw)
                    .then((hashedPw) => {
                        return db.updatePw(hashedPw, match.email);
                    })
                    .then(() => {
                        console.log(
                            "successfully updated pw in database table users"
                        );
                        res.json({
                            error: false,
                            view: 3,
                        });
                    })
                    .catch((err) => {
                        console.log(
                            "error in db.updatePw() or in hash(): ",
                            err
                        );
                    });
            } else {
                res.json({
                    error: true,
                    msg: "Code is invalid!",
                    view: 2,
                });
            }
        })
        .catch((err) => {
            console.log("error in db.validateResetCode(): ", err);
        });
});

app.get("/user", function (req, res) {
    db.getUserInfo(req.session.userId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in db.getUserInfo():", err));
});
app.get("/allusers", function (req, res) {
    db.getAllUsers(req.session.userId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in db.getAllUsers():", err));
});

app.get("/surfspots", function (req, res) {
    db.getSurfSpots()
        .then(({ rows }) => {
            res.json({ surfSpots: rows });
        })
        .catch((err) => console.log("error in db.getSurfSpots():", err));
});

app.get("/surfspotposts", function (req, res) {
    db.getSurfSpotPosts()
        .then(({ rows }) => {
            res.json({ surfSpotPosts: rows });
        })
        .catch((err) => console.log("error in db.getSurfSpotPosts():", err));
});
app.get("/ratings", function (req, res) {
    db.getRatings()
        .then(({ rows }) => {
            res.json({ ratings: rows });
        })
        .catch((err) => console.log("error in db.getRatings():", err));
});
app.get("/follower", function (req, res) {
    db.getFollower()
        .then(({ rows }) => {
            res.json({ followers: rows });
        })
        .catch((err) => console.log("error in db.getFollower():", err));
});

app.post("/createsurfspot", uploader.single("img"), s3.upload, (req, res) => {
    const url = `${s3Url}${req.file.filename}`;
    if (req.file) {
        db.storeNewSurfSpot(
            req.body.lat,
            req.body.lng,
            req.body.name,
            req.body.description,
            url,
            req.body.creator
        )
            .then(({ rows }) => {
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log("error in db.storeNewSurfSpot: ", err);
            });
    } else {
        res.json({ error: true });
    }
});
app.post(
    "/createsurfspotpost",
    uploader.single("img"),
    s3.upload,
    (req, res) => {
        const url = `${s3Url}${req.file.filename}`;
        if (req.file) {
            db.storeNewSurfSpotPost(
                req.body.surfSpotId,
                req.body.surfSpotName,
                req.body.userId,
                req.body.userFirst,
                req.body.userLast,
                req.body.text,
                url
            )
                .then(({ rows }) => {
                    res.json(rows[0]);
                })
                .catch((err) => {
                    console.log("error in db.storeNewSurfSpotPost: ", err);
                });
        } else {
            res.json({ error: true });
        }
    }
);

app.post("/createrating", (req, res) => {
    let { surfSpotId, userId, rating } = req.body;
    db.storeRating(surfSpotId, userId, rating)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error in db.storeRating: ", err);
        });
});
app.post("/followeraction", (req, res) => {
    let { surfSpotId, following } = req.body;
    if (!following) {
        db.follow(surfSpotId, req.session.userId)
            .then(({ rows }) => {
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log("error in db.follow: ", err);
            });
    } else {
        db.unfollow(surfSpotId, req.session.userId)
            .then(() => {
                res.json({
                    unfollow: true,
                    userId: req.session.userId,
                    surfSpotId: surfSpotId,
                });
            })
            .catch((err) => {
                console.log("error in db.unfollow: ", err);
            });
    }
});

app.post("/imageupload", uploader.single("image"), s3.upload, (req, res) => {
    const url = `${s3Url}${req.file.filename}`;
    if (req.file) {
        db.storeNewImage(url, req.session.userId)
            .then(({ rows }) => {
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log("error in db.storeNewImage: ", err);
            });
    } else {
        res.json({ error: true });
    }
});

app.post("/deleteimg", s3.delete, (req, res) => {
    const id = req.session.userId;
    db.deleteImage(id)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error in db.deleteImage: ", err);
        });
});

app.post("/deleteprofile", (req, res) => {
    db.deleteChat(req.session.userId)
        .then((res) => {
            console.log("delete chat resolved", res);
            return db.deleteFriends(req.session.userId);
        })
        .then((res) => {
            console.log("delete friends resolved", res);
            return db.deleteUser(req.session.userId);
        })
        .then((response) => {
            console.log("delete User resolved", response);
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in Deletion-Process: ", err);
        });
});

app.post("/updateBio", (req, res) => {
    const id = req.session.userId;
    const { bioDraft } = req.body;
    db.updateBio(id, bioDraft)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in db.updateBio: ", err);
        });
});

app.get("/user", function (req, res) {
    db.getUserInfo(req.session.userId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in db.getUserInfo():", err));
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.sendStatus(200);
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
