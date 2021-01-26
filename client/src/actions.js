import axios from "./axios";

export async function getUserData() {
    const { data } = await axios.get("/user");
    return {
        type: "GET_USER",
        user: data[0],
    };
}
export async function getUsers() {
    const { data } = await axios.get("/allusers");
    return {
        type: "GET_ALLUSERS",
        allUsers: data,
    };
}
export async function StoreLocation(location) {
    return {
        type: "STORE_LOCATION",
        location: location,
    };
}
export async function getSurfSpots() {
    const { data } = await axios.get("/surfspots");
    console.log("get surfspots: ", data);
    return {
        type: "GET_SURFSPOTS",
        surfSpots: data.surfSpots,
    };
}
export async function getSurfSpotPosts() {
    const { data } = await axios.get("/surfspotposts");
    console.log("get surfspotposts: ", data);
    return {
        type: "GET_SURFSPOTPOSTS",
        surfSpotPosts: data.surfSpotPosts,
    };
}
export async function getRatings() {
    const { data } = await axios.get("/ratings");
    console.log("get ratings: ", data);
    return {
        type: "GET_RATINGS",
        ratings: data.ratings,
    };
}
export async function getFollower() {
    const { data } = await axios.get("/follower");
    console.log("get follower: ", data);
    return {
        type: "GET_FOLLOWER",
        followers: data.followers,
    };
}
export async function storeSurfSpot(formData) {
    const { data } = await axios.post("/createsurfspot", formData);
    console.log("stored surfspot: ", data);
    return {
        type: "STORE_SURFSPOT",
        surfSpot: data,
    };
}
export async function storeSurfSpotPost(formData) {
    await axios.post("/createsurfspotpost", formData);
    const { data } = await axios.get("/surfspotposts");
    return {
        type: "GET_SURFSPOTPOSTS",
        surfSpotPosts: data.surfSpotPosts,
    };
}

export async function storeRating({ surfSpotId, userId, rating }) {
    console.log(surfSpotId, userId, rating);
    const { data } = await axios.post("/createrating", {
        surfSpotId: surfSpotId,
        userId: userId,
        rating: rating,
    });
    console.log("stored Rating: ", data);
    return {
        type: "STORE_RATING",
        rating: data,
    };
}

export async function followerAction({ surfSpotId, following }) {
    console.log("following: ", following);
    const { data } = await axios.post("/followeraction", {
        surfSpotId: surfSpotId,
        following: following,
    });
    console.log("followerAction: ", data);
    return {
        type: "FOLLOWER_ACTION",
        follow: data,
    };
}

export async function deleteImage(profile_pic) {
    const { data } = await axios.post("/deleteimg", {
        params: {
            url: profile_pic,
        },
    });
    return {
        type: "DELETE_IMAGE",
        user: data,
    };
}
export async function uploadImage(formData) {
    const { data } = await axios.post("/imageupload", formData);
    return {
        type: "UPLOAD_IMAGE",
        user: data,
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
