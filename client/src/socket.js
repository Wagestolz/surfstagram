import { io } from "socket.io-client";
import { postNewMessage, renderRecentMessages } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    socket.on("render new Message", (newMessage) => {
        // hand over to redux (dispatch a message)
        store.dispatch(postNewMessage(newMessage));
    });
    socket.on("10 last messages", (TenLastMessages) => {
        store.dispatch(renderRecentMessages(TenLastMessages.reverse()));
    });
};
