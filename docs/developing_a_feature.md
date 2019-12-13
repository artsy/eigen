# How to develop a feature in Emission

Developing new features in Emission can be a little tricky. For very small features (like adding a single new label to a view), just send a pull request. The complicated part is when adding big features features: things that will take longer than a sprint to fully build and test.

[Artsy releases the app on a 2-week cadence 🔐](https://www.notion.so/artsy/2-week-Release-Cadence-f3427549d9cb4d8b809ad16c57338c2d), submitting the Monday after a sprint starts. To support this process, new features are put behind "options" so that in-progress work can be shipped without actually being visible to users. Here's how it works at a high-level:

- Work is put behind a "lab option", which can only be enabled in the admin menu (shake your device). [Here is an example pull request adding a lab option](https://github.com/artsy/eigen/pull/2934).
- When the feature is ready to be released to users, we replace the lab option with an "Echo Feature." [Echo](https://github.com/artsy/echo) is Artsy's feature-flag-as-a-service. We would put a new features behind an Echo Feature so that, in case we accidentally ship a catastrophic bug, we can disable the feature remotely until we fix it. [Here is an example pull request adding an Echo Feature](https://github.com/artsy/eigen/pull/2937).

In the past, we have used both simultaneously, using a logical or (`||`) to enable the feature: either the lab option _or_ the Echo Feature needed to be enabled. This caused a lot of problems (see note below). The current recommendation is **first add a lab option** while you're developing the feature. Once the feature is fully QA'd and ready to go live for users, **then replace the lab option with the Echo Feature**. Use the same name for both the lab option and the Echo Feature.

<details><summary>What's wrong with logic or-ing lab options and Echo Features?</summary>

The problem is that it conflates the responsibilities of lab options and Echo Features. Lab options are used for admins to see in-progress work; Echo Features are a safety valve so we can disable new features in the event of a catastrohpic bug. If we ship a build that respects the Echo Feature but only has in-progress work, then users who install that version but don't upgrade to the fully-featured version will see that in-progress work.

</details>

Both lab options and Echo Features [get injected into Emission's `options` automatically](https://github.com/artsy/eigen/blob/d9fd4a5c7a95204bda3c5728aa22b2c6e716e57f/Artsy/App/ARAppDelegate%2BEmission.m#L308-L321). See the [Using an Emission Option](#using-an-emission-option) section below for how to actually use these options.

## Adding a Lab Option

Let's say you want to add a new feature, called "Marketing Banners". We'll add a new lab option called `ARShowMarketingBanner` (this naming is a convention we borrow from Objective-C). You can access the lab options using through `NativeModules.Emission.options`.

But where are these options set? There are two places and you need to do them both.

### Emission (Development)

Inside the development "Example" app (the green icon, Emission) you expose the ability to toggle options via
[`/Example/Emission/ARLabOptions.m`](/Example/Emission/ARLabOptions.m) and [`/Example/Emission/ARLabOptions.h`](/Example/Emission/ARLabOptions.h) - you use the Objective-C hash `options` (note: you prefix strings/bools with an `@`)

Changing [`ARLabOptions.m`](/Example/Emission/ARLabOptions.m) to add a new option would look like:

```diff
    options = @{
+        @"ARShowMarketingBanner": @"Show the new marketing banner in the Artist page"
    };
```

You'll need to re-compile the iOS app to make this show up on your launch screen in the app.

### Eigen (Betas + App Store release)

Eigen has the same setup as above. In this case, they are in [`/Artsy/App/AROptions.m`](https://github.com/artsy/eigen/blob/master/Artsy/App/AROptions.m) and [`/Artsy/App/AROptions.h`](https://github.com/artsy/eigen/blob/master/Artsy/App/AROptions.h) - the files are a bit more complicated, but in the end there's still an `options` has that you can use to set your option in.

This change makes the option available to be toggled by any admin: they can shake their phones to see the admin menu in Eigen.

## Adding an Echo Feature

The other way for Artsy to make configuration changes is via [Artsy Echo](https://github.com/artsy/echo) - Echo has a concept [called Features](https://echo-web-production.herokuapp.com/accounts/1/features) which are boolean options for features. **The Features here are synced across all users devices, in Production** (so be conservative about changes for people's bandwidth) and will be applied on the next launch of an app.

An lab option enabled in the Eigen admin screen will override whatever the Echo Feature is set to.

If you make Echo changes, you can update the local bundled copy of the echo settings by running `make update_echo` in Eigen. This is done automatically when running `pod install`.

## Using an Emission Option

What do we mean when we say "a new feature should be **put behind** a lab option or Echo Feature"? It means that the behaviour of the app changes depending on if this option is set. This can look like adding a new view to the hierarchy _if_ the option is set:

```diff
+ const enableNewAndExcitingFeature =
+   NativeModules.Emission &&
+   NativeModules.Emission.options &&
+   NativeModules.Emission.options.AROptionsNewAndExcitingFeature
  return (<>
    <TitleView />
    <SummaryView />
+   { enableNewAndExcitingFeature && <NewAndExcitingFeature /> }
  <>)
```

This works for when changing a part of Emission that already exists. But when we add _entirely new_ things to Emission, it's often the case that _Eigen_ needs to use the option instead. (For example, [when adding a new Partner profile page](https://github.com/artsy/eigen/pull/2947).) This looks different on a case-by-base basis, and you can ask for help in the #front-end-ios Slack channel if you get stuck.
