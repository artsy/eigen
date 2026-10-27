# Deploy a hotfix

A hotfix is a fix for a bug in a **live release** that can't wait for the next one. It carries _only_
the critical fix.

<!-- prettier-ignore -->
> [!IMPORTANT]
> Tell #product-sapphire before you ship anything to production users.

## Which kind?

**Does the fix change native code?** That means `ios/`, `android/`, `Podfile.lock`, a native
dependency, or app config like `app.json`.

- **No, it's JS only → [Expo Updates hotfix](#expo-updates-hotfix).** Goes out over the air, no
  store review. Use this whenever you can.
- **Yes → [Native hotfix](#native-hotfix).** Goes through app review and users have to update, so
  it's a mitigation, not an instant fix.

**Not sure?** Try the Expo Updates path. If the fix touches native code, step 1 stops with "Native
code changed" before anything is pushed, and you switch to the native hotfix.

**Both kinds start here:**

1. Land the fix on `main` and note the merge commit's SHA.
2. Find the live version with `./scripts/deploys/latest-submissions`. The examples below use `9.21.0`.

---

## Expo Updates hotfix

**One-time setup:**

```sh
yarn setup:releases
./scripts/setup/install-bin
gh auth login
yarn setup:artsy && yarn install:all   # the hotfix branch is older than main
```

### 1. Start it

```sh
./scripts/deploys/expo-updates/start-hotfix 9.21.0 <sha> [<sha>...]
```

Creates `hotfix-v9.21.0` (or adds to it), cherry-picks, checks native code didn't change, pushes, and
opens the hotfix PR. Several fixes can go on the same branch, passed together or added later.

<details>
<summary>The cherry-pick conflicted</summary>

The script stops before pushing. Resolve the conflict, then:

```sh
git add <resolved files>
git cherry-pick --continue
./scripts/deploys/expo-updates/start-hotfix 9.21.0 --continue
```

Don't push by hand, and don't re-run with the SHA. Both skip the native check, and a hand push leaves
the fix out of the release notes. If a later fix hadn't been applied yet, run `start-hotfix` again
with it.

</details>

### 2. Wait for the canary

Pushing the branch publishes a canary on its own. It takes 10–20 minutes, and the script prints the
link.

### 3. QA the canary

Test on **iOS and Android**, using Firebase App Tester or TestFlight.

1. Install the build with the same build number as the live submission.
2. Dev Menu → Expo Updates → **canary** → relaunch. (TestFlight starts on production, so switch to canary. TestFlight betas automatically download the latest bundle from Expo, but Firebase ones do not. On Firebase betas, you need to fetch the latest bundle manually.)
3. Check the fix, and that the app is generally healthy. An update replaces the whole JS bundle.

### 4. Publish

```sh
./scripts/deploys/expo-updates/deploy-to-expo-updates-ci production 'hotfix description'
```

Goes to **all users** unless you add a rollout percentage as a third argument. **It isn't shipped
until you see the Slack message.**

### 5. Monitor

Check the Sentry and Mobile Vitals links in the Slack message and on the hotfix PR. Close that PR by
hand once this version stops getting hotfixes (it's marked "Do not merge").

If it goes wrong, [roll back](deploy_to_expo_updates.md#rolling-back). More background, including
the production gate and FAQ, is in [Deploy to Expo Updates](deploy_to_expo_updates.md).

---

## Native hotfix

The branch is named after the **new** version this hotfix will ship as, usually the live version
plus a patch: live `9.21.0` becomes `rc-v9.21.1-hotfix`.

### 1. Branch from the live release

```sh
git checkout ios-9.21.0-2026.10.07.11-submission   # the tag from latest-submissions
git checkout -b rc-v9.21.1-hotfix
```

### 2. Apply the fix

```sh
git cherry-pick -x <sha> [<sha>...]
```

### 3. Bump the version

Use the same new version as the branch name (check App Store Connect if unsure):

```sh
./scripts/deploys/next
# What is the new human-readable release version? 9.21.1

git add -A
git commit -m "Update version for hotfix"
```

### 4. Build a beta

Tell the other devs to hold off on betas until this build is submitted.

```sh
./scripts/deploys/deploy-beta-both   # or deploy-beta-ios / deploy-beta-android
```

### 5. QA and release

QA the fix and run the QA script. Then follow [deploy to app store](deploy_to_app_store.md) and
[deploy to play store](deploy_to_play_store.md). You can ask for an expedited App Store review, but
sparingly and with no guarantee.
