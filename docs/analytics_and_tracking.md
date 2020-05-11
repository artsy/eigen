## Top level (AppRegistry)

Make sure to register a new screen/component using `trackWrap`

Now we have a function `trackWrap` that can wrap all components when we register them. So **use**:
```typescript
AppRegistry.registerComponent("Inquiry", trackWrap(Inquiry))
```
**instead of**:
```typescript

AppRegistry.registerComponent("Inquiry", () => Inquiry)
```

This will make sure that `Inqury` is wrapped properly with the tracking context it's needed, regardless of it being a func or a class component.

## Inside React components

Make sure to declare all the track events and context in a dedicated place somewhere below the component code, something along the lines of:
```typescript
export const tracks = {
  context: (ownerId: string, slug: string) => ({
    context_screen: Schema.PageNames.ViewingRoom,
    context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    context_screen_owner_id: ownerId,
    context_screen_owner_slug: slug,
  }),
  tappedArtworkGroupThumbnail: (internalID: string, slug: string) => ({
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
export const MyFuncComp: React.FC<Props> = props => {
  const id = 42
  return (
    <ProvideScreenTracking info={tracks.context(id, 'aSlug')}> 
      <View />
    </ProvideScreenTracking> 
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
export const MyFuncComp: React.FC<Props> = props => {
  const { trackEvent } = useTracking()

  const follow = () => {
    trackEvent(tracks.tappedFollow())
    actuallyDoTheFollow()
  }

  return <View />
}
```
**In this case, you can also use `trackEvent` at any point, to track, for example, the "request" part and the "success" and "failure" part, all using one function to do the `follow`.**

**⚠️ Warning:**
If we need to track functions using `useTracking` inside a *screen* compoment (that we are also `ProvideScreenTracking`), then we need to split these into two components, one that is the *screen* component with the provider, and one that is the *inside* component with the tracking hook.
The reason for this is that the current `useTracking` hook is expecting a provider to exist already, but since the hook would be initialized before the first render, the provider would not exist yet. That would cause the function tracking to miss the screen-level context tracking.


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
