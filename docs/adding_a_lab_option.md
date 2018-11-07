# How to add a new lab option to Emission

Let's say you want to add something which is defaulted to hidden. We'll call the variable `showMarketingBanner`.

1. Start by going to [`src/lib/options.ts`](src/lib/options.ts) and extend the interface with your new option.
2. Go to your JS code, and import `lib/options` and use `options.showMarketingBanner` to handle your logic

OK, now to understand how this gets set, there are three ways:

### Emission

Inside the development environment app (the green icon, Emission) you expose the ability to toggle options via
[`/Example/Emission/ARLabOptions.m`](/Example/Emission/ARLabOptions.m) and [`/Example/Emission/ARLabOptions.h`](/Example/Emission/ARLabOptions.h) - you use the Objective-C hash `options` (note: you prefix strings/bools with an `@`)

Changing [`ARLabOptions.m`](/Example/Emission/ARLabOptions.m) to add a new option would look like:

```diff
    options = @{
       @"nothingYet": @"No feature flags available"
+        @"showMarketingBanner": @"Show the new marketing banner in the Artist page"
    };
```

You'll need to re-compile the iOS app to make this show up on your launch screen in the app.

### Eigen

Eigen has the same setup as above. In this case, they are in [`/Artsy/App/AROptions.m`](https://github.com/artsy/eigen/blob/master/Artsy/App/AROptions.m) and [`/Artsy/App/AROptions.h`](https://github.com/artsy/eigen/blob/master/Artsy/App/AROptions.h) - the files are a bit more complicated, but in the end there's still an `options` has that you can use to set your option in.

This ^ makes the option available to be toggled by any admin, they can shake their phones to see the admin menu in Eigen.

The additional way for you to make option changes is via [Artsy Echo](https://github.com/artsy/echo) - Echo has a concept [called Features](https://echo-web-production.herokuapp.com/accounts/1/features) which are boolean options for features. Any feature set here is synced across all devices (so be conservative about changes for people's bandwidth) and will be applied on the next launch of an app.

An admin setting in the Eigen admin screen can override defaults that come in from echo.

If you make echo changes, ideally you should update the local bundled copy of the echo settings by running `make update_echo` in Eigen.
