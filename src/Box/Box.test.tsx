import { render } from "@test-utils";
import { Box } from "./Box";

describe("Box", () => {
    it("renders without crashing", () => {
        const { container } = render(<Box>Test</Box>);
        expect(container).toBeInTheDocument();
    });

    it("applies block display by default", () => {
        const { container } = render(<Box>Test</Box>);
        expect(container.firstChild).toHaveStyle("display: block");
    });

    it("applies inline-block display when inline prop is true", () => {
        const { container } = render(<Box inline>Test</Box>);
        expect(container.firstChild).toHaveStyle("display: inline-block");
    });

    it("can accept system props", () => {
        const { container } = render(<Box m={16}>Test</Box>);
        expect(container.firstChild).toHaveStyle("margin: 16px");
    });

    it("accepts mutliple system props", () => {
        const { container } = render(
            <Box m={16} p={8}>
                Test
            </Box>,
        );

        const box = container.firstChild;
        expect(box).toHaveStyle("margin: 16px");
        expect(box).toHaveStyle("padding: 8px");
    });

    it("renders as a div element", () => {
        const { container } = render(<Box>Test</Box>);
        expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });

    it("renders children correctly", () => {
        const { getByText } = render(
            <Box>
                <span>Child Element</span>
            </Box>,
        );
        expect(getByText("Child Element")).toBeInTheDocument();
    });

    it("forwards HTML attributes", () => {
        const { container } = render(
            <Box
                data-testid="test-box"
                aria-label="Test Box"
                className="custom-class"
            >
                Test
            </Box>,
        );

        const box = container.firstChild;
        expect(box).toHaveAttribute("data-testid", "test-box");
        expect(box).toHaveAttribute("aria-label", "Test Box");
        expect(box).toHaveClass("custom-class");
    });
});
