// import { io } from "socket.io-client";
// import {
//     postNewMessage,
//     renderRecentMessages,
//     getOnliners,
//     // renderRequests,
// } from "./actions";

// export let socket;

// export const init = (store) => {
//     if (!socket) {
//         socket = io.connect();
//     }
//     socket.on("who is online", (usersArray) => {
//         // hand over to redux (dispatch a message)
//         store.dispatch(getOnliners(usersArray));
//     });
//     socket.on("render new Message", (newMessage) => {
//         // hand over to redux (dispatch a message)
//         store.dispatch(postNewMessage(newMessage));
//     });
//     socket.on("10 last messages", (TenLastMessages) => {
//         store.dispatch(renderRecentMessages(TenLastMessages.reverse()));
//     });
//     socket.on("friend request", (requester) => {
//         alert(
//             `You have a new friend request from the user-id: ${requester.fromUser}`
//         );
//         // store.dispatch(renderRequests(requester));
//     });
// };
