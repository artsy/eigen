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

## Adding a New Screen (Optional)

If you want to be able to navigate to your component as a standalone screen, you need to register it in `AppRegistry.tsx`.

Open `AppRegistry.tsx` and import your component.

```tsx
import MyNewComponent from "./Components/Path/To/MyNewComponent"
```

Then add a line near the bottom which looks like the following:

```tsx
register("/my-new-screen", "MyNewComponent", MyNewComponent)
```

Now if you use the switchboard to navigate to the new screen, it will show your new component

```tsx
SwitchBoard.presentNavigationViewController(this, "/my-new-screen")
```

### Adding parameters

You can add route parameters with the standard colon-based syntax

```tsx
register("/my-new-screen/:entityID", "MyNewComponent", MyNewComponent)
```

Then when you navigate to your screen with a href like `"/my-new-screen/brad-pitt"`, `MyNewComponent` will be passed the props `{entityID: "brad-pitt"}`

Additional query string parameters will also be passed as props, e.g. `"/my-new-screen/brad-pitt?actor=true"` => `{entityID: "brad-pitt", actor: "true"}`
