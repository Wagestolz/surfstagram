// import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Reset from "./resetpw";

export default function Welcome() {
    return (
        <div>
            <h1>Surfbuddy</h1>
            <img src="logo6.gif" alt="logo" className="logo" />
            <h2>Connect with Surfers nearby</h2>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} />
                </div>
            </HashRouter>
        </div>
    );
}
