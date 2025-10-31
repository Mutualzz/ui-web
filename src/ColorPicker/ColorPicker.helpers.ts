import { hexToHsva } from "@mutualzz/color-picker";
import {
    extractColors,
    formatColor,
    randomColor,
    type ColorLike,
    type HsvaColor,
} from "@mutualzz/ui-core";

export const toStops = (color?: ColorLike | HsvaColor): HsvaColor[] => {
    if (!color) return [hexToHsva(randomColor("hex"))];

    if (typeof color !== "string") return [color];

    const extracted = extractColors(color);
    if (extracted?.length) {
        return extracted.map((c) =>
            hexToHsva(formatColor(c, { format: "hex" })),
        );
    }

    return [
        hexToHsva(
            formatColor(color, {
                format: "hex",
            }),
        ),
    ];
};
