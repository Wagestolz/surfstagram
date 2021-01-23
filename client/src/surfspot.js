import { useSelector } from "react-redux";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { socket } from "./socket";
import WhosOnline from "./onlineusers";

export default function SurfSpot({ selected, unselect }) {
    return (
        <div className="surfspot-modal">
            <div className="surfspot-container">
                <h2 className="close-btn" onClick={unselect}>
                    <i className="fas fa-times"></i>
                </h2>
                <h2>{selected.name}</h2>
                <img src={selected.img} className="surfspot-pic" alt="logo" />
                <p>{selected.description}</p>
            </div>
        </div>
    );
}
