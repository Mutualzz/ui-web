import { render } from "@test-utils";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { InputNumber } from "./InputNumber";

describe("InputNumber", () => {
    it("renders correctly with default props", () => {
        const { container } = render(<InputNumber />);

        expect(
            container.querySelector("input[type='number']"),
        ).toBeInTheDocument();
    });

    it("spinner buttons increment and decrement value", async () => {
        const user = userEvent.setup();
        const { container } = render(<InputNumber />);
        const input = container.querySelector("input[type='number']");
        const incrementButton = container.querySelector(
            "button[aria-label='Increment']",
        );
        const decrementButton = container.querySelector(
            "button[aria-label='Decrement']",
        );

        expect(input).toBeInTheDocument();
        expect(incrementButton).toBeInTheDocument();
        expect(decrementButton).toBeInTheDocument();

        // Increment value
        await act(async () => {
            await user.click(incrementButton!);
        });
        expect(input).toHaveValue(1);

        // Decrement value
        await act(async () => {
            await user.click(decrementButton!);
        });
        expect(input).toHaveValue(0);
    });

    it("handles keyboard input correctly", async () => {
        const user = userEvent.setup();
        const { container } = render(<InputNumber />);
        const input = container.querySelector("input[type='number']");

        expect(input).toBeInTheDocument();

        // Type a number
        await act(async () => {
            await user.type(input!, "123");
        });
        expect(input).toHaveValue(123);

        // Clear the input
        await act(async () => {
            await user.clear(input!);
        });
        expect(input).toHaveValue(null);
    });

    it("handles paste events correctly", async () => {
        const user = userEvent.setup();
        const { container } = render(<InputNumber />);
        const input = container.querySelector("input[type='number']");

        expect(input).toBeInTheDocument();

        // Click to focus the input
        await act(async () => {
            await user.click(input!);
        });
        expect(input).toHaveFocus();

        // Paste a number
        await act(async () => {
            await user.paste("456");
        });
        expect(input).toHaveValue(456);

        // Paste invalid value
        await act(async () => {
            await user.paste("abc");
        });
        expect(input).toHaveValue(456); // Should not change
    });

    it("handles min and max constraints", async () => {
        const user = userEvent.setup();
        const { container } = render(<InputNumber min={10} max={20} />);
        const input = container.querySelector("input[type='number']");

        expect(input).toBeInTheDocument();

        // Set value below min
        await act(async () => {
            await user.clear(input!);
            await user.click(input!);
            await user.type(input!, "5");
            await user.tab();
        });
        expect(input).toHaveValue(10); // Should clamp to min

        // Set value above max
        await act(async () => {
            await user.clear(input!);
            await user.click(input!);
            await user.type(input!, "25");
            await user.tab();
        });
        expect(input).toHaveValue(20); // Should clamp to max
    });

    it("calls onIncrement and onDecrement callbacks", async () => {
        const onIncrement = jest.fn();
        const onDecrement = jest.fn();
        const user = userEvent.setup();
        const { container } = render(
            <InputNumber onIncrement={onIncrement} onDecrement={onDecrement} />,
        );
        const incrementButton = container.querySelector(
            "button[aria-label='Increment']",
        );
        const decrementButton = container.querySelector(
            "button[aria-label='Decrement']",
        );

        expect(incrementButton).toBeInTheDocument();
        expect(decrementButton).toBeInTheDocument();

        // Click increment button
        await act(async () => {
            await user.click(incrementButton!);
        });
        expect(onIncrement).toHaveBeenCalledTimes(1);

        // Click decrement button
        await act(async () => {
            await user.click(decrementButton!);
        });
        expect(onDecrement).toHaveBeenCalledTimes(1);
    });
});
