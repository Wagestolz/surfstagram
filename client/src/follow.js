import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { followerAction } from "./actions";

function SurfVanIcon({ styling }) {
    return (
        <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            enableBackground="new 0 0 512 512;"
            xmlSpace="preserve"
            width="54"
            height="54"
            className={styling}
        >
            <g>
                <g>
                    <path
                        d="M494.873,208.165c-2.535-22.822-21.762-40.031-44.725-40.031h-319.53c-27.463,0-52.692,14.977-65.842,39.086L20,289.309
			v68.825H0v30h73.58c6.192,17.458,22.865,30,42.42,30s36.228-12.542,42.42-30h195.16c6.192,17.458,22.865,30,42.42,30
			s36.228-12.542,42.42-30H512v-25.831L494.873,208.165z M116,388.134c-8.271,0-15-6.729-15-15s6.729-15,15-15s15,6.729,15,15
			S124.271,388.134,116,388.134z M171,248.133H76.632l14.481-26.548c7.89-14.465,23.027-23.452,39.505-23.452H171V248.133z
			M311,248.134H201v-50h110V248.134z M396,388.134c-8.271,0-15-6.729-15-15s6.729-15,15-15s15,6.729,15,15
			S404.271,388.134,396,388.134z M341,248.134v-50h109.148c7.655,0,14.064,5.736,14.909,13.343l4.073,36.657H341z"
                    />
                </g>
            </g>
            <g>
                <g>
                    <path
                        d="M430.999,122.435V93.866h-30v23.758c-117.928-16.845-238.642-9.845-354.251,21.016l7.738,28.985
			c144.512-38.576,297.281-38.576,441.793,0.001l7.738-28.985C479.877,132.197,455.513,126.799,430.999,122.435z"
                    />
                </g>
            </g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
        </svg>
    );
}

export default function Follow({ following, surfSpotId }) {
    const dispatch = useDispatch();
    const style = useMemo(() => {
        if (following) {
            return "surfvan-follow";
        } else {
            return "surfvan-unfollow";
        }
    }, [following]);
    const handleFollow = () => {
        console.log("clicked me");
        dispatch(
            followerAction({
                surfSpotId: surfSpotId,
                following: following,
            })
        );
    };
    return (
        <div className="surfvan" onClick={handleFollow}>
            <SurfVanIcon styling={style} />
        </div>
    );
}
