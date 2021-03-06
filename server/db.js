const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/surfspots"
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
module.exports.getAllUsers = () => {
    return db.query(
        `SELECT email, id, first, last, profile_pic, bio FROM users`
    );
};

module.exports.getSurfSpots = () => {
    return db.query(
        `SELECT id, lat, lng, name, description, img, creator, created_at 
        FROM surfspots`
    );
};

module.exports.getSurfSpotPosts = () => {
    return db.query(
        `SELECT surfspotposts.id, surfspot_id, surfspot_name, user_id, user_first, user_last, text, img, surfspotposts.created_at, users.profile_pic 
        FROM surfspotposts
        JOIN users
        ON surfspotposts.user_id = users.id
        ORDER BY surfspotposts.id DESC`
    );
};

module.exports.getRatings = () => {
    return db.query(
        `SELECT id, surfspot_id, user_id, rating, created_at
        FROM surfspotratings`
    );
};
module.exports.getFollower = () => {
    return db.query(
        `SELECT id, surfspot_id, user_id, created_at
        FROM followers`
    );
};

module.exports.storeNewSurfSpot = (
    lat,
    lng,
    name,
    description,
    url,
    creator
) => {
    return db.query(
        `INSERT INTO surfspots (lat, lng, name, description, img, creator) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [lat, lng, name, description, url, creator]
    );
};

module.exports.storeNewSurfSpotPost = (
    surfSpotId,
    surfSpotName,
    userId,
    userFirst,
    userLast,
    text,
    url
) => {
    return db.query(
        `INSERT INTO surfspotposts (surfspot_id, surfspot_name, user_id, user_first, user_last, text, img) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [surfSpotId, surfSpotName, userId, userFirst, userLast, text, url]
    );
};
module.exports.storeRating = (surfSpotId, userId, rating) => {
    return db.query(
        `INSERT INTO surfspotratings (surfspot_id, user_id, rating) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (surfspot_id, user_id)
        DO UPDATE SET rating = $3
        RETURNING *`,
        [surfSpotId, userId, rating]
    );
};
module.exports.follow = (surfSpotId, userId) => {
    return db.query(
        `INSERT INTO followers (surfspot_id, user_id) 
        VALUES ($1, $2)
        RETURNING *`,
        [surfSpotId, userId]
    );
};
module.exports.unfollow = (surfSpotId, userId) => {
    return db.query(
        `DELETE FROM followers 
        WHERE surfspot_id = $1
        AND user_id = $2`,
        [surfSpotId, userId]
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
        RETURNING *`,
        [upUrl, userId]
    );
};

module.exports.deleteImage = (id) => {
    return db.query(
        `UPDATE users SET profile_pic = null
        WHERE id = $1
        RETURNING *`,
        [id]
    );
};

/////////////////////
// DELETE PROFILE
/////////////////////

module.exports.deleteChat = (id) => {
    return db.query(`DELETE FROM chat_messages WHERE sender_id = $1`, [id]);
};

module.exports.deleteFriends = (id) => {
    return db.query(
        `DELETE FROM friends 
    WHERE sender_id = $1
    OR recipient_id = $1`,
        [id]
    );
};

module.exports.deleteUser = (id) => {
    return db.query(`DELETE FROM users WHERE id = $1`, [id]);
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

/////////////////////
// REDUX STATE QUERIES
/////////////////////

module.exports.getFriends = (userId) => {
    return db.query(
        `SELECT users.id, first, last, profile_pic, accepted
        FROM friends
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`,
        [userId]
    );
};

/////////////////////
// CHAT QUERIES
/////////////////////

module.exports.postMessage = (senId, msg) => {
    return db.query(
        `INSERT INTO chat_messages (sender_id, message) VALUES ($1, $2) RETURNING *`,
        [senId, msg]
    );
};

module.exports.getTenLastMessages = () => {
    return db.query(
        `SELECT users.id, first, last, profile_pic, message, chat_messages.created_at
        FROM chat_messages
        JOIN users
        on users.id = chat_messages.sender_id 
        ORDER BY chat_messages.id 
        DESC LIMIT 10`
    );
};

/////////////////////
// GET ONLINERS (SOCKET)
/////////////////////

module.exports.getOnliners = (arrayOfIds) => {
    return db.query(
        `SELECT id, first, last, profile_pic FROM users WHERE id = ANY($1)`,
        [arrayOfIds]
    );
};
