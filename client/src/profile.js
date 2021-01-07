import ProfilePic from "./profilepic";
import BioEditer from "./bioediter";

// import React from "react";

export default function Profile({
    first,
    last,
    profile_pic,
    bio,
    toggleUploader,
}) {
    return (
        <div className="profile-container">
            <div className="profile-center">
                <ProfilePic
                    first={first}
                    last={last}
                    profile_pic={profile_pic}
                    toggleUploader={toggleUploader}
                />
                <div className="profile-info">
                    <h3>
                        {first} {last}
                    </h3>
                    <BioEditer bio={bio} />
                </div>
            </div>
        </div>
    );
}
