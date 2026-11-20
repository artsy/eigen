# End-to-end tests

The e2e flows run with [agent-device](https://github.com/callstack/agent-device) by Callstack, which drives iOS simulators and Android emulators. The flows are deterministic `.ad` replay scripts that run without an LLM, on the QA builds of `main`. They cover login, signup, deeplinks, the share sheet, a smoke test of every bottom tab, signing up and deleting a new account, adding and deleting a My Collection artwork, and saving an artwork and following an artist in Favorites.

`perf/` holds the separate Flashlight performance test, which still uses Maestro. See [Measuring performance with Flashlight](../docs/measuring_performance_with_flashlight.md).

## How it runs in CI

| Platform | Workflow                            | Called by `nightly-qa.yml` after |
| -------- | ----------------------------------- | -------------------------------- |
| iOS      | `.github/workflows/ios-e2e.yml`     | the iOS QA build succeeds        |
| Android  | `.github/workflows/android-e2e.yml` | the Android QA build succeeds    |

`nightly-qa.yml` runs on weekday mornings and skips the builds when `main` hasn't changed since the last build. Each suite only depends on its platform's build, so a failure on one platform doesn't stop the other. Both workflows can also be started manually from the Actions tab, on the latest QA build in S3.

- Both download the QA build from S3, load the test account from `.env.e2e.<platform>`, and run `scripts/utils/run_e2e_suite <platform> <udid|serial>`.
- Flows run in a fixed order, set by `FIRST_FLOWS` in the runner. `login` and `signup` go first, so a freshly booted simulator's slow first minutes land on the simplest flows. Then come `deeplink-email`, `deeplink-click` and `deeplink-artist`, in that order, so a failure can be told apart from being the first deeplink of the run. Any other flow follows, alphabetically. In the iOS job, the simulator also starts booting right after checkout, so it settles during setup.
- Each flow gets up to 3 attempts. A flow that only passes on a retry is logged as flaky, with a warning on the run summary.
- At the end, the runner prints a summary like agent-device's own reporter. That's one `✓`/`⨯` line per flow with its time, then the flaky flows and the failures, with the error of every failed attempt. In CI it's also added to the run's summary page. Flow names come from each flow's `# @title` header.
- Failures are posted to `#mobile-alerts` with a screenshot (uploaded to S3). Only runs on `main` post; runs on other branches skip Slack.
- To test a branch's app changes, build it under its own name, then run the suite on that build. Start `build-qa-ios.yml` (or `build-qa-android.yml`) on the branch with `build_name` set, e.g. to the branch name without slashes. It uploads `Artsy-<build_name>` instead of `Artsy-latest`, so main's build is left alone. Then start `ios-e2e.yml` (or `android-e2e.yml`) on the branch with the same `build_name`:

  ```sh
  gh workflow run build-qa-ios.yml --ref <branch> -f build_name=<name>
  gh workflow run ios-e2e.yml --ref <branch> -f build_name=<name>
  ```

- Only `junit.xml` and `failures.json` are attached to the run as artifacts. This repo's artifacts are public, and agent-device's logs and screenshots can show the test account.

## Layout

- `flows/<name>.ad`: one script per scenario, shared by iOS and Android. The platform comes from the device passed to the runner.
- `flows/<name>.<ios|android>.ad`: a platform-only version, for a scenario that has to work differently on each platform. The `deeplink-*`, `share` and `delete-account` flows are. `SKIP_FLOWS` uses the name without the suffix, e.g. `SKIP_FLOWS="deeplink-email deeplink-click"`.
- `reporters/failures.mjs`: a test reporter that writes the failed tests to `failures.json` for `scripts/ci/report-e2e-test-failure`.

### Launch arguments

The flows set up the app with launch arguments (`useE2EInit`, `email`, `password`, `shouldSignOut`, `enableFeatureFlags`), read by `src/app/system/devTools/useE2EInitialization.ts`. agent-device accepts `open --launch-args` on the command line but drops it inside `.ad` scripts (still true as of the pinned version). So each flow declares its arguments in a header comment:

```
# @launch useE2EInit=true email=${EMAIL} password=${PASSWORD}
```

Before each attempt, the runner (re)launches the app with those arguments: iOS process arguments via `xcrun simctl launch`, Android intent extras via `adb shell am start --es`. `${VAR}` values come from `AD_VAR_VAR`.

Each flow then starts with `open ${APP_ID}`, which attaches agent-device to the running app without restarting it, followed by a `wait` for the screen the launch arguments produce ("Sign up or log in" after `shouldSignOut`, `search-button` after `email`/`password`).

On Android, the runner first waits for that screen, using the flow's first `wait`, before starting the flow. It refuses to run flows whose first `wait` doesn't wait for a selector (`wait 2000`, `wait absent`, `wait stable`), because those would pass before the arguments were read. agent-device's `open` sends a new launch intent, and `MainActivity` (`singleTask`, calling `setIntent` in `onNewIntent`) would replace our intent extras with it. Once the screen is up, the arguments have been read. iOS process arguments can't be replaced, so iOS doesn't need this.

## Running locally

1. Install the pinned version used in CI: `npm install -g "agent-device@$(cat e2e/agent-device-version)"` (from the repo root), then `agent-device doctor`. That file is the single source of truth for the version, read by both workflows — bump it there.
2. Get the app onto a booted device:
   - **iOS:** install the QA build CI uses. Download `s3://artsy-citadel/eigen/builds/ios/Artsy-latest.zip`, unzip it, then run `xcrun simctl install booted ./Artsy.app`. Then run `agent-device prepare ios-runner --platform ios --udid <udid> --timeout 900000` once, to build agent-device's test runner.
   - **Android:** run a local build with `yarn android` (the `E2E_APP_ID` package is `net.artsy.app`) and keep Metro running. The QA APK on S3 is built for x86_64 only, for CI's emulator, so it won't install on Apple Silicon emulators or on physical phones (`INSTALL_FAILED_NO_MATCHING_ABIS`). Open the app once and dismiss any React Native warning overlay before running the suite.
   - **Android deeplinks:** a debug build can't verify App Links, because artsy.net's `assetlinks.json` only lists the release signing key, so its links open in Chrome. Mark the domains as verified for the local build with `adb shell pm set-app-links --package net.artsy.app 1 all`. Don't do this in CI, where verifying the release build is the point of the test.
3. Make sure `.env.e2e.<platform>` exists (`yarn setup:e2e:<platform>`; one `KEY=value` per line), or export `E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD` and optionally `E2E_APP_ID`. Values in the file win over the shell. To run against a different app (e.g. a dev build, `net.artsy.artsy`), set `E2E_APP_ID_OVERRIDE`, which wins over both.
4. Run the suite with `./scripts/utils/run_e2e_suite ios` (or `android`). It uses the first booted simulator or emulator; pass a UDID or serial as the second argument to choose one.

Slack is only notified when `CI` is set.

To iterate on a single flow, launch the app with the flow's `@launch` arguments yourself, then replay it:

```sh
xcrun simctl launch --terminate-running-process booted net.artsy.qa -useE2EInit true -shouldSignOut true
AD_VAR_APP_ID=net.artsy.qa AD_VAR_EMAIL=... AD_VAR_PASSWORD=... agent-device replay e2e/flows/login.ad --platform ios
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
- A flow that changes account state (saves, follows, orders) should sign up a new account, like `favorites` and `delete-account` do, rather than use the shared test account. Scripts can't branch, so on a shared account an attempt that stops halfway leaves state behind that breaks every run after it until someone resets the account by hand. The runner makes a new `SIGNUP_EMAIL`/`SIGNUP_PASSWORD` for every attempt.
- If a flow must change the shared test account, it has to undo the change before it ends and check the undo landed. Say in the flow's header what to reset by hand when an attempt stops halfway. `my-collection` does this.
- Prefer stable test data over live inventory. `favorites` uses the sold staging work "Maestro Test Artwork, 2025" by "Test Artist", which won't change under the flow.
- Press bottom tabs by their testID, `id="bottom-tab-<route>"` (e.g. `bottom-tab-search`), not their label. On Android, `label="Search"` also matches Home's search button. Tab screens stay mounted after their first visit, and Android keeps them in the accessibility tree, so wait for something only the new tab renders.
- Palette's `Button` repeats its accessibility label on an inner view, so a label matches twice. Add the role: `press 'role="button" label="Delete Artwork"'`.
- Labels that include counts or prices ("Follow 1.2K", "Saved Artworks, 3 Artworks") change between runs. Give the element a stable `accessibilityLabel` (and put the count in `accessibilityValue`), or fall back to its `testID`.
- With `useE2EInit`, dev builds silence LogBox (`useE2EInitialization`). Its banner sits over the tab bar and swallows taps meant for it. QA builds have no LogBox, so this only affects local runs.
- See `agent-device help scripting` and `agent-device help test` for the full syntax.

## Deeplinks

Each link gets its own flow, so a failure retries only that link:

| Flow                  | Link                                  | Lands on                          |
| --------------------- | ------------------------------------- | --------------------------------- |
| `deeplink-artist`     | `https://artsy.net/artist/kaws`       | KAWS artist page                  |
| `deeplink-click`      | Braze `click.artsy.net` tracking link | "Highlights at Auction This Week" |
| `deeplink-email`      | SendGrid `email-link.artsy.net` link  | "Maestro Test Artwork, 2025"      |
| `deeplink-logged-out` | the artist link, while logged out     | login, then the KAWS artist page  |

Every link is a cold start. `close ${APP_ID}` terminates the app; a bare `close` only ends agent-device's session, and the app keeps running in the background.

How the links are opened, to stay close to a user tapping a link in an email:

- **iOS:** `open "<url>"` without the app id runs `simctl openurl`, so iOS launches the app with the link or opens Safari. Then `open ${APP_ID}` attaches to the running app without restarting it. Don't use `open ${APP_ID} "<url>"`: it launches the app first and sends the link while it's still starting, which drops it, so the app stays on its home screen.
- **Android:** `open "<url>"` without the app id sends a plain VIEW intent, like tapping the link, so Android resolves it. Only a verified App Link opens the app; anything else opens a browser. After the content check, the flow waits for `net.artsy.app:id/action_bar_root`, which only exists when the Artsy app is in the foreground. The content check alone isn't enough, because the artsy.net page in a browser shows the same text.

The `click` and `email` links make the app fetch the tracking URL to find the destination (`useDeepLinks`). So they also depend on Braze and SendGrid answering, and on those tracking links not expiring.

## Share

`share` turns on `AREnableShareShowPartnerFeature` with the `enableFeatureFlags` launch argument (a comma-separated list of flag names), then opens a show, a partner and a feature by link while the app is running: `https://artsy.net` links on iOS, `artsy://` links on Android. On iOS, an `artsy://` link makes iOS ask “Open in ‘Artsy’?” first, and the flow can't see that alert. On each page it taps the share button and checks the app's own share sheet opens (Copy link and More), not the system one. The show and partner close the sheet with its X; the feature taps Copy link and waits for the "Copied to Clipboard" toast.

- Bottom sheets hide their rows from agent-device (and VoiceOver) unless they set `accessible={false}`: gorhom's default turns the whole sheet into a single "Bottom Sheet" element.
- Don't tap More. It opens the system share sheet, which iOS draws outside the app; agent-device can't see inside it, and stops seeing the app's own screen once it's open.
