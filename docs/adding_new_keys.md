# Adding a New Key

We use [`cocoapods-keys`](https://github.com/orta/cocoapods-keys) to store secrets (similar to a `.env` file). In order to expose these keys to our react-native components we must do a fair bit of setup.

Links to examples below come from [this commit](https://github.com/artsy/emission/pull/1086/commits/4a2a3e9260e97d791536cf38376a06b0ad0946a8) which adds a key for the Stripe API.

## Steps

#### 1. Add the key to the app's Podfile.

This is the extent of `cocoapods-keys` official setup, and after this you **could** set the key via `pod keys set <NAME>` or `pod install`... but we have more to do.
[Example/Podfile](https://github.com/artsy/emission/blob/4a2a3e9260e97d791536cf38376a06b0ad0946a8/Example/Podfile#L63)

```diff
plugin 'cocoapods-keys', {
  :target => 'Emission',
  :keys => [
    'ArtsyAPIClientSecret',   # Authing to the Artsy API
    'ArtsyAPIClientKey',      #
+    'StripePublishableKey',
  ]
}
```

---

#### 2. Expose the keys in the `AREmission` module

We'll need to update the `initWithUserId...` function, expose the new key as a property and add it to `constantsToExport`.

[AREmission.h](https://github.com/artsy/emission/blob/4a2a3e9260e97d791536cf38376a06b0ad0946a8/Pod/Classes/Core/AREmission.h#L17-L34):

```diff
// ENV Variables
+ @property (nonatomic, copy, readonly, nullable) NSString *stripePublishableKey;

# ...

 - (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)token
                     sentryDSN:(nullable NSString *)sentryDSN
+         stripePublishableKey:(NSString *)stripePublishableKey
              googleMapsAPIKey:(nullable NSString *)googleAPIKey
                    gravityURL:(NSString *)gravity
                metaphysicsURL:(NSString *)metaphysics
                     userAgent:(NSString *)userAgent;
```

[AREmission.m](https://github.com/artsy/emission/blob/4a2a3e9260e97d791536cf38376a06b0ad0946a8/Pod/Classes/Core/AREmission.m#L24-L60):

```diff
 - (NSDictionary *)constantsToExport
 {
   return @{
     # Add this line...
+    @"stripePublishableKey": self.stripePublishableKey ?: @"",
     # ...
   };
 }

 - (instancetype)initWithUserID:(NSString *)userID
            authenticationToken:(NSString *)token
                      sentryDSN:(NSString *)sentryDSN
+          stripePublishableKey:(NSString *)stripePublishableKey
               googleMapsAPIKey:(NSString *)googleAPIKey
                     gravityURL:(NSString *)gravity
                 metaphysicsURL:(NSString *)metaphysics
                      userAgent:(nonnull NSString *)userAgent
 {
     self = [super init];
     _userID = userID.copy;
     # ... More copies...
+    _stripePublishableKey = stripePublishableKey.copy;
     return self;
 }
```

---

#### 3. Use that configured key in a `react-native` component.

`Emission` is now exposed along with its configured keys via `react-native`'s `NativeModules`.

```tsx
import { NativeModules } from "react-native"
const Emission = NativeModules.Emission || {}

// ... other setup ...

stripe.setOptions({
  publishableKey: Emission.stripePublishableKey,
})
```

---

#### 4. Add any default setup to the Makefile

[Makefile](https://github.com/artsy/emission/blob/4a2a3e9260e97d791536cf38376a06b0ad0946a8/Makefile#L56)

```sh
oss:
  @echo "Installing Cocoa Dependencies"
  cd Example && bundle exec pod keys set ArtsyAPIClientKey "e750db60ac506978fc70"
  # Hidden keys by convention are set to a single dash
  cd Example && bundle exec pod keys set StripePublishableKey "-"
  # ...And so on
```
