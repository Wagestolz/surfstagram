// import React from "react";

export default function ProfilePic({ first, last, email, profile_pic }) {
    return (
        <div>
            <h2>Profile Pic</h2>
            <h3>{first}</h3>
            <h3>{last}</h3>
            <h3>{email}</h3>
            <h3>{profile_pic}</h3>
        </div>
    );
}
