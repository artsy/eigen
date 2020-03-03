# Adding a New Component

Adding a new component involves a few pieces of work! But don't worry, it's not difficult. (You can look at [this pr adding an empty component](https://github.com/artsy/emission/pull/1003) for a kind of "Hello World" for this work.)

## Create the React Native Component

Create a new file in the `src/lib/Components` directory. You'll likely need to create a subdirectory with a good name, too. Create a basic component.

```tsx
import { Serif } from "@artsy/palette"
import React from "react"

export class MyNewComponent extends React.Component {
  render() {
    return <Serif size="3t">Hello world!</Serif>
  }
}
```

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

Create two new files in the `Pod/Classes/ViewControllers` directory, named `ARMyNewComponentViewController.h` and `ARMyNewComponentViewController.m`. You need to include `AR` at the beginning of these file names, and the beginning of your class name. This uses Objective-C, so don't be shy about asking for help in Slack. In the `.h` header file, add something _like_ this.

```objc
#import <Emission/ARComponentViewController.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARMyNewComponentViewController: ARComponentViewController

- (instancetype)initWithSomeIDThatEmissionNeeds:(NSString *)someID NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@property (nonatomic, readonly) NSString *someID;

@end

NS_ASSUME_NONNULL_END
```

We say _like_ this because the specifics will depend on your needs. Our `MyNewComponent` React component doesn't have any props, but if it did then we would include those props here as parameters to the initializer, and as Objective-C properties. (Objective-C convention is that any parameters to an object's initializer should be properties, often `readonly` ones.) Look at the other header files in the `Pod/Classes/ViewControllers` for examples.

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

Again, this will vary depending on the props that you're injecting in. Look for a `.h` file that matches your use case, and then look at its corresponding `.m` file.

Okay. With the new view controllers created, re-run `bundle exec pod install` to integrate the new view controller into the app. You can now add routing to this in `ARSwitchBoard.md` ([see example PR](https://github.com/artsy/eigen/pull/3039)).
