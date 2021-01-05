import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            first: null,
            last: null,
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
        console.log("handle click fired", this.state);
        axios
            .post("/register", this.state)
            .then((res) => {
                this.setState({
                    error: res.data.error,
                });
                console.log("promise resolved, res: ", res.data.error);
                location.replace("/");
            })
            .catch((err) => {
                console.log("error at POST /register", err);
            });
    }
    render() {
        return (
            <>
                {this.state.error && <p>something went wrong!</p>}
                <input
                    type="text"
                    placeholder="first name"
                    name="first"
                    onChange={this.handleChange}
                />
                <input
                    type="text"
                    placeholder="last name"
                    name="last"
                    onChange={this.handleChange}
                />
                <input
                    type="email"
                    placeholder="email"
                    name="email"
                    onChange={this.handleChange}
                />
                <input
                    type="password"
                    placeholder="password"
                    name="pw"
                    onChange={this.handleChange}
                />
                <button onClick={this.handleClick}>Register</button>
                <p>
                    Already a member? <Link to="/login">Log in</Link>
                </p>
            </>
        );
    }
}

// a) <button onClick={this.incrementCount}>Click Me!</button>
