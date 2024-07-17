# Adding a New Component

Adding a new component involves a few pieces of work! But don't worry, it's not difficult. (You can look at [this pr adding an empty component](https://github.com/artsy/emission/pull/1003) for a kind of "Hello World" for this work.)

## Create the React Native Component

Create a new file in the `src/app/Components` directory. You'll likely need to create a subdirectory with a good name, too. Create a basic component.

```tsx
import { Text } from "@artsy/palette-mobile"

interface OurProps {
  whatever: string
}

export const MyNewComponent: React.FC<OurProps> = (props) => {
  const someFunStuff = useACoolHook()
  return <Text variant="lg-display">Hello world!</Text>
}
```

## Adding a new screen (Optional)

To add your component as a new screen, open `AppRegistry.tsx` and add an import statement for the component:

```tsx
import MyNewComponent from "./Components/Path/To/MyNewComponent"
```

And add an entry to the `modules` object.

```diff
  FullFeaturedArtistList: { Component: CollectionFullFeaturedArtistListQueryRenderer },
  Gene: { Component: Gene },
+ MyNewComponent: {Component: MyNewComponent},
  Home: { Component: HomeQueryRenderer, isRootViewForTabName: "home" },
  Inbox: { Component: Inbox, isRootViewForTabName: "inbox" },
```

Then add a route in `routes.tsx`

```diff
  addRoute("/fair/:fairID/info", "FairMoreInfo"),
+ addRoute("/my-new-component", "MyNewComponent"),
  addRoute("/city/:citySlug/:section", "CitySectionList"),
  addRoute("/city-fair/:citySlug", "CityFairList"),
```

Any path parameters you declare in the route (using the `/foo/:paramName/bar` syntax) will be passed as props to your component.

Similarly, any uri query parameters folks include when navigating to your screen will be passed as props to your component.

So for the route matcher `new RouteMatcher("/city-fair/:citySlug", "CityFairList")` and the path `/city-fair/london?show_controls=false` we will essentially mount a new screen like `<CityFairList citySlug="london" show_controls="false" />`
