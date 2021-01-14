import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { reducer } from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import Welcome from "./welcome";
import App from "./app";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let element;
if (location.pathname === "/welcome") {
    element = <Welcome />;
} else {
    element = (
        <Provider store={store}>
            <App />
        </Provider>
    );
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
    - FindPeople (child)
    - Friends (child)

*/
