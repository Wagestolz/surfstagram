import { useSelector } from "react-redux";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { socket } from "./socket";

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.chatMessages);
    const elemRef = useRef();
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            socket.emit("post Message", e.target.value);
        }
    };
    if (!chatMessages) {
        return null;
    }
    return (
        <div>
            <div className="chat-container">
                {chatMessages.map((message, idx) => (
                    <div key={idx} className="profile-container">
                        <div className="profile-center">
                            <img
                                className="profile-pic"
                                src={message.profile_pic}
                                alt={message.first + " " + message.last}
                            />
                            <div className="profile-info">
                                <Link
                                    className="nav-link"
                                    to={"/user/" + message.id}
                                >
                                    <h3>
                                        {message.first} {message.last}
                                    </h3>
                                </Link>
                            </div>
                            <p ref={elemRef} id="chat-message">
                                {message.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <textarea
                onKeyDown={handleKeyDown}
                name="message"
                id="message"
                cols="30"
                rows="10"
            ></textarea>
        </div>
    );
}
