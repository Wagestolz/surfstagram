import axios from "./axios";

import Uploader from "./uploader";
import Profile from "./profile";
import Beachfeed from "./beachfeed";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Chat from "./chat";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { socket } from "./socket";
// new
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getUserData,
    getUsers,
    getSurfSpots,
    getSurfSpotPosts,
    getRatings,
    getFollower,
} from "./actions";
import MainPage from "./mainpage";
import ProfilePic from "./profilepic";

export default function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserData());
        dispatch(getUsers());
        dispatch(getSurfSpots());
        dispatch(getSurfSpotPosts());
        dispatch(getRatings());
        dispatch(getFollower());
    }, []);
    const user = useSelector((state) => state && state.user);
    const [uploaderModal, SetUploaderModal] = useState(false);
    const toggleUploader = () => {
        SetUploaderModal(!uploaderModal);
    };
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
                                    <Link className="nav-link" to="/">
                                        Map
                                    </Link>
                                </li>
                                <li>
                                    <Link className="nav-link" to="/beachfeed">
                                        Beachfeed
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link className="nav-link" to="/users">
                                        Connect
                                    </Link>
                                </li> */}
                                <li className="releative">
                                    <Link className="nav-link" to="/profile">
                                        Profile
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link className="nav-link" to="/chat">
                                        Chat
                                    </Link>
                                </li> */}
                            </ul>
                        </div>
                        {/* Profile Pic */}
                        <div className="pic-container">
                            <ProfilePic
                                first={user.first}
                                last={user.last}
                                profile_pic={user.profile_pic}
                                toggleUploader={toggleUploader}
                            />
                            {/* <button className="btn logoutBtn" onClick={this.logout}>
                            logout
                        </button> */}
                        </div>
                    </div>
                </nav>
                {uploaderModal && (
                    <Uploader
                        profile_pic={user.profile_pic}
                        toggleUploader={toggleUploader}
                    />
                )}
                <Route exact path="/" render={() => <MainPage />} />
                <Route exact path="/beachfeed" render={() => <Beachfeed />} />
                <Route
                    exact
                    path="/profile"
                    render={() => (
                        <Profile
                            first={user.first}
                            last={user.last}
                            profile_pic={user.profile_pic}
                            bio={user.bio}
                            toggleUploader={toggleUploader}
                            // updateBio={this.updateBio}
                            // deleteProfile={this.deleteProfile}
                        />
                    )}
                />
            </>
        </BrowserRouter>
    );
}
