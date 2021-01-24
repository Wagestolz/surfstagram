import { useSelector } from "react-redux";

export default function SurfSpotFeed({ selected }) {
    const posts = useSelector(
        (state) =>
            state &&
            state.surfSpotPosts.filter(
                (post) => post.surfspot_id == selected.id
            )
    );
    console.log("posts: ", posts);

    return (
        <div className="post-container">
            <div className="post-center">
                {posts &&
                    posts.map((post) => (
                        <div key={post.id}>
                            <div className="comment-container">
                                <img
                                    src="/logo3.gif"
                                    className="post-thumb"
                                    alt="logo"
                                />
                                <p className="">{post.text}</p>
                            </div>
                            <img
                                src={post.img}
                                className="post-thumb"
                                alt="logo"
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
}
