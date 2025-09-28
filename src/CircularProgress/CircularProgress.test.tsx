import { render } from "@test-utils";
import { CircularProgress } from "./CircularProgress";

// Planning to extend further, when I introduce theme context awareness
describe("CircularProgress", () => {
    it("renders without crashing", () => {
        const { container } = render(<CircularProgress />);
        expect(container).toBeInTheDocument();
    });
});
