import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Reset extends Component {
    constructor() {
        super();
        this.state = {
            email: null,
            code: null,
            pw: null,
            error: false,
            msg: null,
            view: 1,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleVerify = this.handleVerify.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    handleReset() {
        if (!this.state.email || !this.state.email.includes("@")) {
            this.setState({
                msg: "Please enter a valid email!",
            });
        } else {
            axios
                .post("/reset/email", this.state)
                .then((res) => {
                    this.setState({
                        error: res.data.error,
                        msg: res.data.msg,
                        view: res.data.view,
                    });
                })
                .catch((err) => {
                    console.log("error at POST /reset/email", err);
                });
        }
    }
    handleVerify() {
        if (!this.state.code || !this.state.pw) {
            this.setState({
                msg: "Please enter the code and a new password",
            });
        } else {
            axios
                .post("/reset/verify", this.state)
                .then((res) => {
                    this.setState({
                        error: res.data.error,
                        msg: res.data.msg,
                        view: res.data.view,
                    });
                })
                .catch((err) => {
                    console.log("error at POST /reset/verify", err);
                });
        }
    }
    render() {
        return (
            <>
                <h2>Reset Password</h2>
                {this.state.msg && <p>Ooops... {this.state.msg}</p>}
                {this.state.view == 1 && (
                    <>
                        <div className="register-form">
                            <h3>
                                Please enter the email adress with which you
                                registered
                            </h3>
                            <input
                                type="email"
                                placeholder="email"
                                name="email"
                                onChange={this.handleChange}
                            />
                            <button onClick={this.handleReset}>Submit</button>
                            <p>
                                Back to <Link to="/login">log in</Link>
                            </p>
                        </div>
                    </>
                )}
                {this.state.view == 2 && (
                    <>
                        <div className="register-form">
                            <h3>Please enter the code you received</h3>
                            <input
                                type="text"
                                placeholder="code"
                                name="code"
                                onChange={this.handleChange}
                            />
                            <h3>Please enter a new password</h3>
                            <input
                                type="password"
                                placeholder="password"
                                name="pw"
                                onChange={this.handleChange}
                            />
                            <button onClick={this.handleVerify}>Submit</button>
                        </div>
                    </>
                )}
                {this.state.view == 3 && (
                    <>
                        <div className="register-form">
                            <h3>Success!</h3>
                            <p>
                                You can now <Link to="/login">log in</Link> with
                                your new password
                            </p>
                        </div>
                    </>
                )}
            </>
        );
    }
}
