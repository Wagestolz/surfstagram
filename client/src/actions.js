import axios from "./axios";

export async function receiveUsers() {
    const { data } = await axios.get("/getfriends");
    return {
        type: "RECEIVE_USERS",
        users: data.users,
    };
}

export async function unfriend(buttonText, friendStatus, otherUserId) {
    console.log(
        "buttonText, friendStatus, otherUserId: ",
        buttonText,
        friendStatus,
        otherUserId
    );
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
    console.log(
        "buttonText, friendStatus, otherUserId: ",
        buttonText,
        friendStatus,
        otherUserId
    );
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
