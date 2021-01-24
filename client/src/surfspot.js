import Weather from "./weather";
import FeedPost from "./feedpost";
import SurfSpotFeed from "./surfspotfeed";

export default function SurfSpot({
    selected,
    unselect,
    userId,
    userFirst,
    userLast,
}) {
    return (
        <div className="surfspot-modal">
            <div className="surfspot-container">
                <h2 className="close-btn" onClick={unselect}>
                    <i className="fas fa-times"></i>
                </h2>
                <div className="surfspot-header">
                    <img
                        src={selected.img}
                        className="surfspot-pic"
                        alt="logo"
                    />
                    <div className="surfspot-info-container">
                        <h2>{selected.name}</h2>
                        <p>{selected.description}</p>
                    </div>
                </div>
                <Weather selected={selected}></Weather>
                <FeedPost
                    selected={selected}
                    userId={userId}
                    userFirst={userFirst}
                    userLast={userLast}
                ></FeedPost>
                <SurfSpotFeed selected={selected}></SurfSpotFeed>
            </div>
        </div>
    );
}
