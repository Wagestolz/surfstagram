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

module.exports.updateBio = (id, bio) => {
    return db.query(
        `UPDATE users SET bio = $2
        WHERE id = $1
        RETURNING bio`,
        [id, bio]
    );
};

module.exports.getUserInfo = (userId) => {
    return db.query(
        `SELECT email, id, first, last, profile_pic, bio FROM users WHERE id = $1`,
        [userId]
    );
};

module.exports.getLastJoiners = () => {
    return db.query(
        `SELECT id, first, last, profile_pic 
        FROM users 
        ORDER BY id 
        DESC LIMIT 3`
    );
};
module.exports.userSearch = (searchValue) => {
    return db.query(
        `SELECT id, first, last, profile_pic 
        FROM users 
        WHERE first ILIKE $1
        OR last ILIKE $1
        ORDER BY id DESC`,
        ["%" + searchValue + "%"]
    );
};

module.exports.storeNewImage = (upUrl, userId) => {
    return db.query(
        `UPDATE users SET profile_pic = $1
        WHERE id = $2
        RETURNING profile_pic`,
        [upUrl, userId]
    );
};

module.exports.deleteImage = (id) => {
    return db.query(
        `UPDATE users SET profile_pic = null
        WHERE id = $1
        RETURNING profile_pic`,
        [id]
    );
};

/////////////////////
// FRIENDSHIP QUERIES
/////////////////////

module.exports.friendStatus = (friendId, userId) => {
    return db.query(
        `SELECT id, sender_id, recipient_id, accepted FROM friends WHERE (sender_id = $1 
        AND recipient_id = $2)
        OR (recipient_id = $1
        AND sender_id = $2)`,
        [friendId, userId]
    );
};

module.exports.friendRequest = (senId, recId) => {
    return db.query(
        `INSERT INTO friends (sender_id, recipient_id) VALUES ($1, $2) RETURNING *`,
        [senId, recId]
    );
};

module.exports.acceptRequest = (userId, friendId) => {
    return db.query(
        `UPDATE friends SET accepted = true
        WHERE (sender_id = $1 
        AND recipient_id = $2)
        OR (recipient_id = $1
        AND sender_id = $2) RETURNING *`,
        [userId, friendId]
    );
};

module.exports.cancelRequest = (friendId, userId) => {
    return db.query(
        `DELETE FROM friends WHERE
        (sender_id = $1 
        AND recipient_id = $2)
        OR (recipient_id = $1
        AND sender_id = $2)`,
        [friendId, userId]
    );
};

module.exports.unfriend = (friendId, userId) => {
    return db.query(
        `DELETE FROM friends WHERE
        (sender_id = $1 
        AND recipient_id = $2)
        OR (recipient_id = $1
        AND sender_id = $2)`,
        [friendId, userId]
    );
};
