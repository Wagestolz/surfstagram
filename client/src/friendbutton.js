import { useState, useEffect } from "react";
// import React from "react";
import axios from "./axios";

export default function FriendButton(friend) {
    const { otherUserId } = friend;
    const [buttonText, setButtonText] = useState("");
    useEffect(() => {
        axios
            .get("/friendstatus", { params: { friendId: Number(otherUserId) } })
            .then(({ data }) => {
                const text = friendStatusToButtonText(data);
                setButtonText(text);
            });
    }, [otherUserId]);

    const handleClick = () => {
        console.log("handleClick fired");
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
