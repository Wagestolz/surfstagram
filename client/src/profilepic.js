// import React from "react";

export default function ProfilePic({
    first,
    last,
    profile_pic,
    toggleUploader,
    largerSize,
}) {
    // if (profile_pic) {
    return (
        <div>
            {profile_pic ? (
                <img
                    className={`profile-pic ${largerSize}`}
                    onClick={toggleUploader}
                    src={profile_pic}
                    alt={first + " " + last}
                />
            ) : (
                <img
                    onClick={toggleUploader}
                    className={`profile-pic ${largerSize}`}
                    src="logo3.gif"
                    alt="default"
                />
            )}
        </div>
    );
    // } else {
    //     return null;
    // }
}
