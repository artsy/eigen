# How to Develop a Feature in Eigen

Developing new features in Eigen can be a little tricky. For very small features (like adding a single new label to a view), just send a pull request. For big features that will take longer than a sprint, things are a little more complicated.

[Artsy releases the app on a 2-week cadence 🔐](https://www.notion.so/artsy/2-week-Release-Cadence-f3427549d9cb4d8b809ad16c57338c2d), submitting the Monday after a sprint starts. We want engineers and stakeholders to be able to ship and test work without making in progress work visible to our users. To support this, new features are put behind **options**. There are two basic types of options in Eigen, **lab options** and **echo options/flags**.

- **Lab Options** should be used for engineers and stakeholders testing in progress work. Lab options can only be enabled in the admin menu (shake your device). [Here is an example pull request adding a lab option](https://github.com/artsy/eigen/pull/2934).

- **Echo Flags** should be used for releasing new features to users and provide a safety valve in the event of a catastrophic bug. [Echo](https://github.com/artsy/echo) is Artsy's feature-flag-as-a-service. If we ship a feature that ends up having a major bug, we can disable the feature remotely until we fix it. [Here is an example pull request adding an Echo Feature](https://github.com/artsy/eigen/pull/3414).

Both lab options and Echo Features [get injected into Emission's `options` automatically](https://github.com/artsy/eigen/blob/d9fd4a5c7a95204bda3c5728aa22b2c6e716e57f/Artsy/App/ARAppDelegate%2BEmission.m#L308-L321). See the [Using an option in Emission](#using-an-option-in-emission) section below for how to actually use these options.

The normal workflow for engineers is to first **add a lab option and put all feature development behind it**. Then when it comes time to release **replace that lab option with an echo flag and enable the flag server side**.

## Adding a Lab Option

Let's say you want to add a new feature, called "Marketing Banners". We'll add a new lab option called `ARShowMarketingBanner` (this naming is a convention we borrow from Objective-C). You can access the lab options using through `NativeModules.Emission.options`.

But where are these options set? There are two places and you need to do them both.

### Eigen

Inside Eigen you expose the ability to toggle options via
[`/Artsy/App/AROptions.m`](https://github.com/artsy/eigen/blob/master/Artsy/App/AROptions.m) and [`/Artsy/App/AROptions.h`](https://github.com/artsy/eigen/blob/master/Artsy/App/AROptions.h) - you use the Objective-C hash `options` (note: you prefix strings/bools with an `@`). These files are a bit complicated but you only have to worry about changing in a few places.

Changing [`/Artsy/App/AROptions.m`](https://github.com/artsy/eigen/blob/master/Artsy/App/AROptions.m) to add a new option would look like:

1. Define your option in the header file (.h):

`extern NSString *const ARShowMarketingBanner;`

2. Define your option in the implementation file (.m) and add to the options hash:

`NSString *const ARShowMarketingBanner = @"ARShowMarketingBanner";`

```diff
    options = @{
+        ARShowMarketingBanner: @"Show the new marketing banner in the Artist page"
    };
```

You'll need to re-compile the iOS app to make this show up on your launch screen in the app.
This change makes the option available to be toggled by any admin: they can shake their phones to see the admin menu in Eigen.

## Using an option in Emission

What do we mean when we say "a new feature should be **put behind** a lab option or Echo Feature"? It means that the behaviour of the app changes depending on if this option is set. :

1. Add your option to the Emission types file [`/typings/emission.d.ts`](https://github.com/artsy/eigen/blob/master/typings/emission.d.ts)

2. Then update Jest's setup file [`src/setupJest.ts`](https://github.com/artsy/eigen/blob/master/src/setupJest.ts#L145).

```diff

  NativeModules.ARNotificationsManager = {
    nativeState: {
      selectedTab: "home",
      emissionOptions: {
        AROptionsEnableMyCollection: false,
+       AROptionsNewAndExcitingFeature: false,
        ....
      },
    ...
  }

}

func setupEmissionModule() {
  ....
  options: {
+  AROptionsNewAndExcitingFeature: false,
   AROptionsLotConditionReport: false,
   AROptionsFilterCollectionsArtworks: false,
   .....
  }
}
```

2. Use your option in code, here we are adding a new view to the hierarchy _if_ the options is set.

```diff
+ const enableNewAndExcitingFeature = NativeModules.Emission.options.AROptionsNewAndExcitingFeature
  return (<>
    <TitleView />
    <SummaryView />
+   { enableNewAndExcitingFeature && <NewAndExcitingFeature /> }
  <>)
```

This works for when changing a part of Emission that already exists. But when we add _entirely new_ things to Emission, it's often the case that _Eigen_ needs to use the option instead. (For example, [when adding a new Partner profile page](https://github.com/artsy/eigen/pull/2947).) This looks different on a case-by-base basis, and you can ask for help in the #front-end-ios Slack channel if you get stuck.

## Replacing a lab option with an Echo Flag

[Artsy Echo](https://github.com/artsy/echo) has a concept [called Features](https://echo-web-production.herokuapp.com/accounts/1/features) which are boolean options for features. **The Features here are synced across all users devices, in Production** (so be conservative about changes for people's bandwidth) and will be applied on the next launch of an app.

When it comes time to release to users you will need to replace your lab option checks with echo flag checks. It is important to **replace/remove the corresponding lab option otherwise it will override the echo flag and your feature won't be visible to users.**

1. First remove your lab option from AROptions.m:
   https://github.com/artsy/eigen/pull/3421

2. Then update any native code that was using your lab option to use the new echo flag:
   https://github.com/artsy/eigen/pull/3414/files#diff-08bc1f903d1666ba6981aab6540e8299R450

3. Enable the feature in [Artsy Echo](https://github.com/artsy/echo)

Any code on the Emission (React Native) side using your option can stay the same if the option still has the same name.

If you make Echo changes, you can update the local bundled copy of the echo settings by running `make update_echo` in Eigen. This is done automatically when running `pod install`.

## QAing

You can find documentation about how to do QA on the new shiny feature [here](https://www.notion.so/artsy/Setting-up-a-QA-script-for-a-New-Feature-from-a-non-MX-Team-5569acfd38f84c4b80e9af5c1d5389e8).

There is also the general QA page [here](https://www.notion.so/artsy/QA-decba0c3a57a4508b726f3a8624ceca3).

## FAQs

### Why do we need to remove the lab flag when adding echo flag?

In the past, we have used both simultaneously, using a logical or (`||`) to enable the feature: either the lab option _or_ the Echo Feature needed to be enabled. This caused a lot of problems (see note below). The current recommendation is **first add a lab option** while you're developing the feature. Once the feature is fully QA'd and ready to go live for users, then **replace the lab option with the Echo Feature**. Use the same name for both the lab option and the Echo Feature.

<details><summary>What's wrong with logic or-ing lab options and Echo Features?</summary>

The problem is that it conflates the responsibilities of lab options and Echo Features. Lab options are used for admins to see in-progress work; Echo Features are a safety valve so we can disable new features in the event of a catastrophic bug. If we ship a build that respects the Echo Feature but only has in-progress work, then users who install that version but don't upgrade to the fully-featured version will see that in-progress work.

</details>

## Still Need Help?

Ask for help in the #front-end-ios slack channel, we will be happy to assist!
