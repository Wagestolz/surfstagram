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
        <>
            <h1>Online users</h1>
        </>
    );
}
