import { useMemo } from "react";

function ShakaIcon(props) {
    const { fill = "none" } = props;
    return (
        <svg
            id="Capa_1"
            enableBackground="new 0 0 25 25"
            height="25"
            viewBox="0 0 512 512"
            width="25"
            xmlns="http://www.w3.org/2000/svg"
            fill={fill}
            stroke="#1f3234"
            strokeWidth="30"
        >
            <path d="m427.347 0c-17.845 0-32.312 14.466-32.312 32.312v142.449c0-17.771-14.542-32.312-32.311-32.314-17.774 0-32.313 14.541-32.313 32.314h-.001l.001-12.499c-.002-17.77-14.544-32.312-32.313-32.314-17.772 0-32.313 14.542-32.313 32.314v-8.237c0-17.77-14.541-32.312-32.311-32.314-17.774 0-32.313 14.541-32.313 32.314l-.01 67.804-53.07-61.752c-24.39-28.38-67.071-31.863-95.739-7.813l44.324 55.343c23.817 29.738 40.988 64.11 51.474 100.738 9.798 34.226 30.67 63.898 58.443 84.847v118.808h188.454v-118.81c39.179-29.553 64.622-76.462 64.62-129.026l.003-231.851c-.001-17.846-14.467-32.313-32.313-32.313z" />
        </svg>
    );
}

function AvgRating(props) {
    const { index, rating } = props;
    const fill = useMemo(() => {
        if (rating >= index) {
            return "#e5cf61";
        } else {
            return "none";
        }
    }, [rating, index]);
    return (
        <div>
            <ShakaIcon fill={fill} />
        </div>
    );
}

export default function DisplayRating({ avgRating }) {
    return (
        <div className="avg-rating-container">
            {[1, 2, 3, 4, 5].map((index) => {
                return (
                    <AvgRating
                        key={index}
                        index={index}
                        rating={avgRating ? avgRating : 0}
                    />
                );
            })}
        </div>
    );
}
