import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // url: null,
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        // this.setState({
        //     url: "some url from uploader",
        // });
        this.props.setImage("some url from uploader");
    }
    render() {
        return (
            <>
                <h2 onClick={this.handleClick}>Uploader</h2>
            </>
        );
    }
}

// 1. store image in state
// 2. send file to server
// 3. let App know that new profile pic and that app needs to update its own state
