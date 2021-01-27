import { useSelector } from "react-redux";

export default function SurfSpotFeed({ selected }) {
    const posts = useSelector(
        (state) =>
            state.surfSpotPosts &&
            state.surfSpotPosts.filter(
                (post) => post.surfspot_id == selected.id
            )
    );
    return (
        <div className="feedpost-container">
            <div className="feedpost-center">
                {posts &&
                    posts.map((post) => (
                        <div key={post.id}>
                            <div className="feedcomment-container">
                                <img
                                    src={post.profile_pic}
                                    className="post-thumb"
                                    alt="logo"
                                />
                                <div className="post-user-info">
                                    <p className="created_timestamp">
                                        {post.created_at.slice(0, 10)}
                                    </p>
                                    <h2>
                                        {post.user_first} {post.user_last}
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
    );
}
