import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Chat from "./chat";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { socket } from "./socket";
// new
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, getSurfSpots } from "./actions";
import MainPage from "./mainpage";

export default function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserData());
    }, []);
    const user = useSelector((state) => state && state.user);
    if (!user) {
        return null;
    }
    return (
        <BrowserRouter>
            <>
                {/* navbar */}
                <nav className="navbar">
                    <div className="nav-center">
                        {/* <button className="toggle-nav" onClick={this.toggleSidebar}>
                        <i className="fas fa-bars"></i>
                    </button> */}
                        {/* logo */}
                        <img
                            src="/surfspot2.png"
                            className="nav-logo"
                            alt="logo"
                        />
                        <div className="links-container">
                            {/* links */}
                            <ul className="nav-links">
                                <li>
                                    <Link className="nav-link" to="/users">
                                        Connect
                                    </Link>
                                </li>
                                {/* <li className="releative">
                                <Link className="nav-link" to="/friends">
                                    MyBuddies
                                </Link>
                            </li>
                            <li>
                                <Link className="nav-link" to="/">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link className="nav-link" to="/chat">
                                    Chat
                                </Link>
                            </li> */}
                            </ul>
                        </div>
                        {/* Profile Pic */}
                        <div className="pic-container">
                            <img
                                className="profile-pic"
                                // src="../logo3.gif"
                                src={user.profile_pic}
                                alt="default"
                            />
                            {/* <button className="btn logoutBtn" onClick={this.logout}>
                            logout
                        </button> */}
                        </div>
                    </div>
                </nav>
                <Route exact path="/" render={() => <MainPage />} />
            </>
        </BrowserRouter>
    );
}
