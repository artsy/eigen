# A/b Testing best practices

## What will you need to run a successful experiment?

1. An admin feature flag while you are developing the feature.
   > This flag has only one goal: **Is the feature ready to be released to all users?**

Want to learn more about feature flags, see our docs on [developing a feature](developing_a_feature.md).

2. An Unleash experiment flag
   > This is the flag that will handle the split to all users. Don't use this flag as a regular feature flag!

Want to learn more about adding/using an experiment to Eigen, see our docs on [adding an experiment](add_an_experiment.md).

## How to properly QA the release?

> It's important to ship experiments with the least updates and bug fixes to them as possible. This is important because it **can** have an impact on the experiment results.

Below is a non exhaustive list of areas to QA

- [ ] The control variant functionality.
- [ ] The experiment variant functionality.
- [ ] Tracking for both the control and experiment variants.
  - [ ] The tracking event is triggered only once per screen!
  - [ ] This is important to make sure that we don't end up triggering the same event multiple times and breaking the split ratio.

Want to learn how to switch between different variants, see how to [add an override](add_an_experiment.md#adding-an-override)

## Ready for release checkboxes!

- [ ] My feature has been QA'd and it was approved by product, design, and data!
  - [ ] Future updates or bug fixes,
- [ ] My feature related feature flag `readyForRelease` is set to `true`.
- [ ] My feature feature flag is available in Echo and is set to `true`
- [ ] My feature experiment flag is enabled for all users in `unleash.artsy.net`
  - The standard strategy is `ON` for all users in production
  - The different variants split is also available in production (you can use `copy to environment` to get the split from `staging`)
