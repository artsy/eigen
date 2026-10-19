# Deploy a hotfix

A hotfix is a fix for a bug in a **live release** that can't wait for the next one. It ships outside
the normal release cadence and carries _only_ the critical fix.

This page is the runbook. For how any of it works — the production gate, fingerprints, rollbacks —
see [Deploy to Expo Updates](deploy_to_expo_updates.md).

> [!IMPORTANT]
> Let the #product-sapphire team know before you ship anything to production users.

## Which kind of hotfix?

**Does the fix touch native code?** (`ios/`, `android/`, `Podfile.lock`, native deps, app config)

- **No → [Expo Updates hotfix](#expo-updates-hotfix).** Goes out over the air, no store review, users
  get it on next launch. Use this whenever you can.
- **Yes → [Native hotfix](#native-hotfix).** New build through app review, and users have to update.
  A mitigation, not an immediate fix. Expedited App Store review can be requested, sparingly and
  with no guarantee; Google Play has no expedited review but is usually faster anyway.

---

## Expo Updates hotfix

**Setup**, once per machine:

```sh
yarn setup:releases
./scripts/setup/install-bin
gh auth login            # https://cli.github.com/
```

The hotfix branch is older than `main`, so refresh deps or the publish will fail:
`yarn setup:artsy && yarn install:all`.

### 1. Land the fix on `main`

Hotfixes are cherry-picked from `main`, so the fix must be reviewed and merged there first. Note the
SHA of the merge/squash commit.

### 2. Start the hotfix

Find the live app version with `./scripts/deploys/latest-submissions`, then:

```sh
./scripts/deploys/expo-updates/start-hotfix 9.21.0 <sha> [<sha>...]
```

Creates `hotfix-v9.21.0` (or adds to it), cherry-picks, pushes, and opens or extends the hotfix PR.
Shipping several fixes? Pass them oldest first, or run `start-hotfix` again when the next one lands
— [same branch either way](deploy_to_expo_updates.md#one-branch-per-app-version).

### 3. Wait for the canary

Pushing the branch publishes a canary automatically — nothing to run. `start-hotfix` prints the run
link; ~10–20 minutes.

### 4. QA it

> [!IMPORTANT]
> On a **Firebase App Tester** on **both iOS and Android**. or **Testflight for iOS** (Testflight defaults to production, so you will need to switch channels from the dev menu to get the canary — cause Testflight defaults to the production channel)

Download the Firebase build matching the live version — same build number as the submission tag, not
a later beta of the same version. Dev Menu → Expo Updates → **canary** → relaunch. Check the fix _and_ that the app is generally healthy: an update replaces the whole JS bundle, not just your diff.

### 5. Promote expo update to production

```sh
./scripts/deploys/expo-updates/deploy-to-expo-updates-ci production 'hotfix description'
```

Goes to **all users** unless you pass a rollout percentage as a third argument. The script confirms
with you first, naming the commit and the audience.

The run posts to Slack on success and failure — **it isn't shipped until you see that message.**
Raise a partial rollout later with `./scripts/deploys/expo-updates/update-rollout`.

### 6. Monitor

The publish leaves a GitHub release, a Slack message with Sentry and Mobile Vitals links for both
platforms, and a comment on the hotfix PR. Watch those.

The hotfix PR is marked **"Do not merge"** — close it by hand once the version stops getting
hotfixes.

**If it goes wrong:** [roll back](deploy_to_expo_updates.md#rolling-back).

---

## Native hotfix

Native hotfix branches follow rc-v9.20.1` naming and are not published over the air.

### 1. Bump the version

The branch is a past release, so it needs a new version to be submitted. The next version is in App
Store Connect — generally the previous release's patch incremented by 1:

```sh
./scripts/deploys/next
# What is the new human-readable release version? 7.2.1

git add -A
git commit -m "Update version for hotfix"
```

### 2. Deploy a beta

Tell the other devs to hold off on betas until this build is submitted for review.

```sh
./scripts/deploys/deploy-beta-both
# or deploy-beta-ios / deploy-beta-android
```

### 3. QA and release

Run the QA script, and QA the bug fix itself. Then follow
[deploy to app store](deploy_to_app_store.md) and [deploy to play store](deploy_to_play_store.md).
