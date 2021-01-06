import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

let element;
if (location.pathname === "/welcome") {
    element = <Welcome />;
} else {
    element = <App />;
    // element = <img src="logo.png" alt="logo" className="logo" />;
}

ReactDOM.render(element, document.querySelector("main"));

/*
Welcome(parent)
    - Registration (child)
    - Login (child)
    - Reset (child)
*/
