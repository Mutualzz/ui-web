import {
    Alpha,
    hsvaToHex,
    hsvaToRgbaString,
    Hue,
    Saturation,
} from "@mutualzz/color-picker";
import {
    clamp,
    type ColorLike,
    computeInsertedStopPosition,
    constructLinearGradient,
    createColor,
    handleColor,
    type HsvaColor,
    randomColor,
    snap,
} from "@mutualzz/ui-core";
import {
    forwardRef,
    type PointerEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { MdClose } from "react-icons/md";
import { Slider } from "../Slider/Slider";
import { Typography } from "../Typography/Typography";
import { Box } from "../Box/Box";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { Stack } from "../Stack/Stack";
import { useTheme } from "../useTheme";
import type { ColorPickerProps, GradientStop } from "./ColorPicker.types";
import { Pointer } from "./Pointer";
import { Paper } from "../Paper/Paper";
import {
    createPickerGradientStops,
    enforceMinGap,
    gradientStopsToLinearGradient,
    newStopId,
    sortStops,
    sortStopsStable,
} from "./ColorPicker.helpers";
import { FaPlus } from "react-icons/fa";

const DRAG_THRESHOLD_PX = 3;

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
            return createPickerGradientStops(color).stops;
        });

        const [selectedStopId, setSelectedStopId] = useState<string | null>(
            () => {
                const idx =
                    typeof currentStopProp === "number" ? currentStopProp : 0;
                return stops[idx]?.id ?? stops[0]?.id ?? null;
            },
        );

        const currentStop = useMemo(() => {
            if (!selectedStopId) return 0;
            const idx = stops.findIndex((s) => s.id === selectedStopId);
            return idx === -1 ? 0 : idx;
        }, [stops, selectedStopId]);

        const [rotation, setRotation] = useState(() =>
            createPickerGradientStops(color).angle,
        );

        const lastSyncedColor = useRef<typeof color>(color);
        const barRef = useRef<HTMLDivElement>(null);

        const [draggingId, setDraggingId] = useState<string | null>(null);
        const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
        const activePointerId = useRef<number | null>(null);

        const pointerDownRef = useRef<{
            pointerId: number;
            startX: number;
            dragging: boolean;
            stopId: string;
        } | null>(null);

        const emitSingleOrGradient = (
            nextStops: GradientStop[],
            stopIndex = currentStop,
        ) => {
            if (allowGradient && nextStops.length > 1) {
                onChange?.(
                    gradientStopsToLinearGradient(rotation, nextStops),
                    stopIndex,
                );
                return;
            }

            const stop = nextStops[stopIndex] ?? nextStops[0];
            if (!stop) return;
            onChange?.(handleColor(stop), stopIndex);
        };

        const changeStopById = (id: string) => {
            const idx = stops.findIndex((s) => s.id === id);
            if (idx === -1) return;

            setSelectedStopId(id);
            onStopChange?.(idx);
        };

        const handlePointerDown = (e: PointerEvent, id: string) => {
            if (!barRef.current) return;

            changeStopById(id);

            activePointerId.current = e.pointerId;
            pointerDownRef.current = {
                pointerId: e.pointerId,
                startX: e.clientX,
                dragging: false,
                stopId: id,
            };
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!barRef.current) return;
            if (activePointerId.current !== e.pointerId) return;

            const info = pointerDownRef.current;
            if (!info) return;

            if (!info.dragging) {
                const dx = Math.abs(e.clientX - info.startX);
                if (dx < DRAG_THRESHOLD_PX) return;

                info.dragging = true;
                pointerDownRef.current = info;

                setDraggingId(info.stopId);
                barRef.current.setPointerCapture(e.pointerId);
            }

            const activeId = info.stopId;
            if (!activeId) return;

            const rect = barRef.current.getBoundingClientRect();
            const rawPercent = snap(
                clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100),
                0.1,
            );

            setStops((prev) => {
                const moved = prev.find((s) => s.id === activeId);
                if (!moved) return prev;

                const nextPos = enforceMinGap(prev, activeId, rawPercent);

                const next = prev.map((s) =>
                    s.id === activeId ? { ...s, position: nextPos } : s,
                );

                emitSingleOrGradient(next);
                return next;
            });
        };

        const endDrag = (e: PointerEvent) => {
            if (!barRef.current) return;
            if (activePointerId.current !== e.pointerId) return;

            try {
                barRef.current.releasePointerCapture(e.pointerId);
            } catch {
                // ignore
            }

            setStops((prev) => {
                if (!draggingId) return prev;
                const sorted = sortStopsStable(prev);

                const newIndex = sorted.findIndex((s) => s.id === draggingId);
                if (newIndex !== -1) {
                    setSelectedStopId(draggingId);
                    onStopChange?.(newIndex);
                }

                emitSingleOrGradient(sorted);
                return sorted;
            });

            activePointerId.current = null;
            pointerDownRef.current = null;
            setDraggingId(null);
        };

        useEffect(() => {
            if (allowGradient && stops.length > 1) return;
            if (lastSyncedColor.current === color) return;

            const parsed = createPickerGradientStops(
                color,
                stops.map((stop) => stop.id),
            );

            setStops((prev) => {
                const sorted = sortStops(parsed.stops);

                setSelectedStopId((prevId) => {
                    if (prevId && sorted.some((s) => s.id === prevId)) {
                        return prevId;
                    }
                    return sorted[0]?.id ?? null;
                });

                return sorted;
            });

            setRotation(parsed.angle);

            lastSyncedColor.current = color;
        }, [color, allowGradient, stops.length]);

        const hsva = useMemo(
            () =>
                stops[currentStop] ||
                stops[stops.length - 1] ||
                handleColor(randomColor("hsv")).hsv,
            [stops, currentStop],
        );

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

            const addedId = newStopId();

            setStops((prev) => {
                const nextRaw: GradientStop[] = [
                    ...prev,
                    {
                        ...base,
                        id: addedId,
                        h: (base.h + 40) % 360,
                        position: computeInsertedStopPosition(
                            prev,
                            selectedStopId ?? prev[currentStop]?.id ?? "",
                        ),
                    },
                ];

                const nextPosition = enforceMinGap(
                    nextRaw,
                    addedId,
                    nextRaw[nextRaw.length - 1]?.position ?? 100,
                );

                const next = nextRaw.map((stop) =>
                    stop.id === addedId
                        ? { ...stop, position: nextPosition }
                        : stop,
                );

                const sorted = sortStops(next);
                const newIndex = sorted.findIndex((s) => s.id === addedId);

                setSelectedStopId(addedId);
                onStopChange?.(newIndex === -1 ? sorted.length - 1 : newIndex);
                emitSingleOrGradient(
                    sorted,
                    newIndex === -1 ? sorted.length - 1 : newIndex,
                );

                return sorted;
            });
        };

        const removeStop = () => {
            if (stops.length <= 1) return;

            setStops((prev) => {
                const next = prev.filter((_, i) => i !== currentStop);
                const sorted = sortStops(next);

                emitSingleOrGradient(
                    sorted,
                    Math.min(currentStop, sorted.length - 1),
                );

                return sorted;
            });
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
            if (allowGradient && stops.length > 1) {
                onChange?.(
                    gradientStopsToLinearGradient(newRotation, stops),
                    currentStop,
                );
            }
        };

        const previewColor =
            stops.length > 1
                ? gradientStopsToLinearGradient(rotation, stops)
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
                        onPointerMove={handlePointerMove}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                        css={{
                            background: previewColor,
                            position: "relative",
                            touchAction: "none",
                        }}
                    >
                        {stops.length > 1 &&
                            stops.map((stop, i) => {
                                const { position, ...hsvaOnly } = stop;
                                return (
                                    <Box
                                        key={stop.id}
                                        width={24}
                                        tabIndex={0}
                                        role="button"
                                        css={{
                                            position: "absolute",
                                            left: `${stop.position}%`,
                                            top: "50%",
                                            transform: "translate(-50%, -50%)",
                                            background: hsvaToHex(hsvaOnly),
                                            cursor:
                                                draggingId === stop.id
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
                                        onPointerDown={(e) =>
                                            handlePointerDown(e, stop.id)
                                        }
                                        onDragStart={(e) => e.preventDefault()}
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
