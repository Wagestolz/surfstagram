// import React from "react";

export default function ProfilePic({
    first,
    last,
    profile_pic,
    toggleUploader,
}) {
    return (
        <div>
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
        </div>
    );
}
