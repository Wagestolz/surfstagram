import { useSelector } from "react-redux";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { socket } from "./socket";
import WhosOnline from "./onlineusers";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { storeSurfSpot } from "./actions";

export default function CreateSurfSpot({ created, cancel }) {
    const dispatch = useDispatch();
    const [surfSpotData, setsurfSpotData] = useState({
        lat: created.lat,
        lng: created.lng,
        creator: created.creator,
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
        formData.append("creator", surfSpotData.creator);
        if (surfSpotData.img && surfSpotData.name && surfSpotData.description) {
            dispatch(storeSurfSpot(formData));
            cancel();
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
