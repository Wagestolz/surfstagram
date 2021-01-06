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
            {/* <h3>{first}</h3>
            <h3>{last}</h3> */}
            {profile_pic ? (
                <img
                    className="profile-pic"
                    onClick={toggleUploader}
                    src={profile_pic}
                    alt={first + " " + last}
                />
            ) : (
                <img
                    onClick={toggleUploader}
                    className="profile-pic"
                    src="logo6.gif"
                    alt="default"
                />
            )}
            {/* <button onClick={deleteImg}>delete</button> */}
        </div>
    );
}
