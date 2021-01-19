import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function WhosOnline() {
    const onliners = useSelector((state) => state && state.onliners);
    return (
        <>
            <h2 className="chat-heading">currently online</h2>
            <div className="online-container">
                {onliners &&
                    onliners.map((user, idx) => (
                        <div key={idx} className="online-user">
                            <img
                                className="profile-pic"
                                src={
                                    user.profile_pic
                                        ? user.profile_pic
                                        : "../logo3.gif"
                                }
                                alt={user.first + " " + user.last}
                            />
                            <Link to={"/user/" + user.id}>
                                <div className="online-info">
                                    <div className="online"></div>
                                    <h5>
                                        {user.first}
                                        {user.last}
                                    </h5>
                                </div>
                            </Link>
                        </div>
                    ))}
            </div>
        </>
    );
}
