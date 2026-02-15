// TODO: Adding todo here so it counts for all components,
//  start using more css variables, rather than relying mostly
//  on js for styling. This will allow for more flexibility and easier
//  theming in the future. For example, instead of hardcoding
//  colors in the component styles, we can use CSS variables that can be easily overridden by themes or user preferences.
//  We started using it in Switch component right now, but it would be good to expand this approach to other components as well.

// Components

export * from "./Avatar/Avatar";
export * from "./Avatar/Avatar.types";

export * from "./Box/Box";
export type * from "./Box/Box.types";

export * from "./Button/Button";
export type * from "./Button/Button.types";

export * from "./ButtonGroup/ButtonGroup";
export type * from "./ButtonGroup/ButtonGroup.types";

export * from "./CssBaseline/CssBaseline";

export * from "./Drawer/Drawer";
export type * from "./Drawer/Drawer.types";

export * from "./DecoratorWrapper/DecoratorWrapper";

export * from "./Checkbox/Checkbox";
export type * from "./Checkbox/Checkbox.types";

export * from "./CheckboxGroup/CheckboxGroup";
export type * from "./CheckboxGroup/CheckboxGroup.types";

export * from "./CircularProgress/CircularProgress";
export type * from "./CircularProgress/CircularProgress.types";

export * from "./Divider/Divider";
export type * from "./Divider/Divider.types";

export * from "./IconButton/IconButton";
export * from "./IconButton/IconButton.helpers";
export type * from "./IconButton/IconButton.types";

export * from "./Input/Input";
export type * from "./Input/Input.types";

export * from "./InputColor/InputColor";
export type * from "./InputColor/InputColor.types";

export * from "./InputDefault/InputDefault";

export * from "./InputDecoratorWrapper/InputDecoratorWrapper";

export * from "./InputNumber/InputNumber";
export type * from "./InputNumber/InputNumber.types";

export * from "./InputPassword/InputPassword";
export type * from "./InputPassword/InputPassword.types";

export * from "./InputRoot/InputRoot";
export type * from "./InputRoot/InputRoot.types";

export * from "./LinearProgress/LinearProgress";
export type * from "./LinearProgress/LinearProgress.types";

export * from "./Link/Link";
export type * from "./Link/Link.types";

export * from "./List/List";
export type * from "./List/List.types";
export * from "./ListItem/ListItem";
export type * from "./ListItem/ListItem.types";
export * from "./ListItemButton/ListItemButton";
export type * from "./ListItemButton/ListItemButton.types";

export * from "./Modal/Modal";
export type * from "./Modal/Modal.types";

export * from "./Paper/Paper";
export type * from "./Paper/Paper.types";

export * from "./Popover/Popover";
export type * from "./Popover/Popover.types";

export * from "./Portal/Portal";
export type * from "./Portal/Portal.types";

export * from "./Radio/Radio";
export type * from "./Radio/Radio.types";

export * from "./RadioGroup/RadioGroup";
export type * from "./RadioGroup/RadioGroup.types";

export * from "./Slider/Slider";
export type * from "./Slider/Slider.types";

export * from "./Select/Select";
export type * from "./Select/Select.types";

export * from "./Switch/Switch";
export type * from "./Switch/Switch.types";

export * from "./Option/Option";
export type * from "./Option/Option.types";

// Stack does not have a separate type file as it uses BoxProps and it just sets the display property to flex
// or inline-flex (when inline prop is provided similar to Box).
export * from "./Stack/Stack";

export * from "./Textarea/Textarea";
export type * from "./Textarea/Textarea.types";

export * from "./Tooltip/Tooltip";
export type * from "./Tooltip/Tooltip.types";

export * from "./Typography/Typography";
export type * from "./Typography/Typography.types";

export * from "./ThemeProvider";
export * from "./useTheme";
