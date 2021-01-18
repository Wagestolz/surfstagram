// import React from "react";
import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    useEffect(() => {
        let abort;
        (async () => {
            if (!query) {
                const { data } = await axios.get("/usersLatest");
                if (!abort) {
                    setUsers(data);
                }
            } else {
                const { data } = await axios.get("/userSearch", {
                    params: { searchValue: query },
                });
                if (!abort) {
                    setUsers(data);
                }
            }
        })();
        return () => {
            abort = true;
        };
    }, [query]);
    return (
        <div className="buddy-container">
            <div className="buddy-center">
                {!query && <h2>check out who just joined</h2>}
                {!query && (
                    <>
                        {users.map((user, idx) => (
                            <div className="search-container" key={idx}>
                                <img
                                    className="profile-pic"
                                    src={user.profile_pic}
                                    alt={user.first + " " + user.last}
                                />
                                <Link to={"/user/" + user.id}>
                                    <div className="profile-info">
                                        <h3>
                                            {user.first} {user.last}
                                        </h3>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </>
                )}
                {!query && (
                    <h2 className="wannabes">
                        Looking for someone in particular?
                    </h2>
                )}
                <input
                    className="field particular"
                    type="text"
                    onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                    <>
                        {users.map((user, idx) => (
                            <div className="search-container" key={idx}>
                                <img
                                    className="profile-pic"
                                    src={user.profile_pic}
                                    alt={user.first + " " + user.last}
                                />
                                <Link to={"/user/" + user.id}>
                                    <div className="profile-info">
                                        <h3>
                                            {user.first} {user.last}
                                        </h3>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
