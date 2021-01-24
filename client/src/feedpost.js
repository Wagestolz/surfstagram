import { useState } from "react";
import { useDispatch } from "react-redux";
import { storeSurfSpotPost } from "./actions";
const allowed = ["image/png", "image/jpeg", "image/jpg"];

export default function FeedPost({ selected, userId }) {
    const dispatch = useDispatch();
    const [surfSpotPost, setsurfSpotPost] = useState({
        surfSpotId: selected.id,
        userId: userId,
    });
    const [imgPreview, setImgPreview] = useState(null);

    const handleClick = (e) => {
        e.preventDefault();
        var formData = new FormData();
        formData.append("surfSpotId", selected.id);
        formData.append("text", surfSpotPost.text);
        formData.append("img", surfSpotPost.img);
        formData.append("userId", surfSpotPost.userId);
        if (surfSpotPost.img || surfSpotPost.name) {
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
                    <img src="/logo3.gif" className="post-thumb" alt="logo" />
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
                        {imgPreview && (
                            <img
                                src={imgPreview}
                                className="post-img-preview"
                                alt="image preview"
                            />
                        )}
                    </div>
                    <button className="post-btn" onClick={handleClick}>
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}
