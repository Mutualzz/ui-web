import { render } from "@test-utils";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { Checkbox } from "./Checkbox";

// We usually check for hidden input because the visible is just a styled span that visually represents the checkbox
// The hidden input is the actual checkbox that gets checked/unchecked
// The visible box is just a styled span that visually represents the checkbox state
describe("Checkbox", () => {
    it("renders with default props", () => {
        const { getByRole } = render(<Checkbox label="Test Checkbox" />);
        const checkbox = getByRole("checkbox");
        expect(checkbox).toBeInTheDocument();
    });

    it("renders label correctly", () => {
        const { getByText } = render(<Checkbox label="Test Checkbox" />);
        expect(getByText("Test Checkbox")).toBeInTheDocument();
    });

    it("applies checked state", () => {
        const { getByRole } = render(
            <Checkbox label="Checked Checkbox" checked />,
        );
        const checkbox = getByRole("checkbox");

        // We need to make sure the hidden input is checked
        expect(checkbox).toBeChecked(); // Hidden input
    });

    it("applies disabled state", () => {
        const { getByRole } = render(
            <Checkbox label="Disabled Checkbox" disabled />,
        );
        const checkbox = getByRole("checkbox");
        const checkboxParent = checkbox.parentElement;

        expect(checkbox).toBeDisabled(); // Hidden input
        // Visible box (we check the style for disabled state since a span cannot be disabled)
        expect(checkboxParent).toHaveStyle(
            "opacity: 0.5; pointer-events: none;",
        );
    });

    it("calls onChange handler when clicked", async () => {
        const handleChange = jest.fn();
        const user = userEvent.setup();
        const { getByRole } = render(
            <Checkbox label="Clickable Checkbox" onChange={handleChange} />,
        );
        const checkbox = getByRole("checkbox");

        await act(async () => {
            await user.click(checkbox); // Simulate click on the hidden input (visible box will also toggle)
        });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("toggles checked state on click", async () => {
        const user = userEvent.setup();
        const { getByRole } = render(
            <Checkbox label="Toggle Checkbox" defaultChecked />,
        );
        const checkbox = getByRole("checkbox");

        // Initially checked
        expect(checkbox).toBeChecked();

        await act(async () => {
            await user.click(checkbox); // Click to uncheck
        });

        expect(checkbox).not.toBeChecked(); // Now unchecked

        await act(async () => {
            await user.click(checkbox); // Click to check again
        });

        expect(checkbox).toBeChecked(); // Now checked again
    });

    it("renders with indeterminate state", () => {
        const { getByRole } = render(
            <Checkbox label="Indeterminate Checkbox" indeterminate />,
        );
        const checkbox = getByRole("checkbox");
        expect(checkbox).toBeInTheDocument();
    });
});
