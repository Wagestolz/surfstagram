import React from "react";
import ProfilePic from "./profilepic";
import { render } from "@testing-library/react";

test("when no url is passed, /default.jps is used as src", () => {
    const { container } = render(<ProfilePic />);
});

// container is like "document" and represents the DOM
