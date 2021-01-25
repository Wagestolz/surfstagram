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
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

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
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
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
            res.json(rows);
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

app.get(`/getuser/:id`, (req, res) => {
    if (req.query.id == req.session.userId) {
        res.json({ ownProfile: true });
    } else {
        db.getUserInfo(req.query.id)
            .then(({ rows }) => {
                res.json(rows);
            })
            .catch((err) => console.log("error in db.getUserInfo():", err));
    }
});

app.get(`/usersLatest`, (req, res) => {
    db.getLastJoiners()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in db.getLastJoiners():", err));
});

app.get(`/userSearch`, (req, res) => {
    db.userSearch(req.query.searchValue)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in db.userSearch():", err));
});

app.get("/user", function (req, res) {
    db.getUserInfo(req.session.userId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in db.getUserInfo():", err));
});

app.get("/friendstatus", function (req, res) {
    db.friendStatus(req.query.friendId, req.session.userId)
        .then(({ rows }) => {
            res.json({ rows: rows, userId: req.session.userId });
        })
        .catch((err) => console.log("error in db.friendStatus():", err));
});

app.post("/friendaction", function (req, res) {
    let { action, friendStatus, friendId } = req.body;
    if (action == "accept") {
        db.acceptRequest(req.session.userId, friendId).then(({ rows }) => {
            res.json({ rows: rows, userId: req.session.userId });
        });
    } else if (action == "make request") {
        db.friendRequest(req.session.userId, friendId).then(({ rows }) => {
            res.json({ rows: rows, userId: req.session.userId });
        });
    } else if (action == "unfriend") {
        db.unfriend(friendId, req.session.userId).then(() => {
            res.json({ rows: [], userId: req.session.userId });
        });
    } else if (action == "cancel request") {
        db.cancelRequest(friendId, req.session.userId).then(() => {
            res.json({ rows: [], userId: req.session.userId });
        });
    }
});

app.get("/getfriends", (req, res) => {
    db.getFriends(req.session.userId)
        .then(({ rows }) => {
            res.json({ users: rows });
        })
        .catch((err) => console.log("error in db.getFriends():", err));
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

let onliners = [];
let socketToIds = {};

io.on("connection", (socket) => {
    console.log(`socket with id ${socket.id} just connected`);
    socketToIds[socket.id] = socket.request.session.userId;
    onliners.push(socket.request.session.userId);
    let uniqOnliners = [...new Set(onliners)];
    db.getOnliners(uniqOnliners)
        .then(({ rows }) => {
            io.sockets.emit("who is online", rows);
        })
        .catch((err) => console.log("error in db.getOnliners():", err));
    socket.on("disconnect", () => {
        delete socketToIds[socket.id];
        const index = onliners.indexOf(socket.request.session.userId);
        if (index > -1) {
            onliners.splice(index, 1);
            let uniqOnliners = [...new Set(onliners)];
            return db
                .getOnliners(uniqOnliners)
                .then(({ rows }) => {
                    // onliners = uniqOnliners;
                    io.sockets.emit("who is online", rows);
                })
                .catch((err) => console.log("error in db.getOnliners():", err));
        }
    });
    socket.on("friend request", (targetId) => {
        // console.log("Who I friended: ", targetId);
        // console.log("Who I am: ", socket.request.session.userId);
        for (const key in socketToIds) {
            if (socketToIds[key] == targetId) {
                io.sockets.sockets.get(key).emit("friend request", {
                    fromUser: socket.request.session.userId,
                });
            }
        }
    });
    db.getTenLastMessages()
        .then(({ rows }) => {
            socket.emit("10 last messages", rows);
        })
        .catch((err) => console.log("error in db.getTenLastMessages():", err));
    socket.on("post Message", (message) => {
        db.postMessage(socket.request.session.userId, message)
            .then(({ rows }) => {
                const { message, sender_id, created_at } = rows[0];
                return db.getUserInfo(sender_id).then(({ rows }) => {
                    const { first, last, profile_pic } = rows[0];
                    io.sockets.emit("render new Message", {
                        message: message,
                        id: sender_id,
                        first: first,
                        last: last,
                        profile_pic: profile_pic,
                        created_at: created_at,
                    });
                });
            })
            .catch((err) => console.log("error in db.postMessage():", err));
    });
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
