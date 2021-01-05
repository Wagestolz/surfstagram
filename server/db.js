const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.addUser = (firstName, LastName, emailAdress, hashedPw) => {
    return db.query(
        `INSERT INTO users (first,last,email,password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [firstName, LastName, emailAdress, hashedPw]
    );
};

module.exports.checkLogin = (email) => {
    return db.query(`SELECT password, id FROM users WHERE email = $1`, [email]);
};

module.exports.checkExist = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

module.exports.createResetCode = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes (email, code) VALUES ($1, $2) RETURNING *`,
        [email, code]
    );
};

module.exports.validateResetCode = () => {
    return db.query(
        `SELECT * FROM reset_codes
        WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'`
    );
};

module.exports.updatePw = (pw, email) => {
    return db.query(
        `UPDATE users SET password = $1
        WHERE email = $2`,
        [pw, email]
    );
};
