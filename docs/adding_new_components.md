# Adding a New Component

Emission is a few things:

* A native example app that uses React Native components.
* A CocoaPod to consume components as `UIViewController` subclasses.
* An NPM module to manage these components.

Adding a new component to Emission to be used in [Eigen][] involves all three! But don't worry, it's not difficult. (You can look at [this pr adding an empty component][pr] for a kind of "Hello World" for this work.)

## Create the React Native Component

Create a new file in the `src/lib/Components` directory. You'll likely need to create a subdirectory with a good name, too. Create a basic component.

```tsx
import React from "react"
import SerifText from "../../../Components/Text/Serif"

export class MyNewComponent extends React.Component {
  render() {
    return <SerifText>Hello world!</SerifText>
  }
}
```

## Add the Component to Storybooks

You'll want to add your component to our storybooks so it can be rapidly iterated upon. In the directory that your new component lives in, create another directory called `__stores__` and add a file named something like `MyNewComponent.story.tsx`. Then add something _like_ the following:

```tsx
import { storiesOf } from "@storybook/react-native"
import React from "react"
import { MyNewComponent } from "../MyNewComponent"

storiesOf("MyNewComponent").add("Show default component", () => {
  return <MyNewComponent />
})
```

Rerun `yarn start`. This will pick up the new storybook and modify the `storyLoader.js` to add it to Emission's storybooks. You should now be able to run the Emission app and see the component through your storybook browser.

## Adding a Native Controller (Optional)

Emission can export components through its CocoaPod to be consumed by Eigen. This isn't necessary for new components like buttons or grids, but will be necessary if any part of Eigen needs to use the new component directly.

We need to add the component to our app registry. Open `AppRegistry.tsx` and add an import statement for the component:

```tsx
import MyNewComponent from "./Components/Path/To/MyNewComponent"
```

And add the following line with the rest of the calls to `registerComponent()`:

```tsx
AppRegistry.registerComponent("MyNewComponent", () => MyNewComponent)
```

This will expose the component as a module that can be loaded in our view controller, which we'll create now.

Create two new files in the `Pod/Classes/ViewControllers` directory, named `ARMyNewComponentViewController.h` and `ARMyNewComponentViewController.m`. You need to include `AR` at the beginning of these file names, and the beginning of your class name. This uses Objective-C, so don't be shy about asking for help in Slack. In the `.h` header file, add something like:

```objc
#import <Emission/ARComponentViewController.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARMyNewComponentViewController : ARComponentViewController

- (instancetype)initWithSomeIDThatEmissionNeeds:(NSString *)someID NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@property (nonatomic, copy) NSString *someID;

@end

NS_ASSUME_NONNULL_END
```

Okay now for the `.m` implementation file:

```objc
#import "ARMyNewComponentViewController.h"

@implementation ARMyNewComponentViewController

- (instancetype)initWithSomeIDThatEmissionNeeds:(NSString *)someID
{
  if ((self = [super initWithEmission:nil
                           moduleName:@"MyNewComponent"
                    initialProperties:@{ @"someID": someID }])) {
    _someID = someID;
  }
  return self;
}

@end
```

Okay. With the new view controllers created, `cd` into the `Example` directory and re-run `bundle exec pod install` to integrate the new view controller into the Example app.

Once that's finished, open `Emission.xcworkspace` in Xcode and navigate to `ARRootViewController.m`. Add an import statement at the top, like:

```objc
#import <Emission/ARMyNewComponentViewController.h>
```

Then add a line like the following to the `jumpToViewControllersSection` method:

```objc
[sectionData addCellData:self.jumpToMyNewComponent];
```

You'll need to add the `jumpToMyNewComponent` method to this file. Let's write that here:

```objc
- (ARCellData *)jumpToMyNewComponent
{
  return [self tappableCellDataWithTitle:@"My New Component" selection: ^{
    [self.navigationController pushViewController:[[ARMyNewComponentViewController alloc] initWithSomeID:@"some-id-the-component-needs"] animated:YES];
  }];
}
```

Add whatever example props that the controller needs here.

Recompile the app and you _should_ see it listed in the "View Controllers" section of the Emission home screen. Nice!

## Next Steps

In order for Eigen to use the new view controller, you'll need to cut a new release of Emission. [Deploy instructions are documented in the readme][deploy]. Once a new CocoaPod version is uploaded to the [Artsy Specs repo][specs], open Eigen. Update Emission with `bundle exec pod update Emission` and your new component can be `#import`'d and used as a native view controller. Nice!

[eigen]: https://github.com/artsy/eigen
[pr]: https://github.com/artsy/emission/pull/1003
[deploy]: https://github.com/artsy/emission#deployment
[specs]: https://github.com/artsy/Specs
