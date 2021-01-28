import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { followerAction } from "./actions";
import WeatherWidget from "./weatherwidget";

export default function Beachfeed() {
    const user = useSelector((state) => state.user);
    const following = useSelector(
        (state) =>
            state.followers &&
            state.followers.filter((x) => x.user_id == user.id)
    );
    const myBeaches = useSelector(
        (state) =>
            state.surfSpots &&
            following &&
            state.surfSpots.filter((x) =>
                following.find((y) => x.id == y.surfspot_id)
            )
    );
    const posts = useSelector(
        (state) =>
            state.surfSpotPosts &&
            following &&
            state.surfSpotPosts.filter(
                (post) =>
                    post.user_id == user.id ||
                    following.find((y) => {
                        return post.surfspot_id == y.surfspot_id;
                    })
            )
    );
    const dispatch = useDispatch();
    const handleFollow = (surfSpotId) => {
        dispatch(
            followerAction({
                surfSpotId: surfSpotId,
                following: following.find((y) => {
                    return y.surfspot_id == surfSpotId;
                }),
            })
        );
    };
    if (!myBeaches) {
        return null;
    }
    return (
        <>
            <div className="beachfeed-container">
                <div className="beachfeed-center">
                    <div className="widget-container">
                        <div className="following">
                            <h2 className="following-heading">Following</h2>
                            {myBeaches && myBeaches.length == 0 && (
                                <p className="following-heading">
                                    not following anything 🤙
                                </p>
                            )}
                            {myBeaches &&
                                myBeaches.map((beach) => (
                                    <div
                                        key={beach.id}
                                        className="beach-container"
                                    >
                                        <img
                                            className="beach-pic"
                                            src={beach.img}
                                        />
                                        <div className="beach-info">
                                            <h3>{beach.name}</h3>
                                            <button
                                                className="unfollow-btn"
                                                onClick={() =>
                                                    handleFollow(beach.id)
                                                }
                                            >
                                                unfollow
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="weather-widget-container">
                            <h2 className="following-heading">Forecast</h2>
                            {/* <WeatherWidget myBeaches={myBeaches} /> */}
                        </div>
                    </div>
                    <div className="following-feed">
                        {posts && posts.length == 0 && (
                            <p className="following-heading">
                                not following anything 🤙
                            </p>
                        )}
                        {posts &&
                            posts.map((post) => (
                                <div key={post.id}>
                                    <div className="feedcomment-container">
                                        {post.profile_pic ? (
                                            <img
                                                src={post.profile_pic}
                                                className="post-thumb"
                                                alt="logo"
                                            />
                                        ) : (
                                            <img
                                                src="../logo3.gif"
                                                className="post-thumb"
                                                alt="logo"
                                            />
                                        )}
                                        <div className="post-user-info">
                                            <p className="created_timestamp">
                                                {post.created_at.slice(0, 10)}
                                            </p>
                                            <h2>
                                                {post.user_first}{" "}
                                                {post.user_last}
                                            </h2>
                                            <p>{post.text}</p>
                                        </div>
                                    </div>
                                    <div className="feed-pic-container">
                                        <img
                                            src={post.img}
                                            className="feed-pic"
                                            alt="logo"
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}
