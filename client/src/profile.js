import ProfilePic from "./profilepic";
import BioEditer from "./bioediter";

export default function Profile({
    first,
    last,
    profile_pic,
    bio,
    toggleUploader,
    updateBio,
}) {
    if (!first) {
        return null;
    }
    return (
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
                    <BioEditer bio={bio} updateBio={updateBio} />
                </div>
            </div>
        </div>
    );
}
