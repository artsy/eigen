## Betas

To test your new features on a real device you can create a beta version.

We prefer creating beta version from the main branch.

```
./scripts/deploys/deploy-beta-both
```

and soon you will have betas on testflight and firebase

Ask `eigen beta?` on the #practice-mobile channel to get the links if you are not in the betas yet.

--

Deployment to TestFlight and Play Store is handled by the `build-deploy-*` GitHub Actions workflows. Betas get built three ways:

- **Nightly**, at 05:00 UTC, automatically.
- **Automatically, once per release:** when the release bot opens the release-candidate PR, [`rc-release-automation.yml`](../.github/workflows/rc-release-automation.yml) pushes the `rc-v<version>` branch to `beta-ios` / `beta-android` and builds the betas we QA. See [release candidate code freeze](release_candidate_code_freeze.md).
- **On demand:** run `./scripts/deploys/deploy-beta-both` (or `./scripts/deploys/deploy-beta-ios` / `./scripts/deploys/deploy-beta-android` for individual releases) locally.

When you trigger a beta yourself it runs on [Blacksmith](https://blacksmith.sh) runners and takes roughly **15–25 minutes**. Follow along in [GitHub Actions](https://github.com/artsy/eigen/actions).

Note that only one beta can be deployed at a time; teams should use [feature flags](./developing_a_feature.md) to avoid the need for having two parallel beta versions.

There are two types of betas on TestFlight: Internal and External. Our deploy script sends the beta to both groups. However, Internal testers get access to the beta immediately, while external testers may have a delay of several hours/days while Apple does beta review. This additional review typically only happens when we change the version number.
