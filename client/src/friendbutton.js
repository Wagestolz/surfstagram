import { useState, useEffect } from "react";
import { socket } from "./socket";
import axios from "./axios";
// import { useSelector } from "react-redux";

export default function FriendButton(friend) {
    // const friendRequests = useSelector((state) => state && state.requests);
    const { otherUserId } = friend;
    const [buttonText, setButtonText] = useState("");
    const [friendStatus, setFriendStatus] = useState("");
    useEffect(() => {
        axios
            .get("/friendstatus", { params: { friendId: Number(otherUserId) } })
            .then(({ data }) => {
                const text = friendStatusToButtonText(data);
                setButtonText(text);
                setFriendStatus(data);
            });
    }, [otherUserId]);

    const handleClick = () => {
        if (buttonText == "make request") {
            socket.emit("friend request", Number(otherUserId));
        }
        axios
            .post("/friendaction", {
                action: buttonText,
                friendStatus: friendStatus, // actually irrelevant
                friendId: Number(otherUserId),
            })
            .then(({ data }) => {
                const text = friendStatusToButtonText(data);
                setButtonText(text);
                setFriendStatus(data);
            });
    };
    if (buttonText) {
        return (
            <>
                <button className="btn" onClick={handleClick}>
                    {buttonText}
                </button>
            </>
        );
    } else {
        return null;
    }
}

function friendStatusToButtonText(friendStatus) {
    // default Case: no friendship
    let buttonText = "make request";
    if (!friendStatus.rows.length == 0) {
        const { sender_id, accepted } = friendStatus.rows[0];
        const { userId } = friendStatus;
        // Case2: friendship
        if (accepted) {
            buttonText = "unfriend";
        }
        // Case3: pending request sent
        else if (sender_id == userId) {
            buttonText = "cancel request";
        }
        // Case4: pending request received
        else {
            buttonText = "accept";
        }
    }
    return buttonText;
}
