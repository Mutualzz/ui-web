import { render } from "@test-utils";
import { Divider } from "./Divider";

describe("Divider", () => {
    it("renders without crashing", () => {
        const { container } = render(<Divider />);
        expect(container).toBeInTheDocument();
    });

    it("renders with horizontal orientation correctly", () => {
        const { container } = render(<Divider orientation="horizontal" />);
        const dividerRoot = container.firstChild;
        const dividerLineStart = dividerRoot?.firstChild;
        const dividerLineEnd = dividerRoot?.lastChild;

        expect(dividerRoot).toHaveStyle({
            width: "100%",
            height: "1px",
            margin: "8px 0",
            flexDirection: "row",
        });

        expect(dividerLineStart).toHaveStyle({
            flexGrow: "1",
            minWidth: "1rem",
        });

        expect(dividerLineEnd).toHaveStyle({
            flexGrow: "1",
            minWidth: "1rem",
        });
    });

    it("renders with vertical orientation correctly", () => {
        const { container } = render(<Divider orientation="vertical" />);
        const dividerRoot = container.firstChild;
        const dividerLineStart = dividerRoot?.firstChild;
        const dividerLineEnd = dividerRoot?.lastChild;

        expect(dividerRoot).toHaveStyle({
            width: "auto",
            height: "100%",
            margin: "0 8px",
            flexDirection: "column",
        });

        expect(dividerLineStart).toHaveStyle({
            flexGrow: "1",
            minHeight: "1rem",
        });

        expect(dividerLineEnd).toHaveStyle({
            flexGrow: "1",
            minHeight: "1rem",
        });
    });

    it("renders with text content", () => {
        const { getByText } = render(
            <Divider orientation="horizontal">Divider Text</Divider>,
        );
        const dividerText = getByText("Divider Text");

        expect(dividerText).toBeInTheDocument();
        expect(dividerText).toHaveStyle({
            padding: "0 8px",
            whiteSpace: "nowrap",
        });
    });

    it("applies start inset correctly", () => {
        const { container } = render(
            <Divider orientation="horizontal" inset="start">
                Divider Text
            </Divider>,
        );
        const dividerRoot = container.firstChild;
        const dividerLineStart = dividerRoot?.firstChild;
        const dividerLineEnd = dividerRoot?.lastChild;

        expect(dividerLineStart).toHaveStyle({
            flexGrow: false,
        });

        expect(dividerLineEnd).toHaveStyle({
            flexGrow: "1",
        });
    });

    it("applies end inset correctly", () => {
        const { container } = render(
            <Divider orientation="horizontal" inset="end">
                Divider Text
            </Divider>,
        );
        const dividerRoot = container.firstChild;
        const dividerLineStart = dividerRoot?.firstChild;
        const dividerLineEnd = dividerRoot?.lastChild;

        expect(dividerLineStart).toHaveStyle({
            flexGrow: "1",
        });

        expect(dividerLineEnd).toHaveStyle({
            flexGrow: false,
        });
    });
});
