import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteImage, uploadImage, getUserData } from "./actions";

export default function Uploader({ toggleUploader, profile_pic }) {
    const dispatch = useDispatch();
    const [image, SetImage] = useState(null);
    const handleFileChange = (e) => {
        SetImage(e.target.files[0]);
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
                <div>
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
                        {image ? image.name : " Choose Img (max 2mb)"}
                    </label>
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
