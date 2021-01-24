import axios from "./axios";

export async function getUserData() {
    const { data } = await axios.get("/user");
    return {
        type: "GET_USER",
        user: data[0],
    };
}
export async function getSurfSpots() {
    const { data } = await axios.get("/surfspots");
    console.log("surfspots: ", data);
    return {
        type: "GET_SURFSPOTS",
        surfSpots: data.surfSpots,
    };
}
export async function getSurfSpotPosts() {
    const { data } = await axios.get("/surfspotposts");
    console.log("surfspotposts: ", data);
    return {
        type: "GET_SURFSPOTPOSTS",
        surfSpotPosts: data.surfSpotPosts,
    };
}
export async function storeSurfSpot(formData) {
    const { data } = await axios.post("/createsurfspot", formData);
    console.log("data: ", data);
    return {
        type: "STORE_SURFSPOT",
        surfSpot: data,
    };
}
export async function storeSurfSpotPost(formData) {
    const { data } = await axios.post("/createsurfspotpost", formData);
    console.log("data: ", data);
    return {
        type: "STORE_SURFSPOTPOST",
        surfSpotPost: data,
    };
}

export async function receiveUsers() {
    const { data } = await axios.get("/getfriends");
    return {
        type: "RECEIVE_USERS",
        users: data.users,
    };
}

export async function unfriend(buttonText, friendStatus, otherUserId) {
    const { data } = await axios.post(`/friendaction`, {
        action: buttonText,
        friendStatus: friendStatus,
        friendId: Number(otherUserId),
    });
    return {
        type: "UNFRIEND",
        friendId: Number(otherUserId),
    };
}

export async function accept(buttonText, friendStatus, otherUserId) {
    const { data } = await axios.post(`/friendaction`, {
        action: buttonText,
        friendStatus: friendStatus,
        friendId: Number(otherUserId),
    });
    return {
        type: "ACCEPT",
        friendId: Number(otherUserId),
    };
}

export async function renderRecentMessages(TenLastMessages) {
    return {
        type: "LAST_TEN",
        messages: TenLastMessages,
    };
}
export async function postNewMessage(newMessage) {
    return {
        type: "POST_MESSAGE",
        message: newMessage,
    };
}

export async function getOnliners(usersArray) {
    return {
        type: "WHOS_ONLINE",
        onliners: usersArray,
    };
}
// export async function renderRequests(requester) {
//     console.log("friend request from", requester.fromUser);
//     return {
//         type: "FRIEND_REQUEST",
//         fromUser: requester.fromUser,
//     };
// }
