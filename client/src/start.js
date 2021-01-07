import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

let element;
if (location.pathname === "/welcome") {
    element = <Welcome />;
} else {
    element = <App />;
}

ReactDOM.render(element, document.querySelector("main"));

/*
Welcome(parent)
    - Registration (child)
    - Login (child)
    - Reset (child)
App (parent)
    - ProfilePic (child)
    - Uploader (grandchild)   
    - Profile (child)
        - ProfilePic (grandchild)
            - Uploader (great grandchild) 
        - BioEditor (grandchild) 

*/
