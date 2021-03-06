import { Component } from "react";

export default class BioEditer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            bioDraft: "",
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }
    handleClick() {
        this.setState({
            bioDraft: this.props.bio,
            editMode: !this.state.editMode,
        });
    }
    handleUpdate() {
        this.props.updateBio(this.state.bioDraft);
        this.handleClick();
    }
    handleChange(e) {
        this.setState({
            bioDraft: e.target.value,
        });
    }
    render() {
        return (
            <>
                {this.state.editMode && (
                    <>
                        <textarea
                            className="chat-input"
                            onChange={this.handleChange}
                            cols="30"
                            rows="10"
                            defaultValue={this.props.bio}
                        ></textarea>
                        <button
                            id="save-btn"
                            className="btn bio-btn"
                            onClick={this.handleUpdate}
                        >
                            save
                        </button>
                    </>
                )}
                {!this.state.editMode && (
                    <>
                        <p>{this.props.bio}</p>
                        {this.props.updateBio && (
                            <button
                                className="btn bio-btn"
                                onClick={this.handleClick}
                            >
                                {this.props.bio ? "update Bio" : "add Bio"}
                            </button>
                        )}
                    </>
                )}
            </>
        );
    }
}
