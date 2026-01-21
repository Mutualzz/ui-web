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
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Slider } from "Slider/Slider";
import { Typography } from "Typography/Typography";
import { Box } from "../Box/Box";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { toGradientStops } from "../InputColor/InputColor.helpers";
import { Stack } from "../Stack/Stack";
import { useTheme } from "../useTheme";
import type { ColorPickerProps, GradientStop } from "./ColorPicker.types";
import { Pointer } from "./Pointer";
import { Paper } from "../Paper/Paper";
import {
    distributePositions,
    newStopId,
    sortStops,
} from "./ColorPicker.helpers";

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
            const baseStops = Array.isArray(color)
                ? color.map((c) => handleColor(c).hsva)
                : toGradientStops(color);

            const n = baseStops.length;
            const withIds = baseStops.map((stop, i) => ({
                ...stop,
                id: newStopId(),
                position: n === 1 ? 0 : (i / (n - 1)) * 100,
            }));

            return sortStops(withIds);
        });

        const currentStop =
            typeof currentStopProp === "number" ? currentStopProp : 0;
        const [rotation, setRotation] = useState(rotationProp);

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

        const emitSingleOrGradient = (nextStops: GradientStop[]) => {
            if (allowGradient) {
                onChange?.(
                    nextStops.map(({ position, id, ...s }) => handleColor(s)),
                    currentStop,
                );
                return;
            }
            onChange?.(handleColor(nextStops[0]));
        };

        const changeStop = (stop: number) => {
            onStopChange?.(stop);
            onChange?.(
                stops.map(({ position, id, ...s }) => handleColor(s)),
                stop,
            );
        };

        const selectStopById = (id: string) => {
            const idx = stops.findIndex((s) => s.id === id);
            if (idx === -1) return;
            if (idx !== currentStop) changeStop(idx);
        };

        const handlePointerDown = (e: PointerEvent, id: string) => {
            if (!barRef.current) return;

            selectStopById(id);

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
            const percent = snap(
                clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100),
                0.1,
            );

            setStops((prev) => {
                const moved = prev.find((s) => s.id === activeId);
                if (!moved) return prev;

                const updated = prev.map((s) =>
                    s.id === activeId ? { ...s, position: percent } : s,
                );

                const next = sortStops(updated);

                const newIndex = next.findIndex((s) => s.id === activeId);
                if (newIndex !== -1 && newIndex !== currentStop) {
                    onStopChange?.(newIndex);
                }

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

            activePointerId.current = null;
            pointerDownRef.current = null;
            setDraggingId(null);
        };

        useEffect(() => {
            if (allowGradient && stops.length > 1) return;
            if (lastSyncedColor.current === color) return;

            const baseStops = Array.isArray(color)
                ? color.map((c) => handleColor(c).hsva)
                : toGradientStops(color);

            setStops((prev) => {
                const n = baseStops.length;
                const next = baseStops.map((stop, i) => ({
                    ...stop,
                    id: prev[i]?.id ?? newStopId(),
                    position: n === 1 ? 0 : (i / (n - 1)) * 100,
                }));
                return sortStops(next);
            });

            lastSyncedColor.current = color;
        }, [color, allowGradient, stops.length]);

        const hsva = useMemo(
            () =>
                stops[currentStop] ||
                stops[stops.length - 1] ||
                handleColor(randomColor("hsv")).hsv,
            [stops],
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
                        position: 100,
                    },
                ];

                const distributed = distributePositions(
                    nextRaw,
                ) as GradientStop[];

                const distributedWithIds: GradientStop[] = distributed.map(
                    (s, i) => ({
                        ...s,
                        id: nextRaw[i]?.id ?? s.id ?? newStopId(),
                    }),
                );

                const sorted = sortStops(distributedWithIds);
                const newIndex = sorted.findIndex((s) => s.id === addedId);

                onChange?.(
                    sorted.map(({ position, id, ...s }) => handleColor(s)),
                    newIndex === -1 ? sorted.length - 1 : newIndex,
                );
                onStopChange?.(newIndex === -1 ? sorted.length - 1 : newIndex);

                return sorted;
            });
        };

        const removeStop = () => {
            if (stops.length <= 1) return;

            setStops((prev) => {
                const next = prev.filter((_, i) => i !== currentStop);
                const distributed = distributePositions(next) as GradientStop[];
                const sorted = sortStops(distributed);

                onChange?.(
                    sorted.map(({ position, id, ...s }) => handleColor(s)),
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
        };

        const previewColor =
            stops.length > 1
                ? constructLinearGradient(
                      rotation,
                      stops.map(({ position, id, ...stop }) => ({
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
