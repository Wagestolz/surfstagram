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
        var formData = new FormData();
        formData.append("image", this.state.image);
        if (this.state.image) {
            axios
                .post("/imageupload", formData)
                .then((res) => {
                    this.props.setImage(res.data.profile_pic);
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
        this.props.deleteImg();
    }
    render() {
        return (
            <>
                {this.state.error && <p>something went wrong!</p>}
                <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={this.handleFileChange}
                />
                <button onClick={this.handleClick}>upload</button>
                <button onClick={this.handleDelete}>delete</button>
            </>
        );
    }
}

// 1. store image in state
// 2. send file to server
// 3. let App know that new profile pic and that app needs to update its own state
