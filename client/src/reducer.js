export function reducer(state = {}, action) {
    if (action.type == "RECEIVE_USERS") {
        state = {
            ...state,
            users: action.users,
        };
    }
    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            users: state.users.filter((user) => {
                return user.id != action.friendId;
            }),
        };
    }
    if (action.type == "ACCEPT") {
        state = {
            ...state,
            users: state.users.filter((user) => {
                if (user.id == action.friendId) {
                    user.accepted = true;
                }
                return user;
            }),
        };
    }
    if (action.type == "LAST_TEN") {
        state = {
            ...state,
            chatMessages: action.messages,
        };
    }
    if (action.type == "POST_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.message],
        };
    }
    if (action.type == "WHOS_ONLINE") {
        state = {
            ...state,
            onliners: action.onliners,
        };
    }

    return state;
}

// const obj = {
//     first: "Thorsten",
// };
// const newObj = {
//     ...obj,
//     last: "Ständer",
// };

// const arr = [1, 2, 3];
// const newArr = [...arr];
