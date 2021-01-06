import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            id: null,
            email: null,
            first: null,
            last: null,
            profile_pic: null,
            uploaderModal: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.deleteImg = this.deleteImg.bind(this);
        this.logout = this.logout.bind(this);
    }
    async componentDidMount() {
        const { data } = await axios.get("/user");
        this.setState({
            id: data[0].id,
            email: data[0].email,
            first: data[0].first,
            last: data[0].last,
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
        var self = this;
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
    render() {
        return (
            <>
                {/* navbar */}
                <nav className="navbar">
                    <div className="nav-center">
                        {/* links */}
                        <div>
                            {/* <button className="toggle-nav" @click="toggleNav">
                            <i className="fas fa-bars"></i>
                        </button> */}
                            {/* logo */}
                            <img
                                src="/logo6.gif"
                                className="nav-logo"
                                alt="logo"
                            />
                            <ul className="nav-links">
                                <li>
                                    <a className="nav-link"> find friends</a>
                                </li>
                                <li>
                                    <a
                                        onClick={this.logout}
                                        className="nav-link"
                                    >
                                        logout
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* cart icon */}
                        <div className="pic-container">
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                profile_pic={this.state.profile_pic}
                                toggleUploader={this.toggleUploader}
                                deleteImg={this.deleteImg}
                            />
                        </div>
                    </div>
                </nav>

                {this.state.uploaderModal && (
                    <Uploader setImage={this.setImage} />
                )}
            </>
        );
    }
}
