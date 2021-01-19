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
            e.target.value = "";
        }
    };
    if (!chatMessages) {
        return null;
    }
    return (
        <div className="chat-container">
            <div className="chat-center">
                {chatMessages.map((message, idx) => (
                    <div key={idx} className="message-container">
                        <img
                            className="profile-pic chat-pic"
                            src={
                                message.profile_pic
                                    ? message.profile_pic
                                    : "../logo3.gif"
                            }
                            alt={message.first + " " + message.last}
                        />
                        <div className="message-content">
                            <div className="message-header">
                                <div className="msg-sender">
                                    <Link to={"/user/" + message.id}>
                                        <h4>
                                            {message.first} {message.last}
                                        </h4>
                                    </Link>
                                </div>
                                <h4 className="timestamp">
                                    {message.created_at.substring(0, 10)}
                                </h4>
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
                className="chat-input"
                placeholder="enter your message..."
            ></textarea>
        </div>
    );
}
