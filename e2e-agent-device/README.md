# agent-device end-to-end

[agent-device](https://github.com/callstack/agent-device) by Callstack drives iOS simulators and Android emulators. These flows are deterministic `.ad` replay scripts that run without an LLM, alongside the existing [Maestro flows](../e2e/README.md). They cover the same scenarios (login, signup, deeplinks) and run on the same QA builds.

## How it runs in CI

| Platform | Workflow                                         | Triggered by                                          |
| -------- | ------------------------------------------------ | ----------------------------------------------------- |
| iOS      | `.github/workflows/ios-e2e-agent-device.yml`     | `Build iOS QA App for Maestro` succeeding (daily)     |
| Android  | `.github/workflows/android-e2e-agent-device.yml` | `Build Android QA App for Maestro` succeeding (daily) |

Both workflows can also be started manually from the Actions tab.

- Both download the same QA build from S3 as Maestro does, reuse `.env.maestro.<platform>` (the same test account), and run `scripts/utils/run_agent_device_suite <platform> <udid|serial>`.
- `login` and `signup` run first, then the rest, so a freshly booted simulator's slow first minutes land on the simplest flows (`FIRST_FLOWS` in the runner). In the iOS job, the simulator also starts booting right after checkout, so it settles during setup.
- Each flow gets up to 3 attempts. A flow that only passes on a retry is logged as flaky, with a warning on the run summary.
- At the end, the runner prints a summary like agent-device's own reporter. That's one `✓`/`⨯` line per flow with its time, then the flaky flows and the failures, with the error of every failed attempt. In CI it's also added to the run's summary page. Flow names come from each flow's `# @title` header.
- Failures are posted to `#mobile-alerts` with a screenshot (uploaded to S3, like Maestro's).
- Only `junit.xml` and `failures.json` are attached to the run as artifacts. This repo's artifacts are public, and agent-device's logs and screenshots can show the test account.

## Layout

- `flows/<name>.ad`: one script per scenario, shared by iOS and Android. The platform comes from the device passed to the runner.
- `flows/<name>.<ios|android>.ad`: a platform-only version, for a scenario that has to work differently on each platform. The `deeplink-*` flows are. `SKIP_FLOWS` uses the name without the suffix, e.g. `SKIP_FLOWS="deeplink-email deeplink-click"`.
- `reporters/failures.mjs`: a test reporter that writes the failed tests to `failures.json` for `scripts/ci/report-agent-device-test-failure`.

### Launch arguments

The flows need the same launch arguments as Maestro (`useMaestroInit`, `email`, `password`, `shouldSignOut`), read by `src/app/system/devTools/useMaestroInitialization.ts`. agent-device 0.21.31 accepts `open --launch-args` on the command line but drops it inside `.ad` scripts. So each flow declares its arguments in a header comment:

```
# @launch useMaestroInit=true email=${EMAIL} password=${PASSWORD}
```

Before each attempt, the runner (re)launches the app with those arguments: iOS process arguments via `xcrun simctl launch`, Android intent extras via `adb shell am start --es`. `${VAR}` values come from `AD_VAR_VAR`.

Each flow then starts with `open ${APP_ID}`, which attaches agent-device to the running app without restarting it, followed by a `wait` for the screen the launch arguments produce ("Sign up or log in" after `shouldSignOut`, `search-button` after `email`/`password`).

On Android, the runner first waits for that screen, using the flow's first `wait`, before starting the flow. It refuses to run flows whose first `wait` doesn't wait for a selector (`wait 2000`, `wait absent`, `wait stable`), because those would pass before the arguments were read. agent-device's `open` sends a new launch intent, and `MainActivity` (`singleTask`, calling `setIntent` in `onNewIntent`) would replace our intent extras with it. Once the screen is up, the arguments have been read. iOS process arguments can't be replaced, so iOS doesn't need this.

## Running locally

1. Install the pinned version used in CI: `npm install -g agent-device@0.21.31`, then `agent-device doctor`.
2. Get the app onto a booted device:
   - **iOS:** install the QA build CI uses. Download `s3://artsy-citadel/eigen/builds/ios/Artsy-latest.zip`, unzip it, then run `xcrun simctl install booted ./Artsy.app`. Then run `agent-device prepare ios-runner --platform ios --udid <udid> --timeout 900000` once, to build agent-device's test runner.
   - **Android:** run a local build with `yarn android` (the `MAESTRO_APP_ID` package is `net.artsy.app`) and keep Metro running. The QA APK on S3 is built for x86_64 only, for CI's emulator, so it won't install on Apple Silicon emulators or on physical phones (`INSTALL_FAILED_NO_MATCHING_ABIS`). Open the app once and dismiss any React Native warning overlay before running the suite.
   - **Android deeplinks:** a debug build can't verify App Links, because artsy.net's `assetlinks.json` only lists the release signing key, so its links open in Chrome. Mark the domains as verified for the local build with `adb shell pm set-app-links --package net.artsy.app 1 all`. Don't do this in CI, where verifying the release build is the point of the test.
3. Make sure `.env.maestro.<platform>` exists (`./scripts/setup/setup-env-for-maestro <platform>`), or export `MAESTRO_TEST_EMAIL`, `MAESTRO_TEST_PASSWORD` and optionally `MAESTRO_APP_ID`. Values in the file win over the shell.
4. Run the suite with `./scripts/utils/run_agent_device_suite ios` (or `android`). It uses the first booted simulator or emulator; pass a UDID or serial as the second argument to choose one.

Slack is only notified when `CI` is set.

To iterate on a single flow, launch the app with the flow's `@launch` arguments yourself, then replay it:

```sh
xcrun simctl launch --terminate-running-process booted net.artsy.qa -useMaestroInit true -shouldSignOut true
AD_VAR_APP_ID=net.artsy.qa AD_VAR_EMAIL=... AD_VAR_PASSWORD=... agent-device replay e2e-agent-device/flows/login.ad --platform ios
```

## Writing a flow

- Find selectors with `agent-device snapshot -i` on the screen you're automating. Prefer `id="..."` (React Native `testID`) or `label="..."` (`accessibilityLabel`) over visible text.
- `press`/`click`/`fill` don't wait for their target, so add a `wait '<selector>' <ms>` before interacting with a screen that loads.
- Use `${VAR}` for anything secret and pass it as `AD_VAR_VAR`. Never write credentials into a script.
- Flows must work on both platforms. Check selectors with `snapshot -i` on each. Only split a flow into `.ios.ad` and `.android.ad` when the platforms really have to behave differently.
- Give the flow a `# @title` header (e.g. `# @title Deeplink - Artist`); it's the name shown in the summary.
- Declare launch arguments in the `# @launch` header, not on `open`.
- Start with `open ${APP_ID}`, then a `wait` for a screen the launch arguments produce. The runner uses that first `wait` on Android, and rejects flows whose first `wait` isn't a selector wait.
- On iOS, `fill` can't clear a secure text field. For password fields, `press` the field and then `type`.
- An input without an accessibility label is matched by its placeholder with `text="..."` while it's empty, not with `label=`.
- Wait for the element you're about to use, not just a heading on its screen. A heading can appear before the field is ready, and neighbouring screens can share headings.
- After moving to a new screen, `wait absent` for the previous screen's field before pressing anything. On slower simulators both screens are on screen during the transition, so a selector like `label="Continue"` matches twice.
- Give the first `wait` a generous timeout (90s). The first launch on a cold CI simulator can take over a minute.
- See `agent-device help scripting` and `agent-device help test` for the full syntax.

## Deeplinks

Each link gets its own flow, so a failure retries only that link:

| Flow                  | Link                                  | Lands on                          |
| --------------------- | ------------------------------------- | --------------------------------- |
| `deeplink-artist`     | `https://artsy.net/artist/kaws`       | KAWS artist page                  |
| `deeplink-click`      | Braze `click.artsy.net` tracking link | "Highlights at Auction This Week" |
| `deeplink-email`      | SendGrid `email-link.artsy.net` link  | "Maestro Test Artwork, 2025"      |
| `deeplink-logged-out` | the artist link, while logged out     | login, then the KAWS artist page  |

Every link is a cold start, like Maestro's `killApp`. `close ${APP_ID}` terminates the app; a bare `close` only ends agent-device's session, and the app keeps running in the background.

How the links are opened, to stay close to a user tapping a link in an email:

- **iOS:** `open "<url>"` without the app id runs `simctl openurl`, so iOS launches the app with the link or opens Safari. Then `open ${APP_ID}` attaches to the running app without restarting it. Don't use `open ${APP_ID} "<url>"`: it launches the app first and sends the link while it's still starting, which drops it, so the app stays on its home screen.
- **Android:** `open "<url>"` without the app id sends the same VIEW intent as Maestro's `openLink`, so Android resolves the link. Only a verified App Link opens the app; anything else opens a browser. After the content check, the flow waits for `net.artsy.app:id/action_bar_root`, which only exists when the Artsy app is in the foreground. The content check alone isn't enough, because the artsy.net page in a browser shows the same text.

The `click` and `email` links make the app fetch the tracking URL to find the destination (`useDeepLinks`). So they also depend on Braze and SendGrid answering, and on those tracking links not expiring.
