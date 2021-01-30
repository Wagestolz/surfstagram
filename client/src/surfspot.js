import Weather from "./weather";
import FeedPost from "./feedpost";
import SurfSpotFeed from "./surfspotfeed";
import GiveRating from "./giverating";
import DisplayRating from "./rating";
import Follow from "./follow";
import BarChart from "./barchart";

export default function SurfSpot({
    selected,
    unselect,
    userId,
    userFirst,
    userLast,
    userRating,
    surfSpotRatings,
    following,
    surfSpotFollowers,
    userPic,
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
    if (following.length == 1) {
        following = true;
    } else {
        following = false;
    }
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
                        <GiveRating
                            selected={selected}
                            userId={userId}
                            userRating={userRating}
                        />
                        <Follow
                            following={following}
                            surfSpotId={selected.id}
                        />
                        <h3
                            className="follower-number"
                            style={
                                following
                                    ? { color: "#e6007e" }
                                    : { color: "#1f3234" }
                            }
                        >
                            {surfSpotFollowers.length}
                        </h3>
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
                    </div>
                </div>
                <BarChart selected={selected}></BarChart>
                <Weather selected={selected}></Weather>
                <FeedPost
                    selected={selected}
                    userId={userId}
                    userFirst={userFirst}
                    userLast={userLast}
                    userPic={userPic}
                ></FeedPost>
                <SurfSpotFeed selected={selected}></SurfSpotFeed>
            </div>
        </div>
    );
}
