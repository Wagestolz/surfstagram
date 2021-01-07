import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";

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
    }
    async componentDidMount() {
        const { data } = await axios.get("/user");
        this.setState({
            id: data[0].id,
            email: data[0].email,
            first: data[0].first,
            last: data[0].last,
            bio: data[0].bio,
            profile_pic: data[0].profile_pic,
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
            <>
                {/* navbar */}
                <nav className="navbar">
                    <div className="nav-center">
                        {/* logo */}

                        <img src="/logo6.gif" className="nav-logo" alt="logo" />

                        <div className="links-container">
                            {/* <button className="toggle-nav" @click="toggleNav">
                            <i className="fas fa-bars"></i>
                        </button> */}
                            {/* links */}
                            <ul className="nav-links">
                                <li>
                                    <a className="nav-link">Buddies</a>
                                </li>
                                {/* <li>
                                    <a
                                        onClick={this.logout}
                                        className="nav-link"
                                    >
                                        logout
                                    </a>
                                </li> */}
                            </ul>
                        </div>
                        {/* Profile Pic */}
                        <div className="pic-container">
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                profile_pic={this.state.profile_pic}
                                toggleUploader={this.toggleUploader}
                            />
                            <button onClick={this.logout}>logout</button>
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
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    profile_pic={this.state.profile_pic}
                    bio={this.state.bio}
                    toggleUploader={this.toggleUploader}
                    updateBio={this.updateBio}
                />
            </>
        );
    }
}
