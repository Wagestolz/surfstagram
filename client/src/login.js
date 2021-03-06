import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: null,
            pw: null,
            error: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    handleClick() {
        axios
            .post("/login", this.state)
            .then((res) => {
                this.setState({
                    error: res.data.error,
                });
                if (!res.data.error) {
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.log("error at POST /register", err);
            });
    }
    render() {
        return (
            <>
                {this.state.error && <p>something went wrong!</p>}
                <div className="register-form">
                    <input
                        className="field"
                        type="email"
                        placeholder="email"
                        name="email"
                        onChange={this.handleChange}
                    />
                    <input
                        className="field"
                        type="password"
                        placeholder="password"
                        name="pw"
                        onChange={this.handleChange}
                    />
                    <button className="btn" onClick={this.handleClick}>
                        Login
                    </button>
                </div>
                <p className="login-note">
                    Not a member? <Link to="/">Sign up</Link>
                </p>
                <p>
                    forgot your password? <Link to="/reset">Click here</Link>
                </p>
            </>
        );
    }
}
