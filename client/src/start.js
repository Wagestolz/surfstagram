import ReactDOM from "react-dom";
// import HelloWorld from "./helloWorld";
// import Registration from "./registration";
import Welcome from "./welcome";

// ReactDOM.render(<HelloWorld />, document.querySelector("main"));

let element;
if (location.pathname === "/welcome") {
    element = <Welcome />;
} else {
    element = <img src="logo.png" alt="logo" className="logo" />;
}

ReactDOM.render(element, document.querySelector("main"));

/*
Welcome(parent)
    - Registration (child)
*/
