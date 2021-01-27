// import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Reset from "./resetpw";

export default function Welcome() {
    return (
        <div>
            <div className="register-container">
                <div className="register-center">
                    <div className="welcome-container">
                        <h1>Surfspots</h1>
                        <img src="/surfspot2.png" alt="logo" className="logo" />
                        <h2>Worldmap</h2>
                    </div>
                    <HashRouter>
                        <div className="form-container">
                            <Route exact path="/" component={Registration} />
                            <Route path="/login" component={Login} />
                            <Route path="/reset" component={Reset} />
                        </div>
                    </HashRouter>
                </div>
            </div>
        </div>
    );
}
