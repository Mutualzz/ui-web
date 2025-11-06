import {
    resolveSize,
    styled,
    type Size,
    type SizeValue,
    type TypographyLevel,
} from "@mutualzz/ui-core";
import { forwardRef } from "react";
import { useTheme } from "../useTheme";
import { resolveDividerColor, resolveDividerStyles } from "./Divider.helpers";
import type { DividerProps, DividerVariant } from "./Divider.types";

const DividerWrapper = styled("div")<{ isVertical?: boolean }>(
    ({ isVertical }) => ({
        position: "relative",
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",

        width: isVertical ? "auto" : "100%",
        height: isVertical ? "100%" : "auto",

        alignSelf: "stretch",
        minWidth: isVertical ? "auto" : 0,
    }),
);

DividerWrapper.displayName = "DividerWrapper";

const DividerLine = styled("span")<{
    isVertical: boolean;
    lineColor: string;
    variant: DividerVariant;
    grow?: boolean;
}>(({ isVertical, variant, lineColor, grow }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    ...(isVertical
        ? {
              width: "1px",
              flexGrow: grow ? 1 : 0,
              minHeight: "1rem",
          }
        : {
              height: "1px",
              flex: grow ? "1 1 0%" : "0 0 auto",
              minWidth: "1rem",
          }),
    ...resolveDividerStyles(isVertical, lineColor)[variant],
}));

DividerLine.displayName = "DividerLine";

const DividerText = styled("span")<{
    textColor: string;
    isVertical: boolean;
    textPadding?: Size | SizeValue | number;
    textLevel?: TypographyLevel | "inherit";
}>(({
    theme,
    isVertical,
    textColor,
    textLevel = "body-md",
    textPadding = 0,
}) => {
    const paddingValue = resolveSize(theme, textPadding, {
        sm: 4,
        md: 6,
        lg: 12,
    });

    return {
        color: textColor,
        padding: isVertical ? `${paddingValue}px 0` : `0 ${paddingValue}px`,
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        lineHeight: 1,
        fontSize:
            textLevel !== "inherit"
                ? theme.typography.levels[textLevel].fontSize
                : "inherit",
    };
});

DividerText.displayName = "DividerText";

/**
 * Divider component for separating content.
 * It can be oriented horizontally or vertically.
 * It can also have different visual styles and colors.
 * It supports text content that can be placed in the middle of the divider.
 * The divider can be styled with different variants and colors.
 * The `inset` prop allows for controlling the placement of the text relative to the divider.
 * The `lineColor` and `textColor` props allow for customizing the colors of the divider line and text, respectively.
 * The `variant` prop allows for different visual styles of the divider.
 */
const Divider = forwardRef<HTMLDivElement, DividerProps>(
    (
        {
            orientation = "horizontal",
            inset = "none",
            lineColor = "neutral",
            textColor = "neutral",
            variant = "solid",
            textPadding = 0,
            textLevel = "body-md",
            children,
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const isVertical = orientation === "vertical";

        const resolvedLineColor = resolveDividerColor(theme, lineColor);
        const resolvedTextColor = resolveDividerColor(theme, textColor);

        const showFirstLine = inset !== "start";
        const showSecondLine = inset !== "end";
        const firstLineGrow = inset !== "half-start";
        const secondLineGrow = inset !== "half-end";

        return (
            <DividerWrapper
                ref={ref}
                isVertical={isVertical}
                role="separator"
                aria-orientation={isVertical ? "vertical" : "horizontal"}
                css={{ color: resolvedLineColor }}
            >
                {showFirstLine && (
                    <DividerLine
                        isVertical={isVertical}
                        lineColor={resolvedLineColor}
                        variant={variant}
                        grow={firstLineGrow}
                    />
                )}

                {children && (
                    <DividerText
                        textColor={resolvedTextColor}
                        isVertical={isVertical}
                        textLevel={textLevel}
                        textPadding={textPadding}
                    >
                        {children}
                    </DividerText>
                )}

                {showSecondLine && (
                    <DividerLine
                        isVertical={isVertical}
                        lineColor={resolvedLineColor}
                        variant={variant}
                        grow={secondLineGrow}
                    />
                )}
            </DividerWrapper>
        );
    },
);

Divider.displayName = "Divider";

export { Divider };
