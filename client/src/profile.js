import ProfilePic from "./profilepic";
import BioEditer from "./bioediter";
import { useState, useEffect } from "react";

export default function Profile({
    first,
    last,
    profile_pic,
    bio,
    toggleUploader,
    updateBio,
    deleteProfile,
}) {
    function handleClick() {
        deleteProfile();
    }
    return (
        <>
            <div className="profile-container">
                <div className="profile-center">
                    <ProfilePic
                        first={first}
                        last={last}
                        profile_pic={profile_pic}
                        toggleUploader={toggleUploader}
                        largerSize="bigger"
                    />
                    <div className="profile-info">
                        <h3>
                            {first} {last}
                        </h3>
                        {/* <div className="online-location">
                            <div className="online"></div>
                            <h6>
                                {location.city}, {location.country_name}
                            </h6>
                        </div> */}
                        <BioEditer bio={bio} updateBio={updateBio} />
                        <button className="btn" onClick={handleClick}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
