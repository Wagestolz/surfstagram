import axios from "./axios";
import Uploader from "./uploader";
import Profile from "./profile";
import Beachfeed from "./beachfeed";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
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
    setBio,
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
        dispatch(setBio());
    }, []);
    const user = useSelector((state) => state && state.user);
    const [uploaderModal, SetUploaderModal] = useState(false);
    const toggleUploader = () => {
        SetUploaderModal(!uploaderModal);
    };
    const [sidebar, setSidebar] = useState(false);
    const toggleSidebar = () => {
        setSidebar(!sidebar);
    };
    const logout = () => {
        axios.get("/logout").then(() => location.replace("/welcome"));
    };
    const updateBio = (bioDraft) => {
        axios
            .post("/updateBio", {
                bioDraft: bioDraft,
            })
            .then(({ data }) => {
                dispatch(
                    setBio({
                        bio: data[0].bio,
                    })
                );
            })
            .catch((err) => {
                console.log("error at POST /updateBio", err);
            });
    };
    // const deleteProfile = () => {
    //     let self = this;
    //     console.log("delete profile fired!");
    //     this.deleteImg();
    //     axios
    //         .post("/deleteprofile")
    //         .then((res) => {
    //             console.log("deletion resolved: ", res);
    //             self.logout();
    //         })
    //         .catch((err) => {
    //             console.log("error at POST /deleteprofile", err);
    //         });
    // };
    if (!user) {
        return null;
    }
    return (
        <BrowserRouter>
            <>
                {/* navbar */}
                <nav className="navbar">
                    <div className="nav-center">
                        <button className="toggle-nav" onClick={toggleSidebar}>
                            <i className="fas fa-bars"></i>
                        </button>
                        {/* logo */}
                        <img
                            src="/surfspot2.png"
                            className="nav-logo"
                            alt="logo"
                        />
                        <button className="btn logoutBtn" onClick={logout}>
                            logout
                        </button>
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
                                <li className="releative">
                                    <Link className="nav-link" to="/profile">
                                        Profile
                                    </Link>
                                </li>
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
                        </div>
                    </div>
                </nav>
                {/* <!-- sidebar --> */}
                <div
                    className={
                        sidebar ? "sidebar-overlay show" : "sidebar-overlay"
                    }
                >
                    <aside className="sidebar">
                        <button
                            className="sidebar-close"
                            onClick={toggleSidebar}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <ul className="sidebar-links">
                            <li>
                                <Link
                                    className="sidebar-link"
                                    to="/"
                                    onClick={toggleSidebar}
                                >
                                    <i className="fas fa-globe-americas"></i>
                                    Map
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="sidebar-link"
                                    to="/beachfeed"
                                    onClick={toggleSidebar}
                                >
                                    <i className="fas fa-water"></i>
                                    Beachfeed
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="sidebar-link"
                                    to="/profile"
                                    onClick={toggleSidebar}
                                >
                                    <i className="fas fa-umbrella-beach"></i>
                                    Profile
                                </Link>
                            </li>
                        </ul>
                    </aside>
                </div>
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
                            updateBio={updateBio}
                            // deleteProfile={deleteProfile}
                        />
                    )}
                />
            </>
        </BrowserRouter>
    );
}
