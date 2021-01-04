const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");

const cookieSession = require("cookie-session");
const { compare, hash } = require("./bc");
app.use(
    cookieSession({
        secret: `crocs are awesome`,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 1000ms * 60s * 60mins * 24hours * 14days valid
    })
);
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
    if (
        first == null ||
        last == null ||
        pw == null ||
        email == null ||
        !email.includes("@")
    ) {
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
