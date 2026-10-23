# agent-device end-to-end

[agent-device](https://github.com/callstack/agent-device) by Callstack drives iOS simulators and Android emulators. These flows are deterministic `.ad` replay scripts that run without an LLM, alongside the existing [Maestro flows](../e2e/README.md). They cover the same scenarios (login, signup, deeplinks) and run on the same QA builds.

## How it runs in CI

| Platform | Workflow                                         | Triggered by                                          |
| -------- | ------------------------------------------------ | ----------------------------------------------------- |
| iOS      | `.github/workflows/ios-e2e-agent-device.yml`     | `Build iOS QA App for Maestro` succeeding (daily)     |
| Android  | `.github/workflows/android-e2e-agent-device.yml` | `Build Android QA App for Maestro` succeeding (daily) |

Both workflows can also be started manually from the Actions tab.

- Both download the same QA build from S3 as Maestro does, reuse `.env.maestro.<platform>` (the same test account), and run `scripts/utils/run_agent_device_suite <platform> <udid|serial>`.
- Each flow gets up to 3 attempts. A flow that only passes on a retry is logged as flaky, with a warning on the run summary.
- Failures are posted to `#mobile-alerts` with a screenshot (uploaded to S3, like Maestro's).
- Only `junit.xml` and `failures.json` are attached to the run as artifacts. This repo's artifacts are public, and agent-device's logs and screenshots can show the test account.

## Layout

- `flows/*.ad`: one script per scenario, shared by iOS and Android. The platform comes from the device passed to the runner.
- `reporters/failures.mjs`: a test reporter that writes the failed tests to `failures.json` for `scripts/ci/report-agent-device-test-failure`.

### Launch arguments

The flows need the same launch arguments as Maestro (`useMaestroInit`, `email`, `password`, `shouldSignOut`), read by `src/app/system/devTools/useMaestroInitialization.ts`. agent-device 0.21.31 accepts `open --launch-args` on the command line but drops it inside `.ad` scripts. So each flow declares its arguments in a header comment:

```
# @launch useMaestroInit=true email=${EMAIL} password=${PASSWORD}
```

Before each attempt, the runner (re)launches the app with those arguments: iOS process arguments via `xcrun simctl launch`, Android intent extras via `adb shell am start --es`. `${VAR}` values come from `AD_VAR_VAR`.

Each flow then starts with `open ${APP_ID}`, which attaches agent-device to the running app without restarting it, followed by a `wait` for the screen the launch arguments produce ("Sign up or log in" after `shouldSignOut`, `search-button` after `email`/`password`).

On Android, the runner first waits for that screen before starting the flow. agent-device's `open` sends a new launch intent, and `MainActivity` (`singleTask`, calling `setIntent` in `onNewIntent`) would replace our intent extras with it. Once the screen is up, the arguments have been read. iOS process arguments can't be replaced, so iOS doesn't need this.

## Running locally

1. Install the pinned version used in CI: `npm install -g agent-device@0.21.31`, then `agent-device doctor`.
2. Install a QA build on a booted simulator or emulator (see [the Maestro README](../e2e/README.md) or download `Artsy-latest.zip` / `Artsy-latest.apk` from `s3://artsy-citadel/eigen/builds/`).
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
- Flows must work on both platforms. Check selectors with `snapshot -i` on each.
- Declare launch arguments in the `# @launch` header, not on `open`.
- Start with `open ${APP_ID}`, then a `wait` for a screen the launch arguments produce. The runner uses that first `wait` on Android.
- On iOS, `fill` can't clear a secure text field. For password fields, `press` the field and then `type`.
- An input without an accessibility label is matched by its placeholder with `text="..."` while it's empty, not with `label=`.
- Wait for the element you're about to use, not just a heading on its screen. A heading can appear before the field is ready, and neighbouring screens can share headings.
- After moving to a new screen, `wait absent` for the previous screen's field before pressing anything. On slower simulators both screens are on screen during the transition, so a selector like `label="Continue"` matches twice.
- Give the first `wait` a generous timeout (90s). The first launch on a cold CI simulator can take over a minute.
- See `agent-device help scripting` and `agent-device help test` for the full syntax.
