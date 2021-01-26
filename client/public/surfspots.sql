DROP TABLE IF EXISTS friends; 
DROP TABLE IF EXISTS reset_codes; 
DROP TABLE IF EXISTS chat_messages; 
DROP TABLE IF EXISTS surfspotposts; 
DROP TABLE IF EXISTS surfspotratings; 
DROP TABLE IF EXISTS followers; 
DROP TABLE IF EXISTS surfspots; 
DROP TABLE IF EXISTS users; 

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_pic VARCHAR,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friends(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE surfspots(
    id SERIAL PRIMARY KEY,
    lat DECIMAL NOT NULL,
    lng DECIMAL NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    img VARCHAR,
    creator INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE surfspotposts(
    id SERIAL PRIMARY KEY,
    surfspot_id INT REFERENCES surfspots(id) NOT NULL,
    surfspot_name VARCHAR(255) NOT NULL,
    user_id INT REFERENCES users(id) NOT NULL,
    user_first VARCHAR(255) NOT NULL,
    user_last VARCHAR(255) NOT NULL,
    text TEXT,
    img VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE surfspotratings(
    id SERIAL PRIMARY KEY,
    surfspot_id INT REFERENCES surfspots(id) NOT NULL,
    user_id INT REFERENCES users(id) NOT NULL,
    rating INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (surfspot_id, user_id)
);


CREATE TABLE followers(
    id SERIAL PRIMARY KEY,
    surfspot_id INT REFERENCES surfspots(id) NOT NULL,
    user_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (surfspot_id, user_id)
);

-- 1 INSERT USER
INSERT INTO users (first, last, email, password, profile_pic, bio) VALUES ('Stephanie', 'Gilmore', 'jasmine0@example.com', '$2a$10$rC6iCsXcGZhq6xaBtTo61O1T.lh9NLA5n0qYQ8SfxxXPm1faonrXG', 'https://s3.amazonaws.com/aloha.surfspots/StephanieGilmore.jpg', 'Son-in-Law. Boyfriend. Blackjack Dealer. Taking the scenic route. 🛢🧵🗝'),('Lakey', 'Peterson', 'jasmine1@example.com', '$2a$10$rC6iCsXcGZhq6xaBtTo61O1T.lh9NLA5n0qYQ8SfxxXPm1faonrXG', 'https://s3.amazonaws.com/aloha.surfspots/LakeyPeterson.jpg', 'Son-in-Law. Boyfriend. Francophile. Welcome to Fantasy Island. 📎〽️🧷'),('Carissa', 'Moore', 'jasmine2@example.com', '$2a$10$rC6iCsXcGZhq6xaBtTo61O1T.lh9NLA5n0qYQ8SfxxXPm1faonrXG', 'https://s3.amazonaws.com/aloha.surfspots/CarissaMoore.jpg', 'Daughter-in-Law. Sister. Angel Investor. If it keeps just one kid off drugs, it''s worth it. 🛌🌿♥️'),('Tatiana', 'Weston-Webb', 'jasmine3@example.com', '$2a$10$rC6iCsXcGZhq6xaBtTo61O1T.lh9NLA5n0qYQ8SfxxXPm1faonrXG', 'https://s3.amazonaws.com/aloha.surfspots/TatianaWeston-Webb.jpg', 'Great-Grandson. Grandson. Waiter. Poor, but sexy. 🥠📪💼'),('Johanne', 'Defay', 'jasmine4@example.com', '$2a$10$rC6iCsXcGZhq6xaBtTo61O1T.lh9NLA5n0qYQ8SfxxXPm1faonrXG', 'https://s3.amazonaws.com/aloha.surfspots/JohanneDefay.jpg', 'Grandson. Roommate. Amateur Egyptologist. That''s no moon. 🍨🙀🀄'),('Gabriel', 'Medina', 'jasmine5@example.com', '$2a$10$rC6iCsXcGZhq6xaBtTo61O1T.lh9NLA5n0qYQ8SfxxXPm1faonrXG', 'https://s3.amazonaws.com/aloha.surfspots/GabrielMedina.jpg', 'Daughter. Sister-in-Law. Farmer. A stranger in a strange land. 👖🍼🚤'),('Julian', 'Wilson', 'jasmine6@example.com', '$2a$10$rC6iCsXcGZhq6xaBtTo61O1T.lh9NLA5n0qYQ8SfxxXPm1faonrXG', 'https://s3.amazonaws.com/aloha.surfspots/JulianWilson.jpg', 'Mother-in-Law. Sister. Executive Editor. This little piggy went to market. 🚽📱🍽'),('Filipe', 'Toledo', 'jasmine7@example.com', '$2a$10$rC6iCsXcGZhq6xaBtTo61O1T.lh9NLA5n0qYQ8SfxxXPm1faonrXG', 'https://s3.amazonaws.com/aloha.surfspots/FilipeToledo.jpg', 'Wife. Sister. Creep. The unkindest cut of all. 🎥🍍⛅️'),('Italo', 'Ferreira', 'jasmine8@example.com', '$2a$10$rC6iCsXcGZhq6xaBtTo61O1T.lh9NLA5n0qYQ8SfxxXPm1faonrXG', 'https://s3.amazonaws.com/aloha.surfspots/ItaloFerreira.png', 'Daughter. Sister. Bibliophile. Poof! You''re a sandwich. 💗💃🖖'),('Jordy', 'Smith', 'jasmine9@example.com', '$2a$10$rC6iCsXcGZhq6xaBtTo61O1T.lh9NLA5n0qYQ8SfxxXPm1faonrXG', 'https://s3.amazonaws.com/aloha.surfspots/JordySmith.jpg', 'Roommate. Step-Father. Faith Healer. Love is all there is. 🗨🍻🐿');

-- INSERT INTO surfspotratings (surfspot_id, user_id, rating) VALUES (1, 13, 3); 
-- INSERT INTO surfspotratings (surfspot_id, user_id, rating) VALUES (1, 100, 4); 
-- INSERT INTO surfspotratings (surfspot_id, user_id, rating) VALUES (1, 150, 5); 


-- INSERT INTO followers (surfspot_id, user_id) VALUES (1, 13); 


-- INSERT INTO surfspots (lat, lng, name, description, img, creator) VALUES (21.707114638981295, -157.99116931717083, 'Kawela Bay', 'Located next to Haleiwa Beach Park, Kawela Bay is a great spot to catch your first wave or perfect your technique. It is ideal for surfers and stand up paddleboarders alike. There is also some shade to be had along the shoreline if you need a break from the rays. As an added bonus, it’s not far from Haleiwa, a great town with cool surf shops, restaurants, boutiques, and art galleries.', 'https://cdn1.theinertia.com/wp-content/gallery/two-brothers/mg_8083.jpg', 3); 


-- INSERT INTO friends (sender_id, recipient_id, accepted) VALUES (10, 20, false); 
-- INSERT INTO friends (sender_id, recipient_id, accepted) VALUES (10, 21, true); 
-- INSERT INTO friends (sender_id, recipient_id, accepted) VALUES (22, 10, false); 

