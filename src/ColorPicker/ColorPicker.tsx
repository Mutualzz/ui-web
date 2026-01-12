import {
    Alpha,
    hexToHsva,
    hsvaToHex,
    hsvaToRgbaString,
    Hue,
    Saturation,
} from "@mutualzz/color-picker";
import {
    constructLinearGradient,
    createColor,
    handleColor,
    randomColor,
    type ColorLike,
    type HsvaColor,
} from "@mutualzz/ui-core";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Box } from "../Box/Box";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { toGradientStops } from "../InputColor/InputColor.helpers";
import { Stack } from "../Stack/Stack";
import { useTheme } from "../useTheme";
import type { ColorPickerProps } from "./ColorPicker.types";
import { Pointer } from "./Pointer";

const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
    (
        {
            onChange,
            onStopChange,
            color,
            allowGradient,
            allowAlpha,
            css,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const [stops, setStops] = useState<HsvaColor[]>(() =>
            Array.isArray(color)
                ? color.map((c) => handleColor(c).hsva)
                : toGradientStops(color),
        );
        const [currentStop, setCurrentStop] = useState(0);

        const lastSyncedColor = useRef<typeof color>(color);

        useEffect(() => {
            if (allowGradient && stops.length > 1) return;

            if (lastSyncedColor.current === color) return;

            const next = Array.isArray(color)
                ? color.map((c) => handleColor(c).hsva)
                : toGradientStops(color);
            setStops(next);
            setCurrentStop((i) => Math.min(i, next.length - 1));
            lastSyncedColor.current = color;
        }, [color, allowGradient, stops.length]);

        const hsva = useMemo(() => {
            const c =
                stops[currentStop] ??
                stops[stops.length - 1] ??
                handleColor(randomColor("hsv")).hsv;
            return c;
        }, [stops, currentStop]);

        const emitSingleOrGradient = (nextStops: HsvaColor[]) => {
            if (allowGradient) {
                onChange?.(
                    nextStops.map((s) => handleColor(s)),
                    currentStop,
                );
                return;
            }
            onChange?.(handleColor(nextStops[0]));
        };

        const handleChange = (value: HsvaColor) => {
            setStops((prev) => {
                const next = [...prev];
                next[currentStop] = value;
                emitSingleOrGradient(next);
                return next;
            });
        };

        const addStop = () => {
            if (stops.length === 5) return;
            const base = hsva ?? hexToHsva(theme.colors.background);
            const newStop: HsvaColor = {
                ...base,
                h: ((base.h ?? 0) + 40) % 360,
            };

            setStops((prev) => {
                const next = [...prev, newStop];
                // After add, we’re definitely a gradient—emit gradient only
                onChange?.(
                    next.map((s) => handleColor(s)),
                    stops.length,
                );
                return next;
            });
            setCurrentStop(() => stops.length); // focus the new stop
        };

        const removeStop = () => {
            if (stops.length <= 1) return;
            setStops((prev) => {
                const next = prev.filter((_, i) => i !== currentStop);
                onChange?.(
                    next.map((s) => handleColor(s)),
                    Math.min(currentStop, next.length - 1),
                );
                return next;
            });
            setCurrentStop((i) =>
                Math.max(0, Math.min(i - 1, stops.length - 2)),
            );
        };

        const changeStop = (stop: number) => {
            setCurrentStop(stop);
            onStopChange?.(stop);
            onChange?.(
                stops.map((s) => handleColor(s)),
                stop,
            );
        };

        const previewColor =
            stops.length > 1
                ? constructLinearGradient(
                      90,
                      stops.map((stop) => handleColor(stop).hex),
                  )
                : hsvaToHex(hsva);

        const getBorderColor = (stop: HsvaColor) =>
            createColor(handleColor(hsva).hex).isLight()
                ? theme.colors.common.black
                : theme.colors.common.white;

        return (
            <Stack
                direction="column"
                ref={ref}
                css={css}
                width={200}
                position="relative"
                spacing={2}
                {...props}
            >
                {allowGradient && (
                    <Stack
                        width="100%"
                        height="2rem"
                        borderRadius={10}
                        p="1.25rem"
                        justifyContent="space-between"
                        alignItems="center"
                        css={{
                            background: previewColor,
                        }}
                    >
                        {stops.length > 1 &&
                            stops.map((stop, i) => (
                                <Box
                                    key={`gradient-box-${i}`}
                                    width={24}
                                    css={{
                                        position: "relative",
                                        background: hsvaToHex(stop),
                                        cursor:
                                            currentStop === i
                                                ? "default"
                                                : "pointer",

                                        ...(currentStop === i && {
                                            "&::after": {
                                                content: '""',
                                                position: "absolute",
                                                display: "block",
                                                bottom: -5,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: 0,
                                                height: 0,
                                                borderLeft:
                                                    "4px solid transparent",
                                                borderRight:
                                                    "4px solid transparent",
                                                borderTop: `4px solid ${getBorderColor(stop)}`,
                                                pointerEvents: "none",
                                                zIndex: 1,
                                            },
                                        }),
                                    }}
                                    borderRadius={5}
                                    border={`1px solid ${getBorderColor(stop)}`}
                                    height={24}
                                    onClick={() =>
                                        currentStop !== i && changeStop(i)
                                    }
                                />
                            ))}
                    </Stack>
                )}
                <Saturation
                    hsva={hsva}
                    radius="8px 8px 0 0"
                    css={{
                        width: "auto",
                        height: 150,
                        minWidth: 120,
                        borderBottom: "12px solid #000",
                    }}
                    pointer={({ left, top }) => (
                        <Pointer css={{ left, top }} color={hsvaToHex(hsva)} />
                    )}
                    onChange={(newColor) =>
                        handleChange({ ...hsva, ...newColor })
                    }
                />
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    direction="row"
                    spacing={2.5}
                >
                    <Hue
                        hue={hsva.h}
                        height={24}
                        css={{
                            flex: 1,
                        }}
                        radius={!allowAlpha ? "0 0 8px 8px" : 0}
                        onChange={(newHue) =>
                            handleChange({ ...hsva, ...newHue })
                        }
                        pointer={({ left }) => (
                            <Pointer
                                css={{
                                    left,
                                    transform: "translate(-16px, -3px)",
                                }}
                                color={
                                    `hsl(${hsva.h || 0}deg 100% 50%)` as ColorLike
                                }
                            />
                        )}
                    />
                    {allowGradient && stops.length > 1 && (
                        <IconButton
                            size="lg"
                            variant="plain"
                            color="danger"
                            onClick={() => removeStop()}
                            css={{
                                padding: 0,
                            }}
                        >
                            <MdClose />
                        </IconButton>
                    )}
                </Stack>
                {allowGradient && (
                    <Button
                        color="primary"
                        disabled={stops.length === 5}
                        onClick={() => addStop()}
                        startDecorator={<FaPlus />}
                        size="lg"
                    >
                        Add Color
                    </Button>
                )}
                {allowAlpha && (
                    <Alpha
                        hsva={hsva}
                        height={24}
                        radius="0 0 8px 8px"
                        pointer={({ left }) => (
                            <Pointer
                                css={{
                                    left,
                                    transform: "translate(-16px, -5px)",
                                }}
                                color={hsvaToRgbaString(hsva)}
                            />
                        )}
                        onChange={(newAlpha) =>
                            handleChange({ ...hsva, ...newAlpha })
                        }
                    />
                )}
            </Stack>
        );
    },
);

export { ColorPicker };
