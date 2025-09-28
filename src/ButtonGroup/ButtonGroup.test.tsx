import { render } from "@test-utils";
import { Button } from "../Button/Button";
import { ButtonGroup } from "./ButtonGroup";

describe("ButtonGroup", () => {
    it("renders without crashing", () => {
        const { getByText } = render(
            <ButtonGroup>
                <Button>Button 1</Button>
                <Button>Button 2</Button>
            </ButtonGroup>,
        );

        expect(getByText("Button 1")).toBeInTheDocument();
        expect(getByText("Button 2")).toBeInTheDocument();
    });

    it("applies horizontal orientation by default", () => {
        const { container } = render(
            <ButtonGroup>
                <Button>Button 1</Button>
                <Button>Button 2</Button>
            </ButtonGroup>,
        );

        expect(container.firstChild).toHaveStyle("flex-direction: row");
    });

    it("applies vertical orientation when specified", () => {
        const { container } = render(
            <ButtonGroup orientation="vertical">
                <Button>Button 1</Button>
                <Button>Button 2</Button>
            </ButtonGroup>,
        );

        expect(container.firstChild).toHaveStyle("flex-direction: column");
    });

    it("applies no spacing by default", () => {
        const { container } = render(
            <ButtonGroup>
                <Button>Button 1</Button>
                <Button>Button 2</Button>
            </ButtonGroup>,
        );

        expect(container.firstChild).toHaveStyle("gap: 0");
    });

    it("applies spacing between buttons", () => {
        const { container } = render(
            <ButtonGroup spacing={8}>
                <Button>Button 1</Button>
                <Button>Button 2</Button>
            </ButtonGroup>,
        );

        expect(container.firstChild).toHaveStyle("gap: 8px");
    });
});
