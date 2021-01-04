import React from "react";
import Registration from "./registration";

export default function Welcome() {
    return (
        <div>
            <h1>Welcome to Wagestolz</h1>
            <img src="logo.png" alt="logo" className="logo" />
            <h2>The professional Network for Innovators</h2>
            <Registration />
            <p>
                Already a member?<a href="#">Log in</a>
            </p>
        </div>
    );
}
