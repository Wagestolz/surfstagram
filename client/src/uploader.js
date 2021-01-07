import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            error: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleClick(e) {
        e.preventDefault();
        if (this.props.profile_pic && this.state.image) {
            this.props.deleteImg();
        }
        var formData = new FormData();
        formData.append("image", this.state.image);
        if (this.state.image) {
            axios
                .post("/imageupload", formData)
                .then((res) => {
                    this.props.setImage(res.data.profile_pic);
                    this.props.toggleUploader();
                })
                .catch((err) => {
                    console.log("error from POST /imageupload", err);
                });
        }
    }
    handleFileChange(e) {
        this.setState({
            image: e.target.files[0],
        });
    }
    handleDelete() {
        if (this.props.profile_pic) {
            this.props.deleteImg();
        }
        this.props.toggleUploader();
    }
    render() {
        return (
            <div className="modal">
                <div className="modal-container">
                    <h2
                        onClick={this.props.toggleUploader}
                        className="close-btn"
                    >
                        <i className="fas fa-times"></i>
                    </h2>
                    <div>
                        <input
                            type="file"
                            name="image"
                            id="image"
                            accept="image/*"
                            className="inputfile"
                            onChange={this.handleFileChange}
                        />
                        <label htmlFor="image" id="upload">
                            <i className="fas fa-upload"> </i>
                            {this.state.image
                                ? this.state.image.name
                                : " Choose Img (max 2mb)"}
                        </label>
                    </div>
                    <div>
                        <button
                            className="btn modalBtn"
                            onClick={this.handleClick}
                        >
                            upload
                        </button>
                        <button
                            className="btn modalBtn"
                            onClick={this.handleDelete}
                        >
                            delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

// 1. store image in state
// 2. send file to server
// 3. let App know that new profile pic and that app needs to update its own state
