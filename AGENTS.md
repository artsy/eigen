# Agent Guidelines

Eigen is Artsy's mobile app — a bare React Native application that uses the Expo sdk, available on both iOS and Android, that powers the [Artsy](https://www.artsy.net) marketplace for discovering and collecting art.

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
- `yarn ios:no-cache` — Run iOS app in simulator
- `yarn ios` — Run iOS app in simulator with build caching
- `yarn android:cached` — Run Android app in emulator (uses cached build)
- `yarn android` — Run Android app in emulator (full rebuild)
- `yarn clean` — Wipe caches/build artifacts (Gradle, watchman, Metro, CocoaPods, Xcode DerivedData, gems) and reinstall bare `node_modules`; does not run `setup:artsy`/`install:all`
- `yarn clean:light` — Same as `yarn clean` but skips the slower native-side steps (Gradle, watchman, DerivedData, gems) — quick JS-only reset
- `yarn repair` — Full fix-it workflow: `yarn clean && yarn setup:artsy && yarn install:all`
- `yarn repair:light` — Same as `yarn repair` but uses `yarn clean:light` for a faster reset

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

- When opening a pull request, always use the template at `docs/pull_request_template.md`
- Do not import components/hooks/functions directly from a different Scene — extract shared code to `src/app/Components/` or `src/app/utils/`
- When adding a screen with a corresponding artsy.net page, match the route path and enable deep linking (add to `AndroidManifest.xml` for Android)
- Use independent `NavigationContainer` stacks for context-specific flows (multi-step forms, modal sequences) rather than adding global routes
- Run `yarn relay` after modifying any GraphQL queries or fragments
- Sync the GraphQL schema with `yarn sync-schema` when Metaphysics changes

## End-to-End Testing (Maestro)

E2E flows live in `e2e/flows/` and run with [Maestro](https://maestro.mobile.dev/). See [`e2e/README.md`](e2e/README.md) for the full build/install/run steps.

- **Run locally:** `maestro test e2e/` runs all flows (reads `e2e/config.yml`); `maestro test e2e/flows/login.yml` runs a single flow. Do not run `maestro test *` — it tries to execute non-flow files (`config.yml`, `README.md`) and fails with `Commands Section Required`.
- **Version:** keep your local Maestro in sync with the CI pin (currently `2.6.1`, set in `.github/workflows/ios-e2e-maestro.yml`). Version drift causes local/CI behavior differences.
- **CI:** the daily "Build iOS QA App for Maestro" workflow publishes an app to S3, then "iOS E2E Tests (Maestro)" shards the flows across runners via `scripts/utils/run_maestro_shard`.
- **Flakiness handling:** flows depend on the real network and universal-link resolution, so the shard runner retries each flow once from a clean launch before failing. Structurally fragile flows listed in `NON_BLOCKING_FLOWS` (currently `deeplinks.yml`) still run and retry but only warn on failure instead of failing the shard.
- **Writing stable flows:** prefer `extendedWaitUntil` with an explicit `timeout` over bare `assertVisible` for anything that renders after a network fetch (e.g. the post-login HomeView). Keep any real-network setup in CI non-fatal so infra hiccups don't fail the run.

## Gotchas

- `yarn pod-install` may fail on first run due to a cocoapods-keys bug — re-run to fix
- Legacy `@ts-expect-error STRICTNESS_MIGRATION` comments exist throughout the codebase — remove them when touching affected code, but only if it's a straightforward change.
- Relay artifacts go in `src/__generated__/` (configured in `relay.config.js`) — never edit these
- Some native screens still exist in Obj-C/Swift (Live Auctions, AR View In Room)

## Further Documentation

- [Getting Started](docs/getting_started.md)
- [Best Practices](docs/best_practices.md)
- [Testing](docs/testing.md)
- [E2E Testing (Maestro)](e2e/README.md)
- [Fetching Data](docs/fetching_data.md)
- [Adding a New Route](docs/adding_a_new_route.md)
- [Adding a New Screen](docs/add_a_new_screen.md)
- [Routing](docs/routing.md)
- [Analytics & Tracking](docs/analytics_and_tracking.md)
- [Keyboard Management](docs/best_practices.md#keyboard-management)
- [Build Caching](docs/build_caching.md)
