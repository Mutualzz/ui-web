import {
    type Color,
    type ColorLike,
    type Responsive,
    type TypographyColor,
    type Variant,
} from "@mutualzz/ui-core";
import type { BoxProps } from "../Box/Box.types";

export type PaperVariant = Variant | "elevation";

export interface PaperProps extends Omit<BoxProps, "color"> {
    /**
     * The color of the Paper component.
     * Can be a color name or a color value.
     * @default "neutral"
     */
    color?: Responsive<Color | ColorLike>;
    /**
     * The text color of the Paper component.
     * Can be a color name or a color value.
     * @default "inherit"
     */
    textColor?: Responsive<TypographyColor | ColorLike | "inherit">;
    /**
     * The variant of the Paper component.
     * Can be "elevation", "solid", "outlined", "plain", or "soft".
     * @default "elevation"
     */
    variant?: Responsive<PaperVariant>;

    /**
     * Elevation level for the Paper component.
     * This is only applicable for the "elevation" variant.
     * It determines the shadow and background color.
     * @default 0
     */
    elevation?: Responsive<number>;

    /**
     * If true, the Paper will not have a translucent background.
     * Only applicable when a gradient theme is preset
     * @default false
     */
    nonTranslucent?: Responsive<boolean>;
}
