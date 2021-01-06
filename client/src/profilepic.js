// import React from "react";

export default function ProfilePic({
    first,
    last,
    profile_pic,
    toggleUploader,
    deleteImg,
}) {
    return (
        <div>
            <h2>Profile Pic</h2>
            <h3>{first}</h3>
            <h3>{last}</h3>
            {profile_pic ? (
                <img
                    onClick={toggleUploader}
                    src={profile_pic}
                    alt={first + " " + last}
                />
            ) : (
                <img
                    onClick={toggleUploader}
                    className="logo"
                    src="logo.png"
                    alt="default"
                />
            )}
            <button onClick={deleteImg}>delete</button>
        </div>
    );
}
