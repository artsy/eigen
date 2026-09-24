# Analytics and tracking

We track user behavior with [Cohesion](https://github.com/artsy/cohesion), Artsy's schema library for analytics events; use it for all new tracking code. Cohesion types each event, so a missing or misspelled field fails `yarn type-check` instead of shipping broken data. `react-tracking` carries the event from your code to Segment.

### Contents

- [Analytics and tracking](#analytics-and-tracking)
  - [Contents](#contents)
  - [Write the tracking hook](#write-the-tracking-hook)
    - [When one event is enough](#when-one-event-is-enough)
    - [Name the methods after the event](#name-the-methods-after-the-event)
  - [Choose the right context fields](#choose-the-right-context-fields)
  - [Track a screen view](#track-a-screen-view)
  - [Track list impressions](#track-list-impressions)
  - [Test your tracking](#test-your-tracking)
  - [Legacy patterns](#legacy-patterns)
  - [Still need help?](#still-need-help)

## Write the tracking hook

Put every event for a scene in one hook under the scene's `hooks/` folder, named `use<Scene>Tracking.ts`. The hook owns `useTracking()`, annotates each payload with its Cohesion event type, and calls `trackEvent` itself:

```typescript
// src/app/Scenes/MyScene/hooks/useMySceneTracking.ts
import { ActionType, ContextModule, FollowedArtist, OwnerType } from "@artsy/cohesion"
import { useMemo } from "react"
import { useTracking } from "react-tracking"

interface FollowedArtistProps {
  artistID: string
  artistSlug: string
}

export const useMySceneTracking = () => {
  const { trackEvent } = useTracking()

  return useMemo(
    () => ({
      followedArtist: ({ artistID, artistSlug }: FollowedArtistProps) => {
        const payload: FollowedArtist = {
          action: ActionType.followedArtist,
          context_module: ContextModule.artistHeader,
          context_owner_type: OwnerType.artist,
          owner_id: artistID,
          owner_slug: artistSlug,
          owner_type: OwnerType.artist,
        }

        trackEvent(payload)
      },
    }),
    [trackEvent]
  )
}
```

A component calls it like this:

```typescript
export const MyFuncComp: React.FC<Props> = (props) => {
  const tracks = useMySceneTracking()

  const follow = () => {
    tracks.followedArtist({ artistID: props.artistID, artistSlug: props.artistSlug })
    actuallyDoTheFollow()
  }

  return <View />
}
```

You can call a hook method at any point, so one function can track a request, a success, and a failure, each with its own event.

Annotating `payload` with the Cohesion event type means a missing or misspelled field fails `yarn type-check` instead of shipping a broken event. A single object argument keeps the call site readable when an event grows past two fields. Wrapping the object in `useMemo` keeps the returned methods referentially stable, so a caller can put one in a `useEffect` dependency array without re-firing on every render.

Older hooks return a plain object with no `useMemo`. That's fine and doesn't need rewriting. See [`useOrderDetailsTracking.ts`](../src/app/Scenes/OrderHistory/OrderDetails/hooks/useOrderDetailsTracking.ts) for a full hook and [`useArtAssistantTracking.ts`](../src/app/Scenes/ArtAssistant/hooks/useArtAssistantTracking.ts) for one that memoizes per method with `useCallback` instead.

### When one event is enough

Reach for a hook once a component tracks more than one event. If a component only ever tracks one, call `useTracking()` in the component and type the payload inline. [`ArticleShareButton.tsx`](../src/app/Scenes/Article/Components/ArticleShareButton.tsx):

```typescript
export const ArticleShareButton: React.FC<ArticleShareButtonProps> = (props) => {
  const tracking = useTracking()

  const trackShare = () => {
    const trackingEvent: TappedArticleShare = {
      action: ActionType.tappedArticleShare,
      context_module: ContextModule.article,
      context_screen_owner_type: OwnerType.article,
      context_screen_owner_id: data.internalID,
      context_screen_owner_slug: data.slug ?? "",
    }

    tracking.trackEvent(trackingEvent)
  }

  // ...
}
```

Move it into a hook as soon as a second event shows up. A hook is one more file and one more import; a component tracking three or four events without one ends up repeating `useTracking()` boilerplate and burying the render logic under payload objects.

### Name the methods after the event

Two naming styles coexist in the codebase. Some hooks mirror the Cohesion action name directly, like `useOrderDetailsTracking`'s `tappedBuyerProtection` for `ActionType.tappedBuyerProtection`. Others prefix every method with `track`, like `useArtAssistantTracking`'s `trackSuggestionTapped`. Prefer mirroring the action name: it reads as one name instead of two, and it's what most methods across the codebase already do (`useHomeViewTracking` alone has around 30 of them).

Whichever you pick, don't destructure `trackEvent` from `useTracking()` and then also name a hook method `trackEvent`. Keep the two apart by naming the destructured value `tracking` instead, and calling `tracking.trackEvent(payload)` from inside a method named after the event:

```typescript
export const useMySceneTracking = () => {
  const tracking = useTracking()

  return useMemo(
    () => ({
      followedArtist: ({ artistID, artistSlug }: FollowedArtistProps) => {
        const payload: FollowedArtist = {
          action: ActionType.followedArtist,
          context_module: ContextModule.artistHeader,
          context_owner_type: OwnerType.artist,
          owner_id: artistID,
          owner_slug: artistSlug,
          owner_type: OwnerType.artist,
        }

        tracking.trackEvent(payload)
      },
    }),
    [tracking]
  )
}
```

## Choose the right context fields

Three fields describe where an event happened:

- `context_module` is the affordance the user touched: a rail, a header, a sheet.
- `context_screen_owner_type` is the screen that affordance lives on. Most `Tapped*` events need this alongside `context_module`.
- `context_owner_type` is the field to use instead of `context_screen_owner_type` when the event isn't anchored to a screen at all, like `ExperimentViewed`, `Share`, `Impression`, or a follow or save.

Cohesion's TypeScript types enforce which fields a given event needs, so a payload that mixes them up fails `yarn type-check`. Segment records a screen call only when `action` is `ActionType.screen`; every other event is a track call, regardless of which context fields it carries.

## Track a screen view

Which tool to use depends on how the screen behaves:

| Screen behavior                                                       | Use                                                                          |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| A static screen, tracked once when it mounts                          | `ProvideScreenTrackingWithCohesionSchema`                                    |
| A tab screen that needs to re-track every time the user returns to it | a `screen` method on the scene's tracking hook, called from `useFocusEffect` |
| A card or carousel that shows one item at a time                      | a screen event fired when each item surfaces                                 |

For a static screen, wrap it in `ProvideScreenTrackingWithCohesionSchema` and build the payload with the `screen()` helper:

```typescript
export const MyFuncComp: React.FC<Props> = ({ artwork }) => {
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

`ProvideScreenTrackingWithCohesionSchema` fires once, on mount, and never again. That's correct for a screen you navigate to and from, but wrong for a tab: switching tabs back to an already-mounted screen won't refire it. For a tab screen, give the scene's tracking hook a `screen` method and call it from `useFocusEffect`. `HomeView.tsx`:

```typescript
const tracking = useHomeViewTracking()

useFocusEffect(
  useCallback(() => {
    tracking.screen(OwnerType.home)
  }, [])
)
```

A card or carousel is a third case: the "screen" changes with every card, not with navigation. `InfiniteDiscovery.tsx` calls `track.displayedNewArtwork` each time a new card surfaces.

> `ProvideScreenTrackingWithCohesionSchema` only fires its own event on mount; it renders a plain `<React.Fragment>`, not react-tracking's `<Track>`, so it doesn't hand any context down to children. A tracking hook called by a child component gets nothing from it automatically.

## Track list impressions

To track which items in a HomeView rail a user actually saw, use `useItemsImpressionsTracking` from [`useImpressionsTracking.ts`](../src/app/Scenes/HomeView/hooks/useImpressionsTracking.ts). Spread its return value onto your list:

```typescript
const { onViewableItemsChanged, viewabilityConfig } = useItemsImpressionsTracking({
  isInViewport: true,
  contextModule: ContextModule.artworkGrid,
  contextScreenOwnerType: section.ownerType as OwnerType,
})
```

`contextScreenOwnerType` defaults to `OwnerType.home`, which is right for a rail on the Home screen itself (`HomeViewSectionArtworks.tsx` relies on that default) but wrong anywhere else. Pass it explicitly whenever the list isn't on the literal Home screen, as `HomeViewSectionScreenArtworks.tsx` does above. The hook tracks each item's id in a `Set` so a rescroll never fires the same impression twice, and the whole thing is gated behind the `ARImpressionsTrackingHomeItemViews` feature flag.

The hook currently lives under `Scenes/HomeView`, so a scene outside HomeView can't import it under the cross-scene import rule in [AGENTS.md](../AGENTS.md). If another scene needs the same pattern, move the hook to `app/utils/hooks` first.

> The hook takes a different code path under `__TEST__`, using plain `useState`/`useEffect` instead of the Reanimated viewability tracking it uses in production. That's why a list using this hook can behave differently in a test than on device.

## Test your tracking

Assert directly on the payload with `mockTrackEvent`:

```typescript
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"

it("tracks analytics event when button is tapped", () => {
  renderWithWrappers(<TestScreen />)

  fireEvent.press(screen.getByText("my button"))

  expect(mockTrackEvent).toHaveBeenCalledWith({
    action: "tappedInfoBubble",
    context_module: "myCollectionArtwork",
    context_screen_owner_id: "artwork-id",
    context_screen_owner_slug: "artwork-slug",
    context_screen_owner_type: "myCollectionArtwork",
    subject: "demandIndex",
  })
})
```

`mockTrackEvent` is wired up globally in Jest setup, so you don't need to mock `react-tracking` yourself, and it's cleared automatically between tests. A `jest.clearAllMocks()` for it in your own test is redundant.

The same assertion works for a screen view, as in `ArtAssistant.tests.tsx`:

```typescript
it("reports the screen view", () => {
  renderWithWrappers(<ArtAssistant />)

  expect(mockTrackEvent).toHaveBeenCalledWith({
    action: "screen",
    context_screen_owner_type: "artAssistant",
  })
})
```

When a component calls a tracking hook and you only care that the right event fired with the right arguments, mock the hook instead of asserting on the raw payload. [`InfiniteDiscoveryHeader.tests.tsx`](../src/app/Scenes/InfiniteDiscovery/Components/__tests__/InfiniteDiscoveryHeader.tests.tsx):

```typescript
const mockTrack = { tappedShare: jest.fn() }

jest.mock("app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking", () => ({
  useInfiniteDiscoveryTracking: () => mockTrack,
}))

it("tracks the share tap", () => {
  renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

  fireEvent.press(screen.getByLabelText("Share Artwork"))

  expect(mockTrack.tappedShare).toHaveBeenCalledWith("artwork-id", "test-artwork", "artwork")
})
```

You'll also find tests asserting on `mockTrackEvent.mock.calls[0]` with `toMatchInlineSnapshot`. That still works, but avoid it for new tests: a screen view often fires before your interaction does, so your event can land at `calls[1]` instead of `calls[0]`, and the snapshot won't tell you why it broke. Asserting with `toHaveBeenCalledWith` doesn't care what index the call landed at.

> A screen that fetches data over Relay needs to let that resolve before your tracking assertion runs, or the event won't have fired yet. Wrap the `expect` in `waitFor` instead of adding a manual delay. Never use `flushPromiseQueue`; it's marked deprecated in its own source, in favor of `waitFor`. Trimmed from `ContactGalleryButton.tests.tsx` (the real file also wraps the component in `Suspense` and a screen-context provider):
>
> ```typescript
> const { renderWithRelay } = setupTestWrapper<ContactGalleryButtonTestsQuery>({
>   Component: ContactGalleryButton,
>   query: graphql`
>     query ContactGalleryButtonTestsQuery @relay_test_operation {
>       artwork(id: "artwork-id") @required(action: NONE) {
>         ...ContactGalleryButton_artwork
>       }
>     }
>   `,
> })
>
> it("tracks an event when the 'contact gallery' button is pressed", async () => {
>   renderWithRelay({
>     Artwork: () => ({ internalID: "artwork-id", slug: "artwork-slug" }),
>   })
>
>   fireEvent.press(screen.getByText("Contact Gallery"))
>
>   await waitFor(() => {
>     expect(mockTrackEvent).toHaveBeenCalledWith({
>       action: "tappedContactGallery",
>       context_owner_id: "artwork-id",
>       context_owner_slug: "artwork-slug",
>       context_owner_type: "artwork",
>     })
>   })
> })
> ```

## Legacy patterns

You'll still run into these in older code. Don't write new ones; convert to a tracking hook when you next touch the file.

The `@screenTrack` decorator handles screen tracking in a class component:

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

The `@track` decorator handles function tracking in a class component:

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

Calling `this.follow` from the `Button` needs `() => this.follow()` or `this.follow.bind(this)`. `this.follow` alone won't call the tracking wrapper.

A module-scope `const tracks = {}` object sits below a functional component, which calls `useTracking()` directly and does `trackEvent(tracks.someEvent())` itself. This still accounts for most tracking code in the app. It works, but splits one event across two places instead of the one place a tracking hook gives you.

`app/utils/track/schema.ts` holds the pre-Cohesion event schema. It's marked for removal in its own source once every event has moved to Cohesion; don't add to it.

## Still need help?

Ask in the [#practice-mobile 🔐](https://artsy.slack.com/archives/C02BAQ5K7) Slack channel.
