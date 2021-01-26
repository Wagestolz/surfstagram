export default function ProfilePic({
    first,
    last,
    profile_pic,
    toggleUploader,
    largerSize,
    noModal,
}) {
    return (
        <div>
            {profile_pic ? (
                <img
                    className={`profile-pic ${largerSize} ${noModal}`}
                    onClick={toggleUploader}
                    src={profile_pic}
                    alt={first + " " + last}
                />
            ) : (
                <img
                    onClick={toggleUploader}
                    className={`profile-pic ${largerSize} ${noModal}`}
                    src="../logo3.gif"
                    alt="default"
                />
            )}
        </div>
    );
}
