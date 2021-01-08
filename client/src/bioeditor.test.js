// import React from "react";
import BioEditer from "./bioediter";
import { render, fireEvent, waitFor } from "@testing-library/react";
import App from "./app";
import axios from "./axios";
jest.mock("./axios");

test("When no bio is passed to it, an Add-button is rendered", () => {
    const { container } = render(<BioEditer bio="" updateBio="true" />);
    expect(container.querySelector(".btn").innerHTML).toBe("add Bio");
});

test("When no bio is passed to it, an Add-button is rendered", () => {
    const { container } = render(<BioEditer bio="Test Bio" updateBio="true" />);
    expect(container.querySelector(".btn").innerHTML).toBe("update Bio");
});

test("Clicking either the Add or Edit button causes a textarea and a Save button to be rendered.", async () => {
    const { container } = render(<BioEditer bio="Test Bio" updateBio="true" />);
    fireEvent.click(container.querySelector(".btn"));
    await waitFor(() => {
        expect(container.querySelector("#save-btn")).toBeTruthy();
        expect(container.querySelector("textarea")).toBeTruthy();
    });
});

test("Clicking the Save button causes an ajax request.", async () => {
    const mockHandleUpdate = jest.fn(App.prototype.updateBio);
    axios.post.mockResolvedValue({
        data: [
            {
                bio: "Test Ajax-Request for Bio",
            },
        ],
    });
    const { container } = render(
        <BioEditer bio="Test Bio" updateBio={mockHandleUpdate} />
    );
    fireEvent.click(container.querySelector(".btn")); // for save button to appear
    await waitFor(() => {
        expect(container.querySelector("#save-btn")).toBeTruthy();
    });
    fireEvent.click(container.querySelector("#save-btn"));
    await waitFor(() => {
        expect(mockHandleUpdate.mock.calls.length).toBe(1);
    });
});
