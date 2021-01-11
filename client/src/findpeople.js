// import React from "react";
import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import OtherProfile from "./otherprofile";

export default function FindPeople({
    first,
    last,
    profile_pic,
    toggleUploader,
    largerSize,
}) {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    // let abort;
    useEffect(() => {
        if (!query) {
            axios.get("/usersLatest").then(({ data }) => {
                setUsers(data);
            });
        } else {
            axios
                .get("/userSearch", { params: { searchValue: query } })
                .then(({ data }) => {
                    setUsers(data);
                });
        }
        // return () => {
        //     console.log(`about to to replace ${query}`);
        //     abort = true;
        // };
    }, [query]);
    // openProfile(id){
    //     console.log("id: ", id);
    // }

    return (
        <div>
            <h2>Find Surfbuddies</h2>
            {!query && <h3>check out who just joined</h3>}
            {!query && (
                <div className="users-container">
                    {users.map((user, idx) => (
                        <div key={idx} className="profile-container">
                            <div className="profile-center">
                                {/* <Link
                                    className="nav-link"
                                    to={"/user/" + user.id}
                                > */}
                                <img
                                    className="profile-pic"
                                    // onClick={openProfile(user.id)}
                                    src={user.profile_pic}
                                    alt={user.first + " " + user.last}
                                />
                                {/* </Link> */}
                                <div className="profile-info">
                                    <h3>
                                        {user.first} {user.last}
                                    </h3>
                                </div>
                            </div>
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
