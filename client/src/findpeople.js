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
        <div>
            <h2>Find Surfbuddies</h2>
            {!query && <h3>check out who just joined</h3>}
            {!query && (
                <div className="users-container">
                    {users.map((user, idx) => (
                        <div key={idx} className="profile-container">
                            <Link className="nav-link" to={"/user/" + user.id}>
                                <div className="profile-center">
                                    <img
                                        className="profile-pic"
                                        // onClick={openProfile(user.id)}
                                        src={user.profile_pic}
                                        alt={user.first + " " + user.last}
                                    />
                                    <div className="profile-info">
                                        <h3>
                                            {user.first} {user.last}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            {!query && <h3>Looking for someone in particular?</h3>}
            <input type="text" onChange={(e) => setQuery(e.target.value)} />
            {query && (
                <div className="users-container">
                    {users.map((user, idx) => (
                        <div key={idx} className="profile-container">
                            <Link className="nav-link" to={"/user/" + user.id}>
                                <div className="profile-center">
                                    <img
                                        className="profile-pic"
                                        src={user.profile_pic}
                                        alt={user.first + " " + user.last}
                                    />
                                    <div className="profile-info">
                                        <h3>
                                            {user.first} {user.last}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
