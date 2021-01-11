import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import BioEditer from "./bioediter";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios
            .get(`/getuser/:${this.props.match.params.id}`, {
                params: { id: this.props.match.params.id },
            })
            .then(({ data }) => {
                if (!data.ownProfile) {
                    this.setState({
                        ...data[0],
                    });
                } else {
                    this.props.history.push("/");
                }
            })
            .catch();
    }
    render() {
        return (
            <div className="profile-container">
                <div className="profile-center">
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        profile_pic={this.state.profile_pic}
                        toggleUploader={this.state.toggleUploader}
                        largerSize="bigger"
                    />
                    <div className="profile-info">
                        <h3>
                            {this.state.first} {this.state.last}
                        </h3>
                        <BioEditer bio={this.state.bio} />
                    </div>
                </div>
            </div>
        );
    }
}
