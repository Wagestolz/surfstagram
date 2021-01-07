import { Component } from "react";

export default class BioEditer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            bioDraft: "",
            bio: this.props.bio,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }
    UNSAFE_componentWillReceiveProps() {
        this.setState({
            bio: this.props.bio,
        });
    }
    handleClick() {
        this.setState({
            bioDraft: "",
            editMode: !this.state.editMode,
        });
    }
    handleUpdate() {
        if (this.state.bioDraft) {
            console.log("this.state.bioDraft: ", this.state.bioDraft);
            // bio not empty, trigger axios request
        }
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
                            onChange={this.handleChange}
                            cols="30"
                            rows="10"
                            defaultValue={this.props.bio}
                        ></textarea>
                        <button className="btn" onClick={this.handleUpdate}>
                            save
                        </button>
                    </>
                )}
                {!this.state.editMode && (
                    <>
                        <p>{this.props.bio}</p>
                        <button className="btn" onClick={this.handleClick}>
                            {this.props.bio ? "update Bio" : "add Bio"}
                        </button>
                    </>
                )}
            </>
        );
    }
}
