export function reducer(state = {}, action) {
    if (action.type == "GET_USER") {
        state = {
            ...state,
            user: action.user,
        };
    }
    if (action.type == "GET_SURFSPOTS") {
        state = {
            ...state,
            surfSpots: action.surfSpots,
        };
    }
    if (action.type == "GET_SURFSPOTPOSTS") {
        state = {
            ...state,
            surfSpotPosts: action.surfSpotPosts,
        };
    }
    if (action.type == "GET_RATINGS") {
        state = {
            ...state,
            ratings: action.ratings,
        };
    }
    if (action.type == "STORE_SURFSPOT") {
        state = {
            ...state,
            surfSpots: [...state.surfSpots, action.surfSpot],
        };
    }
    if (action.type == "STORE_SURFSPOTPOST") {
        state = {
            ...state,
            surfSpotPosts: [...state.surfSpotPosts, action.surfSpotPost],
        };
    }
    if (action.type == "STORE_RATING") {
        const index = state.ratings.findIndex(
            (rating) =>
                rating.user_id === action.rating.user_id &&
                rating.surfspot_id == action.rating.surfspot_id
        );
        if (index > -1) {
            state = {
                ...state,
                ratings: state.ratings.map((each, idx) => {
                    if (idx == index) {
                        return action.rating;
                    } else return each;
                }),
            };
        }

        // (state.ratings[index].rating = action.rating.rating),
        // (state.ratings[index].rating = action.rating.rating),
        else {
            state = {
                ...state,
                ratings: [...state.ratings, action.rating],
            };
        }
    }

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
    // if (action.type == "FRIEND_REQUESTS") {
    //     state = {
    //         ...state,
    //         requests: action.requests,
    //     };
    // }

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
