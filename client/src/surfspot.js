import Weather from "./weather";
import FeedPost from "./feedpost";
import SurfSpotFeed from "./surfspotfeed";
import GiveRating from "./giverating";

export default function SurfSpot({
    selected,
    unselect,
    userId,
    userFirst,
    userLast,
    userRating,
    surfSpotRating,
}) {
    // calculate the average rating from all ratings in array
    console.log("UserRating", userRating);
    console.log("SurfSpotRating", surfSpotRating);
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
                        <GiveRating
                            selected={selected}
                            userId={userId}
                            userRating={userRating}
                        />
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
