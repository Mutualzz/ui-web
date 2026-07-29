# `@mutualzz/ui-web`

React + Emotion component library for the Mutualzz **desktop / web** app.

Built with [Emotion](https://emotion.sh/), sharing tokens and helpers with [`@mutualzz/ui-core`](https://github.com/mutualzz/ui-core). Themed surfaces and controls are meant to feel consistent with Mutualzz across platforms (see also [`@mutualzz/ui-native`](https://github.com/mutualzz/ui-native)).

Docs site: [mutualzz.com/ui](https://mutualzz.com/ui)

## Features

- Theme provider + `useTheme` (colors, typography, elevation)
- Customizable components with theme and per-instance color support
- Layout primitives (`Box`, `Stack`) and common inputs / feedback / overlays

## Package layout

| Package | Role |
|---|---|
| `@mutualzz/ui-core` | Shared theme tokens, color utils, types |
| `@mutualzz/ui-web` | Web / Electron React components (this package) |
| `@mutualzz/ui-native` | React Native components for mobile |

## Components (overview)

**Inputs** — Button, ButtonGroup, IconButton, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Slider, Select / Option, Input (and Default / Password / Number / Color / Root variants), Textarea

**Data display** — Avatar, Divider, List / ListItem / ListItemButton, Typography, Link

**Feedback** — CircularProgress, LinearProgress, Tooltip

**Surfaces & overlay** — Paper, Modal, Drawer, Popover, Portal

**Layout** — Box, Stack

**Theming** — ThemeProvider, CssBaseline, useTheme

Markdown input/renderer live in the Mutualzz app today, not in this package.

## Development

From the monorepo root:

```bash
pnpm --filter @mutualzz/ui-web build
pnpm --filter @mutualzz/ui-web dev
pnpm --filter @mutualzz/ui-web typecheck
```

Peer dependencies include React, Emotion (`@emotion/react`, `@emotion/styled`), and Floating UI where overlays need it — see `package.json`.

## Authors & credit

- [Azrael](https://github.com/mateie) — original author
- Community contributors are credited via git authorship, PR attribution, and changelogs (see [`CONTRIBUTING.md`](https://github.com/mutualzz/ui-web/blob/master/CONTRIBUTING.md))

## License & contributions

Source is available for transparency and community contributions. Contributors get credit for merged work.

- [`LICENSE`](https://github.com/mutualzz/ui-web/blob/master/LICENSE) — no unofficial redistribution / competing hosted services without permission
- [`CONTRIBUTING.md`](https://github.com/mutualzz/ui-web/blob/master/CONTRIBUTING.md) — how to fork, open PRs, and how credit works
