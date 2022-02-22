### Use cohesion for all new tracking code

Use [cohesion](https://github.com/artsy/cohesion) events for all new tracking code. Cohesion is an artsy library for keeping analytics across our applications _cohesive_, it defines schemas for tracking code. It was recently adopted in Eigen so there still exists a lot of tracking code and helpers not using cohesion, all new tracking code should use cohesion if at all possible.

## Inside React components

Make sure to declare all the track events and context in a dedicated place somewhere below the component code, something along the lines of:

```typescript
const tracks = {
  tappedArtworkGroupThumbnail: (internalID: string, slug: string): TappedArtworkGroupThumbnail => ({
    action_name: Schema.ActionNames.TappedArtworkGroup,
    context_module: Schema.ContextModules.ViewingRoomArtworkRail,
    destination_screen: Schema.PageNames.ArtworkPage,
    destination_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
    destination_screen_owner_id: internalID,
    destination_screen_owner_slug: slug,
    type: "thumbnail",
  }),
}
```

This will minimize the tracking code sprinkled over the component code to just one line per track event.

### Screen tracking

- To do screen tracking in a func component, use the `Provide` hook, like:

```typescript
export const MyFuncComp: React.FC<Props> = (props) => {
  const id = 42
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.myCollectionArtwork,
        context_screen_owner_id: artwork.internalID,
        context_screen_owner_slug: artwork.slug,
      })}
    >
      <View />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
```

**Notice that we need to wrap the component return code in a `<ScreenTrackingProvider>`.**

- To do screen tracking in a class component, use the `@screenTrack` decorator, like:

```typescript
@screenTrack(tracks.context())
export class MyClassComp extends React.Component<Props> {
  render() {
    return <View />
  }
}

const tracks = {
  context: () => ({
    context_screen: Schema.PageNames.Home,
    context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
  }),
}
```

### Function tracking

- To do function tracking in a func component, you can use the `useTracking` hook, like:

```typescript
export const MyFuncComp: React.FC<Props> = (props) => {
  const { trackEvent } = useTracking()

  const follow = () => {
    trackEvent(tracks.tappedFollow())
    actuallyDoTheFollow()
  }

  return <View />
}
```

In this case, you can also use `trackEvent` at any point, to track, for example, the "request" part and the "success" and "failure" part, all using one function to do the `follow`.

**⚠️ Warning:**
If we need to track functions using `useTracking` inside a _screen_ compoment (that we are also `ProvideScreenTracking`), then we need to split these into two components, one that is the _screen_ component with the provider, and one that is the _inside_ component with the tracking hook.
The reason for this is that the current `useTracking` hook is expecting a provider to exist already, but since the hook would be initialized before the first render, the provider would not exist yet. That would cause the function tracking to miss the screen-level context tracking.

For reference, here is a [commit](https://github.com/artsy/eigen/pull/3215/commits/1c36dd692d8eb82a2b13354fd9106b8b2d03a05c) of a [PR](https://github.com/artsy/eigen/pull/3215) that tackled this issue in that way. The code for `ViewingRoomViewWorksButton` was initially inline code that lived in `ViewingRoom`, but `ViewingRoom` is a screen component and it used the provider wrapper component `ProvideScreenTracking`. This meant that the `useTracking` hook couldn't find a provider when it was initialized, therefore the event `tappedViewWorksButton` didn't contain the necessary tracked context for the screen. In the commit above, the button component was moved to a separate component in a different file, and that ensured that the provider existed before the hook initialized, and therefore the tracked event contained the screen context.

- To do function tracking in a class component, you use the `@track` decorator, like:

```typescript
@track()
export class MyClassComp extends React.Component<Props> {
  @track(tracks.tappedFollow())
  follow() {
    actuallyDoTheFollow()
  }

  render() {
    return (
      <View>
        <Button title="follow" onPress={() => this.follow()} />
      </View>
    )
  }
}
```

**Notice that to call the function from the `Button` we need to do `() => this.follow()` or `this.follow.bind(this)`. Just `this.follow` is not enough to call the tracking wrapper code.**

### Testing tracking calls

To test these, the best way is something like the following:

```ts
import { mockTrackEvent } from "app/tests/globallyMockedStuff"

it("tracks analytics event when button is tapped", () => {
  const wrapper = renderWithWrappers(<TestScreen />)
  wrapper.root.findByType(OurButtonWithTracking).props.onPress()

  expect(mockTrackEvent).toHaveBeenCalledTimes(1)
  expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "action": "tappedInfoBubble",
        "context_module": "myCollectionArtwork",
        "context_screen_owner_id": "artwork-id",
        "context_screen_owner_slug": "artwork-slug",
        "context_screen_owner_type": "myCollectionArtwork",
        "subject": "demandIndex",
      },
    ]
  `)
})
```

You can start with an empty snapshot like `expect(trackEvent.mock.calls[0]).toMatchInlineSnapshot()` and when you run the tests, jest will fill it in. Then check if it is correct, and you are ready to commit.

If at some point the track properties change, then the snapshot will need to be updated. If there is a breakage and for some reason a property is not sent, then this snapshot will alert us correctly.
