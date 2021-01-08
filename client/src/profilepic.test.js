// import React from "react";
import ProfilePic from "./profilepic";
import { render, fireEvent } from "@testing-library/react";

test("When url is passed to as a prop, that url is set as the value if the src attribute", () => {
    const { container } = render(
        <ProfilePic profile_pic="https://www.fillmurray.com/500/500" />
    );

    expect(container.querySelector("img").src).toBe(
        "https://www.fillmurray.com/500/500"
    );
});

test("When first and last props are passed, first and last are assigned as the valie of the alt attribute", () => {
    const { container } = render(
        <ProfilePic profile_pic="true" first="Testfirst" last="Testlast" />
    );

    expect(container.querySelector("img").alt).toBe("Testfirst Testlast");
});

// test("onClick prop runs when the img is clicked", () => {
//     const mockOnClick = jest.fn();
//     const { container } = render(<ProfilePic onClick={mockOnClick} />);
//     fireEvent.click(container.querySelector("img"));
//     expect(mockOnClick.mock.calls.length).toBe(1);
// });

// container is like "document" and represents the DOM
