import { render, screen } from "@test-utils";
import { Button } from "./Button";

describe("Button", () => {
    it("renders with default props", () => {
        const { getByRole } = render(<Button>Click Me</Button>);
        const button = getByRole("button");
        expect(button).toBeInTheDocument();
    });

    it("renders children correctly", () => {
        const { getByText } = render(<Button>Test Button</Button>);
        expect(getByText("Test Button")).toBeInTheDocument();
    });

    it("applies disabled state", () => {
        render(<Button disabled>Disabled Button</Button>);
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
    });

    it("shows loading state", () => {
        render(<Button loading>Loading Button</Button>);
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
    });

    it("renders custom loading indicator", () => {
        const customIndicator = (
            <span data-testid="custom-loader">Loading...</span>
        );
        render(
            <Button loading loadingIndicator={customIndicator}>
                Button
            </Button>,
        );
        expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
    });

    it("renders start decorator", () => {
        const startIcon = <span data-testid="start-icon">→</span>;
        render(<Button startDecorator={startIcon}>Button</Button>);
        expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    });

    it("renders end decorator", () => {
        const endIcon = <span data-testid="end-icon">←</span>;
        render(<Button endDecorator={endIcon}>Button</Button>);
        expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    });

    it("handles click events", () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Clickable</Button>);
        const button = screen.getByRole("button");
        button.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not trigger click when disabled", () => {
        const handleClick = jest.fn();
        render(
            <Button onClick={handleClick} disabled>
                Disabled
            </Button>,
        );
        const button = screen.getByRole("button");
        button.click();
        expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not trigger click when loading", () => {
        const handleClick = jest.fn();
        render(
            <Button onClick={handleClick} loading>
                Loading
            </Button>,
        );

        const button = screen.getByRole("button");
        button.click();
        expect(handleClick).not.toHaveBeenCalled();
    });

    it("forwards additional props", () => {
        render(<Button aria-label="Custom Button">Button</Button>);

        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-label", "Custom Button");
    });
});
