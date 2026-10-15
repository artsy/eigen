# Deploy a hotfix build

Occasionally a bug is found in a live release that requires a quick mitigation. For these cases we can deploy a build outside our normal release cadence with _only_ the critical bug fix added.

There are 2 methods of deploying hotfixes depending on the issue:

1. **Expo Updates (JS) hotfix**: if the fix is JS-only, we publish it over the air and users get it on the next run of the app. This is the faster path — use it whenever the fix is JS-only.
2. **Native hotfix**: if the fix touches native code we must ship a new build through app review. Users still have to update, so this is a mitigation rather than an immediate fix. An expedited App Store review can be requested, sparingly and with no guarantee. Google Play has no expedited review, but is typically faster anyway.

A production Expo Update reaches users **without store review**, so it gets the same guarantees as a
store release: the code is on a hotfix branch, that branch has a hotfix PR, a canary of the exact
same commit was QA'd first, and the publish leaves a GitHub release and a Slack message behind it.
CI enforces this and **there is no override** — see [the production gate](#the-production-gate).

> [!IMPORTANT]
> Let the #product-sapphire team know before publishing a production hotfix.

---

# Expo Updates hotfix

## 0. Prerequisites

```sh
yarn setup:releases
./scripts/setup/install-bin
```

You also need the [GitHub CLI](https://cli.github.com/) (`gh auth login`).

The hotfix branch is older than `main`, so your local dependencies are probably out of date — the
publish will fail otherwise:

```sh
yarn setup:artsy
yarn install:all
```

> ⚠️ If this changes `Podfile.lock`, the fix needs a **native hotfix**, not an Expo Update.

## 1. Land the fix on `main`

Hotfixes are cherry-picked from `main`, so the fix must be reviewed and merged there first. The
hotfix PR itself needs no approval — the fix's own PR is the review.

Note the commit's SHA on `main` (the merge/squash commit).

## 2. Start the hotfix

Find the live app version (`./scripts/deploys/latest-submissions`), then:

```sh
./scripts/deploys/expo-updates/start-hotfix 9.21.0 <sha> [<sha>...]
```

This:

- creates `hotfix-v9.21.0` from `rc-v9.21.0`, or **adds to it** if it already exists
- cherry-picks each SHA (stopping hard if the fix turns out to touch native code)
- pushes the branch and opens — or extends — the **hotfix PR**

### One branch per app version

There is one `hotfix-vX.Y.Z` branch per released version, and every OTA hotfix for that version
goes on it. An Expo Update ships the **whole JS bundle**, so the second hotfix has to contain the
first. Adding to the same branch guarantees that; cutting a fresh branch from `rc-v` would silently
revert the earlier fix.

The branch tip is always what's live. The hotfix PR is the record of that, which is why it is
marked **"Do not merge"** and closed by hand rather than merged.

To drop an earlier hotfix on purpose:

```sh
./scripts/deploys/expo-updates/start-hotfix 9.21.0 --revert <sha>
```

> [!IMPORTANT]
> If you roll an update back with `rollback`, the branch tip still contains the rolled-back code
> and the gate can't tell. Run `start-hotfix --revert <sha>` before the next production publish, or
> the next hotfix will ship it again.

## 3. The canary publishes itself

Every push to a `hotfix-v*` branch publishes a canary of that commit automatically — no command to
run. `start-hotfix` prints the link to the run; it takes roughly 10–20 minutes.

This isn't just convenience. The production gate requires a canary of the **exact commit** you're
about to publish, so if you push another commit to the hotfix branch, the canary you QA'd no longer
matches and you have to QA the new one. Publishing a canary per commit is what keeps that honest.

If a newer commit is pushed while a canary is still running, the older run is cancelled — it was
about to publish a bundle nobody will ship.

The canary channel normally compares native code against `main`'s fingerprint. On a hotfix branch
it compares against the fingerprint of the build that actually shipped for this version instead,
which is the one your users are running.

You can still publish a canary by hand — for a second opinion after an EAS hiccup, say:

```sh
./scripts/deploys/expo-updates/deploy-to-expo-updates-ci canary 'hotfix description'
```

## 4. QA on the shipped build

> [!IMPORTANT]
> QA has to happen on a **Firebase App Tester** build, on both iOS and Android. TestFlight builds
> can't load a canary — only the Firebase distribution has the dev menu you need to switch
> channels.

Download the Firebase build matching the live version — the same build number as the submission
tag. Enable the dev menu, pull the bundle from the **canary** channel, relaunch, and check both the
fix and that the app is generally healthy. An Expo Update replaces the whole JS bundle, not just
your diff.

> One app version can have several native builds with different fingerprints, so QA the build that
> matches what shipped, not a later beta of the same version.

## 5. Publish to production

```sh
./scripts/deploys/expo-updates/deploy-to-expo-updates-ci production 'hotfix description'
```

Goes out to **all users** unless you ask for less. Pass a percentage to ship to a slice first and
watch it before widening:

```sh
./scripts/deploys/expo-updates/deploy-to-expo-updates-ci production 'hotfix description' 25
```

The script asks you to confirm, naming the commit and who it's going to.

The run posts to Slack on success and failure. Don't consider the hotfix shipped until you see it.

Every production publish leaves:

- a **GitHub release** — `v9.21.0 hotfix 1 (OTA)`, with Sentry and Mobile Vitals links and the
  changelog from the hotfix PR
- a **Slack message** carrying the same monitoring links a store release gets: the release, the
  run, and each platform's Sentry health and Mobile Vitals
- a **comment on the hotfix PR** saying it shipped, who it went to, and where to watch it
- a **section in the hotfix PR**, written by `start-hotfix`

### The production gate

Before anything is published, CI checks that:

1. the publish covers **both platforms**
2. the branch is `hotfix-v<app.json version>` and the commit is its **tip**
3. a hotfix PR from that branch into `rc-v<version>` exists and was **never merged**
4. the commit descends from the store submission **and** from every OTA hotfix already published
   for this version
5. a **successful canary of the same commit**, covering both platforms, exists

If any of these fail, the publish stops before `eas update` runs. There is no override: if GitHub
Actions or EAS is down, the fallbacks are a rollback (not gated) or a native hotfix.

The gate lives in `scripts/deploys/expo-updates/productionGate/`.

### Update rollout

```sh
./scripts/deploys/expo-updates/update-rollout
```

Interactive; pick the release and raise its rollout.

### Rolling back

```sh
./scripts/deploys/expo-updates/rollback
```

Prompts you to choose an earlier published update or the build's embedded update, then republishes
your choice as the channel's latest. Afterwards, see the `--revert` note in step 2.

> Both run locally against the `artsy_mobile` account:
> `./bin/node_modules/.bin/eas login --no-browser` (credentials in 1Password; `--no-browser` keeps
> the username/password prompt instead of trusting whatever account your browser is signed into).

## Versions released before this process existed

Versions released before October 2026 have no `rc-v` branch workflow support for this flow, and
their branches predate the CI publish workflow. They are assumed healthy; if one ever needs a
hotfix, publish it locally as before with
[`deploy-to-expo-updates`](deploy_to_expo_updates.md#publishing-from-an-older-branch-fallback).
`deploy-to-expo-updates-ci` detects this and prints the exact local command to run.

---

# Native hotfix

Native hotfix branches keep the older `X.Y.Z-hotfix` naming and are not published over the air.

## Update the version number of the app to match next release

Since the hotfix branch is a past release the app version will need to be updated to submit to Apple and Google Play. The next release version can be found in app store connect and is generally the previous release's version number incremented by 1. In this example it is 7.2.1

`./scripts/deploys/next`

`What is the new human-readable release version? 7.2.1`

Commit the version changes.

`git add -A`

`git commit -m "Update version for hotfix"`

## Deploy a beta with the hotfix

Communicate with other devs that a hotfix will be deployed and they should hold off on deploying betas until a build is submitted for review.

`./scripts/deploys/deploy-beta-both` (or `./scripts/deploys/deploy-beta-ios` or `./scripts/deploys/deploy-beta-android` for individual releases)

## Run through QA script and release to the app store

Follow the instructions for [deploying to app store](https://github.com/artsy/eigen/blob/main/docs/deploy_to_app_store.md) and [deploying to play store](https://github.com/artsy/eigen/blob/main/docs/deploy_to_play_store.md).

Make sure to QA the bug fix changes and run through the QA script before releasing to users.

---

## Gotchas and FAQS

**The expo update was deployed but I am still not seeing my app update. What's going on?**

Updates aren't instant in mobile, even with expo updates, but users on the latest should get updated over a few days automatically with the rollout. If you want to try to force the update you can make sure you are on the latest version of the app in the app store and then kill and restart your app.

**I want to deploy to expo-updates and target multiple versions to get more users updated. How do I do that?**

You probably should not, expo updates will prioritize the latest mandatory update so releasing multiple will affect roll outs of the others and slow down how fast fixes get to users. Most users will update fairly quickly once a release is rolled out completely so it is best to target the latest and wait in most cases. If something is critical we can talk about options in the #practice-mobile channel. Most things are not critical and remember we do releases every 2 weeks.

**The latest version of the app is still rolling out so many users won't get updated if we target the latest with expo updates. What do I do?**

You have a couple options, check metrics for latest release:

**Option 1 - if things look stable**:

- Update the rollout in play store and app store to release the app to all users
- Send out your update targeting the latest release as usual and users should get updated over the next few days

**Option 2 - if things look unstable**:

- Halt the rollout of the latest release
- Do a native hotfix release fixing instability and the issue being addressed
