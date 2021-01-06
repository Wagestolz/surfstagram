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

app.use(
    cookieSession({
        secret: `crocs are awesome`,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 1000ms * 60s * 60mins * 24hours * 14days valid
    })
);
app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));

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
                db.addUser(first, last, email, hashedPw)
                    .then(({ rows }) => {
                        // console.log("NEW USER added to database table users");
                        req.session.userId = rows[0].id;
                        console.log("req.session.userId: ", req.session.userId);
                        res.json({
                            error: false,
                        });
                    })
                    .catch((err) => {
                        console.log("error in db.addUser(): ", err);
                        res.json({
                            error: true,
                        });
                    });
            })
            .catch((err) => {
                console.log("error in hash(): ", err);
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
                compare(pw, rows[0].password).then((result) => {
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
                console.log("error in db.checkLogin() or compare(): ", err);
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
                        return ses
                            .sendEmail(
                                "thorsten.staender@wagestolz.de",
                                `your Reset code: ${rows[0].code}`,
                                "Reset your password"
                            )
                            .then(() => {
                                res.json({
                                    error: false,
                                    view: 2,
                                });
                            })
                            .catch((err) =>
                                console.log("error in ses.sendEmail: ", err)
                            );
                    })
                    .catch((err) =>
                        console.log("error in createResetCode: ", err)
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
                        return db
                            .updatePw(hashedPw, match.email)
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
                                console.log("error in db.updatePw(): ", err);
                            });
                    })
                    .catch((err) => {
                        console.log("error in hash(): ", err);
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
            console.log("rows: ", rows);
            res.json({
                first: rows[0].first,
                last: rows[0].last,
                email: rows[0].email,
                profile_pic: rows[0].profile_pic,
            });
        })
        .catch((err) => console.log("error in db.getUserInfo():", err));
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
