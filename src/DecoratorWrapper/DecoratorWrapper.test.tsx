import { render } from "@test-utils";
import { DecoratorWrapper } from "./DecoratorWrapper";

describe("DecoratorWrapper", () => {
    it("renders without crashing", () => {
        const { container } = render(
            <DecoratorWrapper position="start">Icon</DecoratorWrapper>,
        );
        expect(container).toBeInTheDocument();
    });

    it("applies correct styles for start position", () => {
        const { container } = render(
            <DecoratorWrapper position="start">Icon</DecoratorWrapper>,
        );

        expect(container.firstChild).toHaveStyle({
            paddingRight: "0.25em",
        });
    });

    it("applies correct styles for end position", () => {
        const { container } = render(
            <DecoratorWrapper position="end">Icon</DecoratorWrapper>,
        );

        expect(container.firstChild).toHaveStyle({
            paddingLeft: "0.25em",
        });
    });

    it("applies correct styles when position is not present", () => {
        const { container } = render(<DecoratorWrapper>Icon</DecoratorWrapper>);

        expect(container.firstChild).toHaveStyle({
            paddingRight: 0,
            paddingLeft: 0,
        });
    });
});
