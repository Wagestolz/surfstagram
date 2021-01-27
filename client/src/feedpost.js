import { useState } from "react";
import { useDispatch } from "react-redux";
import { storeSurfSpotPost } from "./actions";
const allowed = ["image/png", "image/jpeg", "image/jpg"];

export default function FeedPost({
    selected,
    userId,
    userFirst,
    userLast,
    userPic,
}) {
    const dispatch = useDispatch();
    const [surfSpotPost, setsurfSpotPost] = useState({
        surfSpotId: selected.id,
        userId: userId,
        userFirst: userFirst,
        userLast: userLast,
    });
    const [imgPreview, setImgPreview] = useState(null);

    const handleClick = (e) => {
        e.preventDefault();
        var formData = new FormData();
        formData.append("surfSpotId", selected.id);
        formData.append("surfSpotName", selected.name);
        formData.append("text", surfSpotPost.text);
        formData.append("img", surfSpotPost.img);
        formData.append("userId", surfSpotPost.userId);
        formData.append("userFirst", surfSpotPost.userFirst);
        formData.append("userLast", surfSpotPost.userLast);
        if (surfSpotPost.img && surfSpotPost.text) {
            dispatch(storeSurfSpotPost(formData));
            setImgPreview(null);
        }
    };
    const handleChange = (e) => {
        setsurfSpotPost({
            ...surfSpotPost,
            text: e.target.value,
        });
    };
    const handleFileChange = (e) => {
        const selectedImg = e.target.files[0];
        if (allowed.includes(e.target.files[0].type)) {
            let reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result);
            };
            reader.readAsDataURL(selectedImg);
            setsurfSpotPost({
                ...surfSpotPost,
                img: e.target.files[0],
            });
        }
    };
    return (
        <div className="post-container">
            <div className="post-center">
                <div className="comment-container">
                    {userPic ? (
                        <img src={userPic} className="post-thumb" alt="logo" />
                    ) : (
                        <img
                            src="../logo3.gif"
                            className="post-thumb"
                            alt="logo"
                        />
                    )}
                    <textarea
                        id="text"
                        onChange={handleChange}
                        className="post-text"
                        placeholder="Been here? Tell us about it..."
                    ></textarea>
                </div>
                <div className="btn-container">
                    <div className="post-image-upload">
                        <input
                            type="file"
                            name="image"
                            id="image"
                            accept="image/*"
                            className="inputfile"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="image" id="upload">
                            <i className="fas fa-camera-retro"> </i>
                            {!surfSpotPost.img
                                ? " add Pic (2mb)"
                                : ` ${surfSpotPost.img.name}`}
                        </label>
                    </div>
                    <button className="post-btn" onClick={handleClick}>
                        Post
                    </button>
                </div>
                {imgPreview && (
                    <div className="feed-pic-container">
                        <img
                            src={imgPreview}
                            className="feed-pic"
                            alt="image preview"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
