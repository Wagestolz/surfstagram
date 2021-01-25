import Weather from "./weather";
import FeedPost from "./feedpost";
import SurfSpotFeed from "./surfspotfeed";
import GiveRating from "./giverating";
import DisplayRating from "./rating";
import Follow from "./follow";

export default function SurfSpot({
    selected,
    unselect,
    userId,
    userFirst,
    userLast,
    userRating,
    surfSpotRatings,
}) {
    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return (Math.round(value * multiplier) / multiplier).toFixed(1);
    }
    const avgRatingDisplay = round(
        surfSpotRatings.reduce((a, b) => a + b.rating, 0) /
            surfSpotRatings.length,
        1
    );
    const avgRating = Math.round(
        surfSpotRatings.reduce((a, b) => a + b.rating, 0) /
            surfSpotRatings.length
    );
    let following = false;
    return (
        <div className="surfspot-modal">
            <div className="surfspot-container">
                <h2 className="close-btn" onClick={unselect}>
                    <i className="fas fa-times"></i>
                </h2>
                <div className="surfspot-header">
                    <div className="img-relative">
                        <img
                            src={selected.img}
                            className="surfspot-pic"
                            alt="logo"
                        />
                        <Follow
                            following={following}
                            // onClick={handleFollow}
                        />
                    </div>
                    <div className="surfspot-info-container">
                        <div className="rating-header">
                            <h2>{selected.name}</h2>
                            <DisplayRating avgRating={avgRating} />
                            <h3 className="rating-number">
                                {surfSpotRatings.length > 0
                                    ? avgRatingDisplay
                                    : "na"}
                            </h3>
                        </div>
                        <p>{selected.description}</p>
                        <div>
                            <div>
                                <button
                                    className="btn create-btn"
                                    // onClick={handleRating}
                                >
                                    Rate
                                </button>
                                <GiveRating
                                    selected={selected}
                                    userId={userId}
                                    userRating={userRating}
                                />
                            </div>
                        </div>
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
