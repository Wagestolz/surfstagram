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
