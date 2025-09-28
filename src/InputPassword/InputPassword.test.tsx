import { render } from "@test-utils";
import { InputPassword } from "./InputPassword";

// TODO: add more tests for InputPassword component
describe("InputPassword", () => {
    it("renders correctly with default props", () => {
        const { container } = render(<InputPassword />);
        expect(
            container.querySelector("input[type='password']"),
        ).toBeInTheDocument();
    });
});
