import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            email: null,
            first: "Thorsten",
            last: "Staender",
            uploaderModal: false,
            profile_pic: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setImage = this.setImage.bind(this);
    }
    componentDidMount() {
        axios
            .get("/user")
            .then((res) => {
                this.setState({
                    email: res.data.email,
                    first: res.data.first,
                    last: res.data.last,
                    profile_pic: res.data.profile_pic,
                });
            })
            .catch((err) => {
                console.log("error at GET /user", err);
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
    render() {
        return (
            <>
                <h2>App</h2>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    email={this.state.email}
                    profile_pic={this.state.profile_pic}
                />
                <button onClick={this.toggleUploader}>Upload</button>
                {this.state.uploaderModal && (
                    <Uploader setImage={this.setImage} />
                )}
            </>
        );
    }
}
