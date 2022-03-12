# How to Develop a Feature in Eigen

Developing new features in Eigen can be a little tricky. For very small features (like adding a single new label to a view), just send a pull request. For big features that will take longer than a sprint, things are a little more complicated.

[Artsy releases the app on a 2-week cadence 🔐](https://www.notion.so/artsy/2-week-Release-Cadence-f3427549d9cb4d8b809ad16c57338c2d), submitting the Monday after a sprint starts. We want engineers and stakeholders to be able to ship and test work without making in progress work visible to our users. To support this, new features are put behind **feature flags**.

A feature flag in eigen is simply a boolean value that decides whether a particular feature should be available in the app. Whether this value is 'true' or 'false' depends on two things:

- Whether the feature is ready for release.
- Whether the feature has been added to our remote feature configuration service [echo](https://github.com/artsy/echo).

To illustrate how these two work together, let's go through an example scenario.

## Adding a feature flag

Let's say you want to add a new feature, called "Marketing Banners". We'll add a new feature flag called `ARShowMarketingBanner` (this naming is a convention we borrow from Objective-C).

In the file `features.ts`

```diff
   AROptionsNewFirstInquiry: {
     readyForRelease: true,
     echoFlagKey: "AROptionsNewFirstInquiry",
   },
+  ARShowMarketingBanner: {
+    readyForRelease: false,
+    description: "Show new marketing banners",
+    showInAdminMenu: true,
+  },
   AROptionsInquiryCheckout: {
     readyForRelease: false,
     description: "Enable inquiry checkout",
     showInAdminMenu: true,
   }
```

Adding the `description` property makes it possible to override the feature flag from the admin menu.

You can access the feature flag in a functional react component using `useFeatureFlag`.

```diff
+ const showBanner = useFeatureFlag("ARShowMarketingBanner")
  return (
    <>
      <TitleView />
      <SummaryView />
+     { showBanner && <MarketingBanner /> }
    <>
  )
```

If you need to use the feature flag outside of a functional react component, use `unsafe_getFeatureFlag("ARShowMarketingBanner")`. This is marked as unsafe because it will not cause react components to re-render, but it safe to use in non-reactive contexts, like an `onPress` handler.

### Overriding a feature flag

To test your feature on a physical or virtual device, you will need to override the feature flag from the admin menu. For iOS this can be done by logging in to the app with an admin account, enabling developer mode in Profile > About and tapping "Version" 7 times quickly, then either shaking your physical device or clicking Device > Shake in the Simulator menu bar.

### Writing test with a feature flag

There is a utility method that can be used by tests that need to override a feature flag.

```ts
__globalStoreTestUtils__?.injectFeatureFlags({ ARShowMarketingBanner: true })
```

## Releasing a feature

When your feature is ready for release, the simplest way to do that is to set `readyForRelease` to `true` in `features.ts`. Consider also removing the entry from the admin menu if developers will no longer need to override the flag.

```diff
   ARShowMarketingBanner: {
-    readyForRelease: false,
+    readyForRelease: true,
     description: "Show new marketing banners",
-    showInAdminMenu: true,
+    showInAdminMenu: false,
   },
```

Alternatively, or at some point in the future, you can simply delete the feature flag and all the conditional branches associated with it.

However, often for complex features we want the ability to turn the feature off if something goes horribly wrong. To provide that ability, you should add an echo flag with the same name. [Here's an example PR for how to do that](https://github.com/artsy/echo/pull/70/files).

After adding the echo key, update you local copy of echo by running `./scripts/fetch-echo`.

Then when you mark the feature as being ready for release you can link the feature to the echo flag by specifying the key.

```diff
   ARShowMarketingBanner: {
-    readyForRelease: false,
+    readyForRelease: true,
+    echoFlagKey: "ARShowMarketingBanner"
     description: "Show new marketing banners",
   },
```

With this setup, the echo flag will be the source of truth for whether or not to enable the feature. You can turn the echo flag off or on to control the feature for all users.

## QAing

You can find documentation about how to do QA on the new shiny feature [here](https://www.notion.so/artsy/Setting-up-a-QA-script-for-a-New-Feature-from-a-non-MX-Team-5569acfd38f84c4b80e9af5c1d5389e8).

There is also the general QA page [here](https://www.notion.so/artsy/QA-decba0c3a57a4508b726f3a8624ceca3).

## Removing a Feature Flag

Once a feature flag is no longer needed, it can be removed from the `features.ts` file. If that feature has no `echoFlagKey`, then removing it from `features.ts` and all the uses of the flag is all you need to do. If it **does** have an `echoFlagKey`, then a small PR on [echo](https://github.com/artsy/echo) is needed after your PR on eigen is done. You can find an [example here](https://github.com/artsy/echo/pull/86). This is needed so we can remove that flag from echo as well, after giving it a few months buffer, for all users to get the new version of the app with the flag removed.

## Still Need Help?

Ask for help in the #practice-mobile slack channel, we will be happy to assist!
