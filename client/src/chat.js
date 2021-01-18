import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { receiveMessages } from "./actions";
import { socket } from "./socket";

export default function Chat() {
    // 1. retrieve chat messages from Reduc and render them
    const chatMessages = useSelector((state) => state && state.chatMessages);
    // 2. post new messages
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            socket.emit("post Message", e.target.value);
        }
    };
    return (
        <>
            <h1>Chatroom</h1>
            <div className="chat-container">
                <p>dummy message...</p>
                <p>dummy message...</p>
                <p>dummy message...</p>
                <p>dummy message...</p>
                <p>dummy message...</p>
                <p>dummy message...</p>
                <p>dummy message...</p>
            </div>
            <textarea
                onKeyDown={handleKeyDown}
                name="message"
                id="message"
                cols="30"
                rows="10"
            ></textarea>
        </>
    );
}
