import {Alpha, hsvaToHex, hsvaToRgbaString, Hue, Saturation,} from "@mutualzz/color-picker";
import {
    type ColorLike,
    constructLinearGradient,
    createColor,
    handleColor,
    type HsvaColor,
    randomColor,
} from "@mutualzz/ui-core";
import {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {FaPlus} from "react-icons/fa";
import {MdClose} from "react-icons/md";
import {Slider} from "Slider/Slider";
import {Typography} from "Typography/Typography";
import {Box} from "../Box/Box";
import {Button} from "../Button/Button";
import {IconButton} from "../IconButton/IconButton";
import {toGradientStops} from "../InputColor/InputColor.helpers";
import {Stack} from "../Stack/Stack";
import {useTheme} from "../useTheme";
import type {ColorPickerProps} from "./ColorPicker.types";
import {Pointer} from "./Pointer";
import {Paper} from "../Paper/Paper";

type GradientStop = HsvaColor & { position: number };

const distributePositions = <T extends object>(
    arr: T[],
): (T & { position: number })[] => {
    const n = arr.length;
    return arr.map((stop, i) => ({
        ...stop,
        position: n === 1 ? 0 : (i / (n - 1)) * 100,
    }));
};

// TODO: Add position labels when hovered or focused/dragged
const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
    (
        {
            onChange,
            currentStop: currentStopProp,
            onStopChange,
            color,
            allowGradient,
            allowAlpha,
            rotation: rotationProp = 90,
            onRotationChange,
            css,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const [stops, setStops] = useState<GradientStop[]>(() => {
            const baseStops = Array.isArray(color)
                ? color.map((c) => handleColor(c).hsva)
                : toGradientStops(color);
            const n = baseStops.length;
            return baseStops.map((stop, i) => ({
                ...stop,
                position: n === 1 ? 0 : (i / (n - 1)) * 100,
            }));
        });

        const currentStop =
            typeof currentStopProp === "number" ? currentStopProp : 0;
        const [rotation, setRotation] = useState(rotationProp);

        const lastSyncedColor = useRef<typeof color>(color);
        const barRef = useRef<HTMLDivElement>(null);

        const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
        const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

        const handleMouseDown = (i: number) => {
            setDraggingIndex(i);
        };

        useEffect(() => {
            if (draggingIndex === null) return;

            const handleMouseMove = (e: MouseEvent) => {
                if (!barRef.current) return;
                const rect = barRef.current.getBoundingClientRect();
                const percent = Math.min(
                    100,
                    Math.max(0, ((e.clientX - rect.left) / rect.width) * 100),
                );
                setStops((prev) => {
                    const next = [...prev];
                    next[draggingIndex] = {
                        ...next[draggingIndex],
                        position: percent,
                    };
                    emitSingleOrGradient(next);
                    return next;
                });
            };

            const handleMouseUp = () => setDraggingIndex(null);

            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);

            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            };
        }, [draggingIndex]);

        useEffect(() => {
            if (allowGradient && stops.length > 1) return;

            if (lastSyncedColor.current === color) return;

            const baseStops = Array.isArray(color)
                ? color.map((c) => handleColor(c).hsva)
                : toGradientStops(color);
            const n = baseStops.length;
            const next = baseStops.map((stop, i) => ({
                ...stop,
                position: n === 1 ? 0 : (i / (n - 1)) * 100,
            }));
            setStops(next);
            lastSyncedColor.current = color;
        }, [color, allowGradient, stops.length]);

        const hsva = useMemo(
            () =>
                stops[currentStop] ||
                stops[stops.length - 1] ||
                handleColor(randomColor("hsv")).hsv,
            [stops, currentStop],
        );

        const emitSingleOrGradient = (nextStops: GradientStop[]) => {
            if (allowGradient) {
                onChange?.(
                    nextStops.map(({ position, ...s }) => handleColor(s)),
                    currentStop,
                );
                return;
            }
            onChange?.(handleColor(nextStops[0]));
        };

        const handleChange = (value: HsvaColor) => {
            setStops((prev) => {
                const next = [...prev];
                next[currentStop] = { ...next[currentStop], ...value };
                emitSingleOrGradient(next);
                return next;
            });
        };

        const addStop = () => {
            if (stops.length === 5) return;
            const base = hsva;

            setStops((prev) => {
                const next = [
                    ...prev,
                    {
                        ...base,
                        h: (base.h + 40) % 360,
                    },
                ];
                const distributed = distributePositions(next);
                const newIndex = distributed.length - 1;
                onChange?.(
                    distributed.map((s) => handleColor(s)),
                    newIndex,
                );
                onStopChange?.(newIndex);
                return distributed;
            });
        };

        const removeStop = () => {
            if (stops.length <= 1) return;
            setStops((prev) => {
                const next = prev.filter((_, i) => i !== currentStop);
                const distributed = distributePositions(next);
                onChange?.(
                    distributed.map((s) => handleColor(s)),
                    Math.min(currentStop, distributed.length - 1),
                );
                return distributed;
            });
        };

        const changeStop = (stop: number) => {
            onStopChange?.(stop);
            onChange?.(
                stops.map((s) => handleColor(s)),
                stop,
            );
        };

        useEffect(() => {
            setRotation(rotationProp);
        }, [rotationProp]);

        const handleRotationChange = (
            _: any,
            newRotation: number | number[],
        ) => {
            if (Array.isArray(newRotation)) return;
            setRotation(newRotation);
            onRotationChange?.(newRotation);
        };

        const previewColor =
            stops.length > 1
                ? constructLinearGradient(
                      rotation,
                      stops.map(({ position, ...stop }) => ({
                          color: handleColor(stop).hex,
                          position,
                      })),
                  )
                : hsvaToHex(hsva);

        const getBorderColor = (stop: HsvaColor) =>
            createColor(handleColor(stop).hex).isLight()
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
                    <Box
                        ref={barRef}
                        width="100%"
                        height="2rem"
                        borderRadius={10}
                        p="1.25rem"
                        css={{
                            background: previewColor,
                            position: "relative",
                        }}
                    >
                        {stops.length > 1 &&
                            stops.map((stop, i) => {
                                const { position, ...hsvaOnly } = stop;
                                return (
                                    <Box
                                        key={`gradient-box-${i}`}
                                        width={24}
                                        css={{
                                            position: "absolute",
                                            left: `${stop.position}%`,
                                            top: "50%",
                                            transform: "translate(-50%, -50%)",
                                            background: hsvaToHex(hsvaOnly),
                                            cursor:
                                                draggingIndex === i
                                                    ? "grabbing"
                                                    : "grab",
                                            zIndex: currentStop === i ? 2 : 1,
                                            ...(currentStop === i && {
                                                "&::after": {
                                                    content: '""',
                                                    position: "absolute",
                                                    display: "block",
                                                    bottom: -5,
                                                    left: "50%",
                                                    transform:
                                                        "translateX(-50%)",
                                                    width: 0,
                                                    height: 0,
                                                    borderLeft:
                                                        "4px solid transparent",
                                                    borderRight:
                                                        "4px solid transparent",
                                                    borderTop: `4px solid ${getBorderColor(hsvaOnly)}`,
                                                    pointerEvents: "none",
                                                    zIndex: 1,
                                                },
                                            }),
                                        }}
                                        borderRadius={5}
                                        border={`1px solid ${getBorderColor(hsvaOnly)}`}
                                        height={24}
                                        onMouseDown={() => handleMouseDown(i)}
                                        onClick={() =>
                                            currentStop !== i && changeStop(i)
                                        }
                                        onMouseEnter={() => setHoveredIndex(i)}
                                        onMouseLeave={() =>
                                            setHoveredIndex(null)
                                        }
                                    >
                                        {(hoveredIndex === i ||
                                            currentStop === i) && (
                                            <Paper
                                                position="absolute"
                                                top="-2.5rem"
                                                left="50%"
                                                padding="0.25rem 0.5rem"
                                                borderRadius={4}
                                                css={{
                                                    whiteSpace: "nowrap",
                                                    pointerEvents: "none",
                                                    transform:
                                                        "translateX(-50%)",
                                                }}
                                            >
                                                <Typography level="body-sm">
                                                    {Math.round(stop.position)}%
                                                </Typography>
                                            </Paper>
                                        )}
                                    </Box>
                                );
                            })}
                    </Box>
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
                {allowGradient && stops.length > 1 && (
                    <Stack direction="column" spacing={2} width="100%" mt={2}>
                        <Typography level="body-sm" textColor="secondary">
                            Rotation: {rotation}°
                        </Typography>
                        <Slider
                            min={0}
                            max={360}
                            step={1}
                            value={rotation}
                            onChange={handleRotationChange}
                        />
                    </Stack>
                )}
            </Stack>
        );
    },
);

export { ColorPicker };
