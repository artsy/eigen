# Creating a PR preview

A PR preview is a JS bundle built from your PR and published to Expo Updates. Anyone with a beta can load it from the dev menu, so reviewers and QA can try your PR on a real device without a new beta and without taking over the `canary` channel.

A preview carries JS changes only. If your PR changes native code, the workflow doesn't publish and asks for new betas instead.

## Quick start

To create a preview:

1. Add the `preview` label to your PR.
2. Wait for the [PR Preview workflow](../.github/workflows/pr-preview.yml) to finish. It writes the result into the **PR preview** section of the PR description.
3. On a beta, open the dev menu, expand **Preview PR**, enter the PR number, and tap **Load PR**.

Every push to the PR publishes a new bundle to the same channel, `review-app-<PR number>`. When you close or merge the PR, the workflow deletes the channel.

PRs from forks don't get previews, because fork PRs can't read the repo's secrets.

## Using a `review-app-*` branch

This works like [Force review apps](https://github.com/artsy/force/blob/main/docs/creating_review_app.md). Name your branch with the `review-app-` prefix, for example `review-app-city-guide-map`, and open a PR from it. The workflow publishes a preview on every push, with no label needed.

The channel name comes from the PR number, not the branch name. PR 14300 from `review-app-city-guide-map` publishes to `review-app-14300`.

Removing the label from a `review-app-*` PR doesn't delete its preview. Closing or merging the PR does.

## Reading the PR preview section

The workflow writes its result between the `<!-- pr-preview:start -->` and `<!-- pr-preview:end -->` markers that [the PR template](pull_request_template.md) adds. Don't edit inside the markers, because the next run overwrites them. If you deleted the markers, the workflow adds the section to the end of the description.

The result depends on how your PR's native code compares to `main`:

| Status   | Publishes | The section shows                                                                                  | What to do                                                          |
| -------- | --------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `level`  | Yes       | The PR number and the channel                                                                      | Nothing                                                             |
| `behind` | Yes       | The PR number and the channel, plus a warning that `main`'s native code changed since you branched | Rebase onto `main` to clear the warning                             |
| `ahead`  | No        | A caution that the PR changes native code, with a table of fingerprints                            | Deploy new betas instead. See [Beta Deployment](deploy_to_beta.md). |

Two other messages can appear:

- **Publish failed.** The section links to the workflow run. Open it to see which step failed.
- **Runtime mismatch.** This warning can sit on top of a `level` or `behind` result. Your PR's `expo.runtimeVersion` in `app.json` differs from `main`'s, usually because `main` bumped the app version after you branched. Builds from `main` won't load the bundle. Rebase onto `main`.

## Loading a preview on a device

These builds can load a preview:

- **iOS:** a TestFlight beta or a Firebase beta.
- **Android:** a Firebase beta.

The Play Store beta can't load a preview. It's a `release` build, the same type as production, so the dev menu shows **Preview PRs unavailable**. Local Debug builds can't either, because they have expo-updates turned off.

See [Welcome to Eigen beta](welcome_to_eigen_beta.md) to join TestFlight, or ask `eigen beta?` in **#practice-mobile** for the Firebase links.

To load a preview:

1. Open the dev menu. See [Dev Menu](dev_menu.md).
2. Expand **Preview PR**.
3. Enter the PR number and tap **Load PR**.
4. Check the PR title, commit, and channel in the alert, then tap **Switch**.

The app downloads the bundle and reloads. On Android, if you see "Update downloaded, but the app can't reload itself", force-quit and reopen the app.

To load a newer push of the same PR, enter the PR number again and tap **Load PR**.

When the app runs a preview, the **Preview PR** section shows an **Active Preview** message with the channel and PR number. The app also draws an orange line in these places:

- around the Dynamic Island, on iPhones that have one
- along the top of the bottom tab bar
- along the bottom of the artwork screen header
- along the top of the sign-in modal

Staging uses the same lines in purple.

If **Load PR** fails, the dev menu shows one of these messages:

- `PR #<number> not found`: check the number.
- `PR #<number> is not open`: closed and merged PRs have no preview.
- `PR #<number> doesn't have the "preview" label and isn't on a review-app-* branch`: add the label.
- `No update has been published to review-app-<number> yet.`: wait for the workflow, or check the PR preview section for an `ahead` status or a failed publish.

## Leaving a preview

To go back to the beta's own bundle, delete the app and install the beta again from TestFlight or Firebase.

<!-- TODO: Reinstalling is the only way we've confirmed. After we test it, check whether picking a channel under Expo Updates in the dev menu also leaves a preview, and document that here instead. -->

## Deleting a preview

You don't need to delete a preview by hand. The workflow deletes the Expo channel and branch named `review-app-<PR number>` and resets the PR preview section when either of these happens:

- You close or merge a PR that has the `preview` label or a `review-app-*` branch.
- You remove the `preview` label from a PR whose branch doesn't start with `review-app-`.

## Detailed info

The workflow is [`.github/workflows/pr-preview.yml`](../.github/workflows/pr-preview.yml), and its scripts live in [`scripts/pr-preview/`](../scripts/pr-preview).

### When the workflow runs

The workflow listens to `pull_request` events: `opened`, `labeled`, `unlabeled`, `synchronize`, and `closed`.

- It publishes when you add the `preview` label, or when you open or push to a PR that has the label or a `review-app-*` branch.
- It cleans up on the events listed in [Deleting a preview](#deleting-a-preview).

A new publish or cleanup run for a PR cancels the one still going for that PR.

### Checking native code

A JS bundle that expects native code the build doesn't have crashes on launch. To avoid that, the workflow compares three [`@expo/fingerprint`](build_caching.md) hashes:

- **PR**: the fingerprint at the PR head. The `pr-fingerprint` job computes it with `checkNativeStatus.ts fingerprint`.
- **Merge base**: the fingerprint at `git merge-base HEAD origin/main`. On every push to `main`, [`expo-fingerprint-check.yml`](../.github/workflows/expo-fingerprint-check.yml) saves `main`'s fingerprint to the GitHub Actions cache under `native-fingerprint-<sha>`. The `base-fingerprint` job restores it from there. On a cache miss, the job checks out the merge base, computes the fingerprint, and saves it for the next push.
- **Main**: `s3://mobile-cached-builds/eigen-expo-fingerprint/latest.txt`. `expo-fingerprint-check.yml` rewrites this file whenever `main`'s native code changes.

The `native-status` job runs `checkNativeStatus.ts status`, which picks the status in this order:

1. If the PR fingerprint equals main's, the status is `level`.
2. If the PR fingerprint differs from the merge base's, the PR changed native code, and the status is `ahead`.
3. Otherwise only `main` changed native code, and the status is `behind`.

Fingerprints ignore `expo.runtimeVersion`, so the same job also reads it from the PR's `app.json` and from `main`'s. A mismatch adds the runtime warning to the PR description.

### Publishing

The `publish` job runs unless the status is `ahead`. It calls the same Fastlane lane as other Expo Updates deploys:

```sh
bundle exec fastlane deploy_to_expo_updates deployment_name:review-app-<PR number> description:"PR preview #<PR number> at <sha>" platform:all preview:true
```

The lane runs `eas update` for both platforms and uploads source maps to Sentry. `preview:true` skips the git tags the lane pushes for `canary`, `staging`, and `production` deploys.

The workflow calls the lane directly, not through `deploy-to-expo-updates-ci`. So the fingerprint pre-flight from [Deploying to Expo Updates](deploy_to_expo_updates.md#how-updates-are-matched-to-builds) doesn't run here. The native check above takes its place.

### Updating the PR description

The `update-pr-description` job runs `updatePrDescription.ts report` once `native-status` succeeds, whether `publish` passed, failed, or was skipped. It doesn't run if a newer push cancelled the run, so a stale result never overwrites a newer one. `prDescription.ts` builds the text.

### Cleaning up

The `cleanup-preview` job runs `eas channel:delete` and `eas branch:delete` for `review-app-<PR number>`. If the channel or branch is already gone, the job moves on. Then `updatePrDescription.ts clear` resets the PR preview section to the template's placeholder.

### In the app

- [`PreviewPROptions.tsx`](../src/app/system/devTools/DevMenu/Components/PreviewPROptions.tsx) is the **Preview PR** section of the dev menu. It points expo-updates at the PR's channel with `Updates.setUpdateRequestHeadersOverride`, then fetches the update and reloads. If no update is available or the download fails, it switches back to the previous channel.
- [`previewPR.ts`](../src/app/system/devTools/DevMenu/utils/previewPR.ts) reads the PR from the public GitHub API and checks that it's open and has the `preview` label or a `review-app-*` branch, the same rule the workflow uses.
- [`useEnvironmentColor.ts`](../src/app/utils/hooks/useEnvironmentColor.ts) returns `orange100` while a preview bundle runs, and `devpurple` on staging. [`DynamicIslandEnvironmentIndicator.tsx`](../src/app/utils/DynamicIslandEnvironmentIndicator.tsx) and the screens listed in [Loading a preview on a device](#loading-a-preview-on-a-device) use it.
