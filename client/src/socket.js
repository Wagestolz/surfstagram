import { io } from "socket.io-client";
import { postNewMessage, renderRecentMessages } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    socket.on("render new Message", (newMessage) => {
        console.log("newMessage: ", newMessage);
        // hand over to redux (dispatch a message)
        store.dispatch(postNewMessage(newMessage));
    });
    socket.on("10 last messages", (TenLastMessages) => {
        console.log("The 10 most recent messages were: ", TenLastMessages);
        // hand over to redux (dispatch a message)
        store.dispatch(renderRecentMessages(TenLastMessages));
    });
};
