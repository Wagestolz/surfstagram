export function reducer(state = {}, action) {
    if (action.type == "GET_USER") {
        state = {
            ...state,
            user: action.user,
        };
    }
    if (action.type == "GET_ALLUSERS") {
        state = {
            ...state,
            allUsers: action.allUsers,
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
    if (action.type == "GET_FOLLOWER") {
        state = {
            ...state,
            followers: action.followers,
        };
    }
    if (action.type == "STORE_LOCATION") {
        state = {
            ...state,
            location: action.location,
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
            surfSpotPosts: [action.surfSpotPost, ...state.surfSpotPosts],
        };
    }
    if (action.type == "SET_BIO") {
        state = {
            ...state,
            user: { ...state.user, ...action.bio },
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
        } else {
            state = {
                ...state,
                ratings: [...state.ratings, action.rating],
            };
        }
    }
    if (action.type == "FOLLOWER_ACTION") {
        if (action.follow.unfollow) {
            state = {
                ...state,
                followers: state.followers.filter((item) => {
                    return !(
                        item.user_id == action.follow.userId &&
                        item.surfspot_id == action.follow.surfSpotId
                    );
                }),
            };
        } else {
            state = {
                ...state,
                followers: [...state.followers, action.follow],
            };
        }
    }
    if (action.type == "DELETE_IMAGE") {
        const index = state.allUsers.findIndex(
            (user) => user.id === action.user.id
        );
        state = {
            ...state,
            allUsers: state.allUsers.map((each, idx) => {
                if (idx == index) {
                    return action.user;
                } else return each;
            }),
            user: action.user,
        };
    }
    if (action.type == "UPLOAD_IMAGE") {
        const index = state.allUsers.findIndex(
            (user) => user.id === action.user.id
        );
        state = {
            ...state,
            allUsers: state.allUsers.map((each, idx) => {
                if (idx == index) {
                    return action.user;
                } else return each;
            }),
            user: action.user,
        };
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

    return state;
}
