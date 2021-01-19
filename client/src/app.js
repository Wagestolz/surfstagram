import { Component } from "react";
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

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            id: null,
            email: null,
            first: null,
            last: null,
            profile_pic: null,
            bio: null,
            uploaderModal: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.deleteImg = this.deleteImg.bind(this);
        this.logout = this.logout.bind(this);
        this.updateBio = this.updateBio.bind(this);
        this.deleteProfile = this.deleteProfile.bind(this);
    }
    async componentDidMount() {
        const { data } = await axios.get("/user");
        this.setState({
            ...data[0],
        });
    }
    setImage(imageUrl) {
        this.setState({
            profile_pic: imageUrl,
        });
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    toggleUploader() {
        this.setState({
            uploaderModal: !this.state.uploaderModal,
        });
    }
    logout() {
        axios.get("/logout").then(() => location.replace("/welcome"));
        socket.emit("disconnect");
    }
    deleteImg() {
        let self = this;
        axios
            .post("/deleteimg", {
                params: {
                    url: this.state.profile_pic,
                },
            })
            .then(() => {
                self.setState({
                    profile_pic: null,
                });
            })
            .catch((err) => {
                console.log("error at POST /deleteimg", err);
            });
    }
    deleteProfile() {
        let self = this;
        console.log("delete profile fired!");
        this.deleteImg();
        axios
            .post("/deleteprofile")
            .then((res) => {
                console.log("deletion resolved: ", res);
                self.logout();
            })
            .catch((err) => {
                console.log("error at POST /deleteprofile", err);
            });
    }
    updateBio(bioDraft) {
        let self = this;
        axios
            .post("/updateBio", {
                bioDraft: bioDraft,
            })
            .then(({ data }) => {
                self.setState({
                    bio: data[0].bio,
                });
            })
            .catch((err) => {
                console.log("error at POST /updateBio", err);
            });
    }
    render() {
        return (
            <BrowserRouter>
                <>
                    {/* navbar */}
                    <nav className="navbar">
                        <div className="nav-center">
                            {/* logo */}
                            <img
                                src="/logo6.gif"
                                className="nav-logo"
                                alt="logo"
                            />
                            <div className="links-container">
                                {/* <button className="toggle-nav" @click="toggleNav">
                            <i className="fas fa-bars"></i>
                        </button> */}
                                {/* links */}
                                <ul className="nav-links">
                                    <li>
                                        <Link className="nav-link" to="/users">
                                            Connect
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="nav-link"
                                            to="/friends"
                                        >
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
                                    </li>
                                </ul>
                            </div>
                            {/* Profile Pic */}
                            <div className="pic-container">
                                <ProfilePic
                                    first={this.state.first}
                                    last={this.state.last}
                                    profile_pic={this.state.profile_pic}
                                    toggleUploader={this.toggleUploader}
                                    largerSize=""
                                />
                                <button
                                    className="btn logoutBtn"
                                    onClick={this.logout}
                                >
                                    logout
                                </button>
                            </div>
                        </div>
                    </nav>

                    {this.state.uploaderModal && (
                        <Uploader
                            setImage={this.setImage}
                            deleteImg={this.deleteImg}
                            profile_pic={this.state.profile_pic}
                            toggleUploader={this.toggleUploader}
                        />
                    )}
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                profile_pic={this.state.profile_pic}
                                bio={this.state.bio}
                                toggleUploader={this.toggleUploader}
                                updateBio={this.updateBio}
                                deleteProfile={this.deleteProfile}
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                id={this.state.id}
                                match={props.match}
                                history={props.history}
                                key={props.match.url}
                            />
                        )}
                    />
                    <Route exact path="/users" render={() => <FindPeople />} />
                    <Route exact path="/friends" render={() => <Friends />} />
                    <Route exact path="/chat" render={() => <Chat />} />
                </>
            </BrowserRouter>
        );
    }
}
