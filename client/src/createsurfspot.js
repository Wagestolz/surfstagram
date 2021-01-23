import { useSelector } from "react-redux";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { socket } from "./socket";
import WhosOnline from "./onlineusers";

import { useState } from "react";
import axios from "./axios";

export default function CreateSurfSpot({ created, cancel }) {
    // const chatMessages = useSelector((state) => state && state.chatMessages);
    // const elemRef = useRef();
    // const handleKeyDown = (e) => {
    //     if (e.key === "Enter") {
    //         socket.emit("post Message", e.target.value);
    //         e.target.value = "";
    //     }
    // };
    // if (!chatMessages) {
    //     return null;
    // }
    const [surfSpotData, setsurfSpotData] = useState({
        lat: created.lat,
        lng: created.lng,
    });
    const handleChange = (e) => {
        setsurfSpotData({
            ...surfSpotData,
            [e.target.name]: e.target.value,
        });
    };
    const handleFileChange = (e) => {
        setsurfSpotData({
            ...surfSpotData,
            img: e.target.files[0],
        });
    };
    const handleClick = (e) => {
        e.preventDefault();
        var formData = new FormData();
        formData.append("name", surfSpotData.name);
        formData.append("description", surfSpotData.description);
        formData.append("img", surfSpotData.img);
        formData.append("lat", surfSpotData.lat);
        formData.append("lng", surfSpotData.lng);
        if (this.state.image) {
            axios
                .post("/createsurfspot", formData)
                .then((res) => {
                    // this.props.setImage(res.data.profile_pic);
                    // this.props.toggleUploader();
                })
                .catch((err) => {
                    console.log("error from POST /createsurfspot", err);
                });
        }
    };

    return (
        <div className="create-modal">
            <div className="create-container">
                <h2 className="close-btn" onClick={cancel}>
                    <i className="fas fa-times"></i>
                </h2>
                <h2>create a new Surfspot</h2>
                <div className="create-form">
                    <div className="create-image-upload">
                        <input
                            type="file"
                            name="image"
                            id="image"
                            accept="image/*"
                            className="inputfile"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="image" id="upload">
                            <i className="fas fa-upload"> </i>
                            {!surfSpotData.img
                                ? " Choose Img (max 2mb)"
                                : ` ${surfSpotData.img.name}`}
                        </label>
                    </div>
                    <input
                        className="create-field"
                        type="text"
                        placeholder="Name your Surfspot"
                        name="name"
                        onChange={handleChange}
                    />
                    <textarea
                        className="create-textarea"
                        placeholder="Description"
                        name="description"
                        onChange={handleChange}
                        rows="8"
                        cols="50"
                    ></textarea>
                    <button className="btn" onClick={handleClick}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
