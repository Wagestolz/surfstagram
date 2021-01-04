const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);

// registration (creating the hash from password + salt that we want to insert into the database afterwards)
exports.hash = (plainTextPassword) => {
    // create salt = random string
    return genSalt().then((salt) => {
        // hash the password + salt
        return hash(plainTextPassword, salt);
    });
};

// login (compares user input to the stored hash)
exports.compare = compare;
// compare(plainTextPassword, hash) --> takes 2 arguments!
// The compare method gives back a boolean if no error occurs. If true, the password matches the hash.
