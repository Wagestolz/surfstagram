import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteImage, uploadImage, getUserData } from "./actions";
const allowed = ["image/png", "image/jpeg", "image/jpg"];

export default function Uploader({ toggleUploader, profile_pic }) {
    const dispatch = useDispatch();
    const [image, SetImage] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    // const handleFileChange = (e) => {
    //     SetImage(e.target.files[0]);
    // };
    const handleFileChange = (e) => {
        const selectedImg = e.target.files[0];
        if (allowed.includes(e.target.files[0].type)) {
            let reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result);
            };
            reader.readAsDataURL(selectedImg);
            SetImage(e.target.files[0]);
        }
    };
    const deleteImg = () => {
        dispatch(deleteImage(profile_pic));
    };
    const handleDelete = () => {
        if (profile_pic) {
            deleteImg();
        }
        toggleUploader();
    };
    const handleClick = (e) => {
        e.preventDefault();
        if (profile_pic && image) {
            deleteImg();
        }
        var formData = new FormData();
        formData.append("image", image);
        if (image) {
            dispatch(uploadImage(formData));
            SetImage(null);
            toggleUploader();
            dispatch(getUserData());
        }
    };
    return (
        <div className="modal">
            <div className="modal-container">
                <h2 onClick={toggleUploader} className="close-btn">
                    <i className="fas fa-times"></i>
                </h2>
                <div className="uploader-pic-container">
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
                        {image ? ` ${image.name}` : " Choose Img (max 2mb)"}
                    </label>
                    {imgPreview ? (
                        <div className="feed-pic-container">
                            <img
                                src={imgPreview}
                                className="modal-pic-preview"
                                alt="image preview"
                            />
                        </div>
                    ) : (
                        <div className="feed-pic-container">
                            {profile_pic ? (
                                <img
                                    src={profile_pic}
                                    className="modal-pic-preview"
                                    alt="image preview"
                                />
                            ) : (
                                <img
                                    src="../logo3.gif"
                                    className="modal-pic-preview"
                                    alt="image preview"
                                />
                            )}
                        </div>
                    )}
                </div>
                <div>
                    <button className="btn modalBtn" onClick={handleClick}>
                        upload
                    </button>
                    <button className="btn modalBtn" onClick={handleDelete}>
                        delete
                    </button>
                </div>
            </div>
        </div>
    );
}
