# Agent Guidelines

Eigen is Artsy's mobile app — a React Native (Expo) application for iOS and Android that powers the [Artsy](https://www.artsy.net) marketplace for discovering and collecting art.

Detailed docs live in `docs/` — reference them instead of duplicating here.

## Tech Stack

- **React Native** — Cross-platform mobile framework (preferred for all new features)
- **TypeScript** — Language (strict mode enabled)
- **Relay** — GraphQL data fetching (hooks preferred over HOCs)
- **GraphQL / Metaphysics** — Artsy's GraphQL API server
- **@artsy/palette-mobile** — Design system and reusable component toolkit
- **react-navigation** — Screen navigation and routing
- **Jest** — Test runner
- **@testing-library/react-native** — Component testing
- **Formik** — Form handling
- **FlashList** — Performant list rendering (preferred over FlatList)
- **react-native-reanimated / Moti** — Animations
- **react-native-keyboard-controller** — Keyboard management (never use RN's built-in `Keyboard` API)
- **Yarn 4** — Package manager
- **CircleCI / GitHub Actions** — CI/CD and builds
- **Objective-C / Swift / Kotlin / Java** — Native bridging and platform-specific features only

## Common Commands

- `yarn type-check` — Run Relay compiler + TypeScript check
- `yarn relay` — Compile Relay GraphQL queries
- `yarn test <path>` — Run Jest tests for specific files
- `yarn lint --fix <path>` — Lint and auto-fix TypeScript files
- `yarn start` — Start Metro bundler + Relay watcher
- `yarn ios` — Run iOS app in simulator
- `yarn android` — Run Android app in emulator

## Pre-Commit Verification

Before every commit, verify code quality on changed files:

```sh
yarn tsc
yarn test --findRelatedTests <changed-files>
yarn lint <changed-files>
```

Never commit code that fails these checks. The repo uses `lint-staged` via a husky pre-commit hook.

## Code Style & Common Patterns

@docs/best_practices.md

## File Organization

```
src/
├── app/
│   ├── Scenes/          # Top-level screens (PascalCase: Artwork, Search, Sale, etc.)
│   │   └── MyScreen/
│   │       ├── MyScreen.tsx
│   │       ├── Components/        # Screen-specific components
│   │       ├── hooks/             # Screen-specific hooks and mutations
│   │       ├── utils/             # Screen-specific utilities
│   │       └── __tests__/
│   ├── Components/      # Shared components across scenes
│   ├── Navigation/      # Route definitions and navigation setup
│   ├── NativeModules/   # Native bridge modules
│   ├── store/           # Global state management
│   ├── system/          # Framework-level code (navigation helpers, etc.)
│   └── utils/           # Shared utilities
├── __generated__/       # Relay-generated artifacts (do not edit)
data/
├── schema.graphql       # Metaphysics GraphQL schema
└── complete.queryMap.json  # Relay persisted queries
docs/                    # Project documentation
ios/                     # iOS native code and Xcode workspace
android/                 # Android native code and Gradle project
```

## Workflow

- Do not import components/hooks/functions directly from a different Scene — extract shared code to `src/app/Components/` or `src/app/utils/`
- When adding a screen with a corresponding artsy.net page, match the route path and enable deep linking (add to `AndroidManifest.xml` for Android)
- Use independent `NavigationContainer` stacks for context-specific flows (multi-step forms, modal sequences) rather than adding global routes
- Run `yarn relay` after modifying any GraphQL queries or fragments
- Sync the GraphQL schema with `yarn sync-schema` when Metaphysics changes

## Gotchas

- `yarn pod-install` may fail on first run due to a cocoapods-keys bug — re-run to fix
- Legacy `@ts-expect-error STRICTNESS_MIGRATION` comments exist throughout the codebase — remove them when touching affected code, but only if it's a straightforward change.
- Relay artifacts go in `src/__generated__/` (configured in `relay.config.js`) — never edit these
- Some native screens still exist in Obj-C/Swift (Live Auctions, AR View In Room)

## Further Documentation

- [Getting Started](docs/getting_started.md)
- [Best Practices](docs/best_practices.md)
- [Testing](docs/testing.md)
- [Fetching Data](docs/fetching_data.md)
- [Adding a New Route](docs/adding_a_new_route.md)
- [Adding a New Screen](docs/add_a_new_screen.md)
- [Routing](docs/routing.md)
- [Analytics & Tracking](docs/analytics_and_tracking.md)
- [Keyboard Management](docs/best_practices.md#keyboard-management)
