import type {
    Color,
    ColorLike,
    Responsive,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import {
    formatColor,
    resolveResponsiveMerge,
    styled,
    themeColorVar,
    typographyColorVar,
} from "@mutualzz/ui-core";
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
    type PointerEvent as ReactPointerEvent,
    Fragment,
} from "react";
import {
    resolveSliderLabelSize,
    resolveSliderThumbSize,
    resolveSliderThumbStyles,
    resolveSliderTickSize,
    resolveSliderTrackStyles,
    resolveSliderTrackThickness,
} from "./Slider.helpers";
import type {
    SliderMark,
    SliderOrientation,
    SliderProps,
} from "./Slider.types";

const SliderRoot = styled("div")<{
    orientation: Responsive<SliderOrientation>;
    disabled?: boolean;
}>(({ theme, orientation, disabled }) => ({
    position: "relative",
    display: "inline-block",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    touchAction: "none",
    userSelect: "none",
    ...resolveResponsiveMerge(
        theme,
        { orientation },
        ({ orientation: ori }) => ({
            ...(ori === "horizontal"
                ? {
                      width: "100%",
                  }
                : {
                      height: "100%",
                  }),
            flexDirection: orientation === "vertical" ? "column" : "row",
        }),
    ),
}));

SliderRoot.displayName = "SliderRoot";

const TrackContainer = styled("div")<{
    orientation: Responsive<SliderOrientation>;
    size: Responsive<Size | SizeValue | number>;
}>(({ theme, orientation, size }) => {
    const trackStyles = resolveResponsiveMerge(
        theme,
        {
            orientation,
            size,
        },
        ({ orientation: ori, size: s }) => {
            const trackThickness = resolveSliderTrackThickness(theme, s);
            return {
                ...(ori === "horizontal"
                    ? { height: trackThickness, width: "100%" }
                    : { width: trackThickness, height: "100%" }),
            };
        },
    );

    return {
        position: "relative",
        flexGrow: 1,
        borderRadius: 9999,
        ...trackStyles,
    };
});

TrackContainer.displayName = "TrackContainer";

const TrackSegment = styled("div")<{
    orientation: Responsive<SliderOrientation>;
    start: number;
    end: number;
}>(({ theme, orientation, start, end }) => ({
    ...resolveResponsiveMerge(
        theme,
        { orientation },
        ({ orientation: ori }) => ({
            ...(ori === "horizontal"
                ? {
                      left: `${start}%`,
                      width: `${end - start}%`,
                      top: 0,
                      height: "100%",
                  }
                : {
                      bottom: `${start}%`,
                      height: `${end - start}%`,
                      left: 0,
                      width: "100%",
                  }),
        }),
    ),
    background: formatColor(theme.colors.neutral, {
        darken: 25,
        format: "hexa",
    }),
    position: "absolute",
    borderRadius: 9999,
}));

TrackSegment.displayName = "TrackSegment";

const TrackSegmentFilled = styled("div")<{
    color: Responsive<Color | ColorLike>;
    variant: Responsive<Variant>;
    orientation: Responsive<SliderOrientation>;
    start: number;
    end: number;
    hovered: boolean;
}>(({ theme, color, variant, orientation, start, end, hovered }) => ({
    position: "absolute",
    borderRadius: 9999,

    ...resolveResponsiveMerge(
        theme,
        {
            color,
            variant,
            orientation,
        },
        ({ color: c, variant: v, orientation: ori }) => ({
            ...(ori === "horizontal"
                ? {
                      left: `${start}%`,
                      width: `${end - start}%`,
                      top: 0,
                      height: "100%",
                  }
                : {
                      bottom: `${start}%`,
                      height: `${end - start}%`,
                      left: 0,
                      width: "100%",
                  }),
            ...resolveSliderTrackStyles(theme, c, hovered)[v],
        }),
    ),
}));

TrackSegmentFilled.displayName = "TrackSegmentFilled";

const Tick = styled("div")<{
    orientation: Responsive<SliderOrientation>;
    size: Responsive<Size | SizeValue | number>;
    percent: number;
}>(({ theme, percent, orientation, size }) => {
    const minClamp = 1; // percentage (in % of 100%)
    const maxClamp = 99; // clamp within [0.5%, 99.5%]
    const clampedPercent = Math.min(maxClamp, Math.max(minClamp, percent));
    const shift =
        percent <= minClamp ? "0%" : percent >= maxClamp ? "-100%" : "-50%";

    return {
        position: "absolute",
        backgroundColor: theme.colors.common.white,
        borderRadius: "50%",

        ...resolveResponsiveMerge(
            theme,
            {
                size,
                orientation,
            },
            ({ size: s, orientation: ori }) => ({
                ...resolveSliderTickSize(theme, s),
                ...(ori === "horizontal"
                    ? {
                          left: `${clampedPercent}%`,
                          top: "50%",
                          transform: `translate(${shift}, -50%)`,
                      }
                    : {
                          bottom: `${clampedPercent}%`,
                          left: "50%",
                          transform: "translate(-50%, 50%)",
                      }),
            }),
        ),
    };
});

Tick.displayName = "Tick";

const Thumb = styled("div")<{
    color: Responsive<Color | ColorLike>;
    variant: Responsive<Variant>;
    size: Responsive<Size | SizeValue | number>;
    percent: number;
    orientation: Responsive<SliderOrientation>;
    hovered: boolean;
}>(
    ({
        theme,
        color,
        variant,
        percent,
        orientation,
        size,
        hovered = false,
    }) => ({
        position: "absolute",
        borderRadius: "50%",
        backgroundClip: "content-box",
        boxSizing: "border-box",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        outline: "none",
        "&:focus-visible": {
            outline: `2px solid ${typographyColorVar("primary")}`,
            outlineOffset: 2,
        },
        ...resolveResponsiveMerge(
            theme,
            {
                color,
                variant,
                orientation,
                size,
            },
            ({ color: c, variant: v, orientation: ori, size: s }) => ({
                ...(ori === "horizontal"
                    ? { left: `${percent}%`, top: "50%" }
                    : { top: `${100 - percent}%`, left: "50%" }),
                ...resolveSliderThumbStyles(theme, c, hovered)[v],
                ...resolveSliderThumbSize(theme, s),
            }),
        ),
    }),
);

Thumb.displayName = "Thumb";

const ValueLabel = styled("span")<{
    orientation: Responsive<SliderOrientation>;
    percent: number;
    size: Responsive<Size | SizeValue | number>;
}>(({ theme, orientation, percent, size }) => {
    const { fontSize, thumbSize, resolvedOrientation } = resolveResponsiveMerge(
        theme,
        {
            size,
            orientation,
        },
        ({ size: s, orientation: ori }) => ({
            fontSize: resolveSliderLabelSize(theme, s),
            thumbSize: Number(resolveSliderThumbSize(theme, s).width),
            resolvedOrientation: ori,
        }),
    );

    const labelOffset = thumbSize + 20;
    const clampPercent = Math.min(Math.max(percent, 0), 100);

    return {
        textOverflow: "ellipsis",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform:
            resolvedOrientation === "horizontal"
                ? "translate(-50%, 0)"
                : "translate(-150%, 50%)",
        left: resolvedOrientation === "horizontal" ? `${clampPercent}%` : 0,
        top:
            resolvedOrientation === "horizontal"
                ? `-${labelOffset}px`
                : undefined,
        bottom:
            resolvedOrientation === "vertical" ? `${clampPercent}%` : undefined,
        fontSize,
        color: typographyColorVar("primary"),
        backgroundColor: themeColorVar("neutral"),
        padding: "2px 6px",
        borderRadius: 4,
        whiteSpace: "nowrap",
        zIndex: 2,
        pointerEvents: "none",
        userSelect: "none",

        "::after": {
            content: '""',
            position: "absolute",
            width: 0,
            height: 0,
            ...(resolvedOrientation === "horizontal"
                ? {
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",
                      borderTop: `5px solid ${themeColorVar("neutral")}`,
                  }
                : {
                      top: "50%",
                      right: 0,
                      transform: "translate(100%, -50%)",
                      borderTop: "5px solid transparent",
                      borderBottom: "5px solid transparent",
                      borderLeft: `5px solid ${themeColorVar("neutral")}`,
                  }),
        },
    };
});

ValueLabel.displayName = "ValueLabel";

const MarkLabel = styled("span")<{
    orientation: Responsive<SliderOrientation>;
    percent: number;
    size: Responsive<Size | SizeValue | number>;
}>(({ theme, orientation, percent, size }) => ({
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    color: typographyColorVar("accent"),
    whiteSpace: "nowrap",
    backgroundColor: "transparent",
    pointerEvents: "none",
    userSelect: "none",
    ...resolveResponsiveMerge(
        theme,
        { size, orientation },
        ({ size: s, orientation: ori }) => ({
            fontSize: resolveSliderLabelSize(theme, s),
            transform:
                ori === "horizontal"
                    ? "translate(-50%, 0.75rem)"
                    : "translate(0.75rem, -50%)",
            left: ori === "horizontal" ? `${percent}%` : "100%",
            top: ori === "vertical" ? `${100 - percent}%` : undefined,
        }),
    ),
}));

MarkLabel.displayName = "MarkLabel";

/**
 * Slider component for selecting a value within a range.
 * It supports both single and range selection.
 * It can be oriented horizontally or vertically.
 * It supports marks, value labels, and various styles.
 * The slider can be customized with different colors, variants, and sizes.
 * The component handles mouse and touch events for dragging the thumb.
 * It also supports controlled and uncontrolled states.
 * The `onChange` and `onChangeCommitted` callbacks are triggered during interaction.
 * The `disabled` prop can be used to disable the slider.
 * The `marks` prop can be used to display ticks at specific values.
 * The `valueLabelDisplay` prop controls when the value label is shown.
 * The `valueLabelFormat` prop can be used to format the value label text.
 */
const Slider = forwardRef<HTMLDivElement, SliderProps>(
    (
        {
            color = "primary",
            variant = "solid",
            size = "md",
            min = 0,
            max = 100,
            step = null,
            defaultValue,
            value,
            onChange,
            onChangeCommitted,
            orientation = "horizontal",
            disabled,
            marks,
            valueLabelDisplay = "off",
            valueLabelFormat,
            getAriaLabel,
            getAriaValueText,
            disableSwap,
            "aria-label": ariaLabel,
            "aria-labelledby": ariaLabelledBy,
            ...rest
        },
        ref,
    ) => {
        const internalRef = useRef<HTMLDivElement>(null);
        useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

        const isRange = Array.isArray(value ?? defaultValue);
        const [internalValue, setInternalValue] = useState<number[]>(
            isRange
                ? ((defaultValue as number[] | undefined) ?? [min, max])
                : [(defaultValue as number | undefined) ?? min],
        );
        const isControlled = value !== undefined;
        const currentValue = isControlled
            ? Array.isArray(value)
                ? value
                : [value]
            : internalValue;

        const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
        const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
        const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
        const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

        const percents = currentValue.map(
            (v) => ((v - min) / (max - min)) * 100,
        );
        const sortedPercents = [...percents].sort((a, b) => a - b);

        const resolvedMarks: SliderMark[] = useMemo(() => {
            if (marks === true) {
                const s = step ?? 1;
                const out: SliderMark[] = [];
                for (let i = min; i <= max; i += s) {
                    out.push({ value: i });
                }
                return out;
            } else if (Array.isArray(marks)) {
                const seen = new Set<number>();
                return marks.filter((mark) => {
                    if (seen.has(mark.value)) return false;
                    seen.add(mark.value);
                    return true;
                });
            }
            return [];
        }, [marks, min, max, step]);

        const snapToMarks = useCallback(
            (val: number) => {
                if (!Array.isArray(marks)) return val;

                const sorted = [min, max, ...marks.map((m) => m.value)]
                    .filter((v, i, a) => a.indexOf(v) === i) // deduplicate
                    .sort((a, b) => a - b);

                return sorted.reduce(
                    (closest, curr) =>
                        Math.abs(curr - val) < Math.abs(closest - val)
                            ? curr
                            : closest,
                    sorted[0],
                );
            },
            [marks],
        );

        const updateValue = useCallback(
            (index: number, requestedValue: number) => {
                if (disabled) return null;

                let nextThumbValue = Math.min(
                    Math.max(requestedValue, min),
                    max,
                );
                if (step === null) nextThumbValue = snapToMarks(nextThumbValue);

                if (isRange && disableSwap) {
                    if (index === 0 && nextThumbValue > currentValue[1])
                        return null;
                    if (index === 1 && nextThumbValue < currentValue[0])
                        return null;
                }

                const nextValues = [...currentValue];
                nextValues[index] = nextThumbValue;
                if (!isControlled) setInternalValue(nextValues);

                const syntheticEvent = {
                    target: { value: isRange ? nextValues : nextValues[0] },
                } as unknown as ChangeEvent<HTMLInputElement>;
                onChange?.(
                    syntheticEvent,
                    isRange ? nextValues : nextValues[0],
                );

                return nextValues;
            },
            [
                currentValue,
                disabled,
                min,
                max,
                step,
                isControlled,
                isRange,
                snapToMarks,
                onChange,
                disableSwap,
            ],
        );

        const getPositionValue = useCallback(
            (clientX: number, clientY: number) => {
                if (!internalRef.current) return null;
                const rect = internalRef.current.getBoundingClientRect();
                const pos =
                    orientation === "horizontal"
                        ? clientX - rect.left
                        : rect.bottom - clientY;
                const size =
                    orientation === "horizontal" ? rect.width : rect.height;
                const percent = Math.min(Math.max(pos / size, 0), 1);
                const raw = percent * (max - min) + min;
                const stepped =
                    step == null
                        ? Math.round(raw)
                        : Math.round(raw / step) * step;

                return Math.min(Math.max(stepped, min), max);
            },
            [orientation, min, max, step],
        );

        useEffect(() => {
            if (draggingIndex === null) return;

            const handlePointerMove = (event: PointerEvent) => {
                const pointerValue = getPositionValue(
                    event.clientX,
                    event.clientY,
                );
                if (pointerValue !== null) {
                    updateValue(draggingIndex, pointerValue);
                }
            };

            const handlePointerUp = (event: PointerEvent) => {
                setDraggingIndex(null);
                onChangeCommitted?.(
                    event,
                    isRange ? [...currentValue] : currentValue[0],
                );
            };

            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
            window.addEventListener("pointercancel", handlePointerUp);

            return () => {
                window.removeEventListener("pointermove", handlePointerMove);
                window.removeEventListener("pointerup", handlePointerUp);
                window.removeEventListener("pointercancel", handlePointerUp);
            };
        }, [
            draggingIndex,
            currentValue,
            updateValue,
            getPositionValue,
            onChangeCommitted,
            isRange,
        ]);

        const handleTrackPointerDown = (
            event: ReactPointerEvent<HTMLDivElement>,
        ) => {
            if (disabled || event.button !== 0) return;
            event.preventDefault();

            const clickedValue = getPositionValue(event.clientX, event.clientY);
            if (clickedValue === null) return;

            const indexToDrag =
                isRange &&
                Math.abs(currentValue[1] - clickedValue) <
                    Math.abs(currentValue[0] - clickedValue)
                    ? 1
                    : 0;

            updateValue(indexToDrag, clickedValue);
            setDraggingIndex(indexToDrag);
            thumbRefs.current[indexToDrag]?.focus();
        };

        const getNeighborMarkValue = (fromValue: number, direction: 1 | -1) => {
            const candidates = [
                min,
                max,
                ...resolvedMarks.map((mark) => mark.value),
            ]
                .filter((markValue) =>
                    direction === 1
                        ? markValue > fromValue
                        : markValue < fromValue,
                )
                .sort((first, second) => direction * (first - second));
            return candidates[0] ?? fromValue;
        };

        const handleThumbKeyDown = (
            event: KeyboardEvent<HTMLDivElement>,
            index: number,
        ) => {
            if (disabled) return;

            const thumbValue = currentValue[index];
            const keyboardStep = step ?? 1;
            const largeStep = Math.max(keyboardStep, (max - min) / 10);
            const usesMarks = step === null && Array.isArray(marks);

            let requestedValue: number;
            switch (event.key) {
                case "ArrowRight":
                case "ArrowUp":
                    requestedValue = usesMarks
                        ? getNeighborMarkValue(thumbValue, 1)
                        : thumbValue + keyboardStep;
                    break;
                case "ArrowLeft":
                case "ArrowDown":
                    requestedValue = usesMarks
                        ? getNeighborMarkValue(thumbValue, -1)
                        : thumbValue - keyboardStep;
                    break;
                case "PageUp":
                    requestedValue = thumbValue + largeStep;
                    break;
                case "PageDown":
                    requestedValue = thumbValue - largeStep;
                    break;
                case "Home":
                    requestedValue = min;
                    break;
                case "End":
                    requestedValue = max;
                    break;
                default:
                    return;
            }

            event.preventDefault();
            const nextValues = updateValue(index, requestedValue);
            if (nextValues) {
                onChangeCommitted?.(
                    event.nativeEvent,
                    isRange ? nextValues : nextValues[0],
                );
            }
        };

        return (
            <SliderRoot
                {...rest}
                ref={internalRef}
                disabled={disabled}
                orientation={orientation}
                onPointerDown={handleTrackPointerDown}
            >
                <TrackContainer orientation={orientation} size={size}>
                    {isRange ? (
                        <>
                            <TrackSegmentFilled
                                color={color}
                                variant={variant}
                                start={0}
                                end={sortedPercents[0]}
                                orientation={orientation}
                                hovered={hoveredIndex === 0}
                            />
                            <TrackSegment
                                start={sortedPercents[0]}
                                end={sortedPercents[1]}
                                orientation={orientation}
                            />
                            <TrackSegmentFilled
                                color={color}
                                variant={variant}
                                start={sortedPercents[1]}
                                end={100}
                                orientation={orientation}
                                hovered={hoveredIndex === 1}
                            />
                        </>
                    ) : (
                        <>
                            <TrackSegmentFilled
                                color={color}
                                variant={variant}
                                start={0}
                                end={sortedPercents[0]}
                                orientation={orientation}
                                hovered={hoveredIndex === 0}
                            />
                            <TrackSegment
                                start={sortedPercents[0]}
                                end={100}
                                orientation={orientation}
                            />
                        </>
                    )}

                    {resolvedMarks.map((mark, i) => {
                        const percent =
                            ((mark.value - min) / (max - min)) * 100;
                        return (
                            <Fragment key={`mark-${i}`}>
                                <Tick
                                    key={`tick-${i}`}
                                    orientation={orientation}
                                    percent={percent}
                                    size={size}
                                />
                                {marks !== true && (
                                    <MarkLabel
                                        percent={percent}
                                        orientation={orientation}
                                        key={`markLabel-${i}`}
                                        size={size}
                                    >
                                        {mark.label ?? mark.value}
                                    </MarkLabel>
                                )}
                            </Fragment>
                        );
                    })}

                    {currentValue.map((val, i) => (
                        <Fragment key={`thumb-${i}`}>
                            <Thumb
                                ref={(node) => {
                                    thumbRefs.current[i] = node;
                                }}
                                role="slider"
                                tabIndex={disabled ? -1 : 0}
                                aria-label={getAriaLabel?.(i) ?? ariaLabel}
                                aria-labelledby={ariaLabelledBy}
                                aria-valuemin={min}
                                aria-valuemax={max}
                                aria-valuenow={val}
                                aria-valuetext={getAriaValueText?.(val, i)}
                                aria-orientation={
                                    typeof orientation === "string"
                                        ? orientation
                                        : undefined
                                }
                                aria-disabled={disabled || undefined}
                                color={color}
                                variant={variant}
                                size={size}
                                percent={percents[i]}
                                hovered={hoveredIndex === i}
                                orientation={orientation}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onFocus={() => setFocusedIndex(i)}
                                onBlur={() => setFocusedIndex(null)}
                                onKeyDown={(event) =>
                                    handleThumbKeyDown(event, i)
                                }
                                onPointerDown={(event) => {
                                    if (disabled || event.button !== 0) return;
                                    event.stopPropagation();
                                    setDraggingIndex(i);
                                }}
                            />
                            {(valueLabelDisplay === "on" ||
                                (valueLabelDisplay === "auto" &&
                                    (draggingIndex === i ||
                                        hoveredIndex === i ||
                                        focusedIndex === i))) && (
                                <ValueLabel
                                    orientation={orientation}
                                    percent={percents[i]}
                                    size={size}
                                >
                                    {(() => {
                                        if (valueLabelFormat) {
                                            if (
                                                typeof valueLabelFormat ===
                                                "function"
                                            )
                                                return valueLabelFormat(val, i);
                                            else
                                                return valueLabelFormat
                                                    .replace(
                                                        "{value}",
                                                        val.toString(),
                                                    )
                                                    .replace(
                                                        "{index}",
                                                        i.toString(),
                                                    );
                                        }

                                        if (getAriaValueText)
                                            return getAriaValueText(val, i);

                                        return typeof val === "number"
                                            ? val.toFixed(0)
                                            : val;
                                    })()}
                                </ValueLabel>
                            )}
                        </Fragment>
                    ))}
                </TrackContainer>
            </SliderRoot>
        );
    },
);

Slider.displayName = "Slider";

export { Slider };
