# Analytics and tracking

We track user behavior with [Cohesion](https://github.com/artsy/cohesion), Artsy's schema library for analytics events. Use it for all new tracking code. Cohesion types each event, so a missing or misspelled field fails `yarn type-check` instead of shipping broken data. `react-tracking` sends the event from your code to Segment.

### Contents

- [Analytics and tracking](#analytics-and-tracking)
  - [Contents](#contents)
  - [Write the tracking hook](#write-the-tracking-hook)
    - [When one event is enough](#when-one-event-is-enough)
    - [Name methods after the event](#name-methods-after-the-event)
  - [Choose the context fields](#choose-the-context-fields)
  - [Track a screen view](#track-a-screen-view)
  - [Pass screen context to shared components](#pass-screen-context-to-shared-components)
  - [Track list impressions](#track-list-impressions)
  - [Test your tracking](#test-your-tracking)
    - [Screens that load data](#screens-that-load-data)
    - [Components that read the analytics context](#components-that-read-the-analytics-context)
    - [Mock the hook](#mock-the-hook)
  - [Legacy patterns](#legacy-patterns)
  - [Still need help?](#still-need-help)

## Write the tracking hook

Put a scene's events in one hook, `use<Scene>Tracking.ts`, in the scene's `hooks/` folder. The hook calls `useTracking()`, types each payload with its Cohesion event, and calls `trackEvent` itself:

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

A component calls one method per event:

```typescript
export const MyFuncComp: React.FC<Props> = ({ artistID, artistSlug }) => {
  const tracks = useMySceneTracking()

  const follow = () => {
    tracks.followedArtist({ artistID, artistSlug })
    actuallyDoTheFollow()
  }

  return <Button onPress={follow}>Follow</Button>
}
```

Typing `payload` with its Cohesion event makes `yarn type-check` fail on a missing or misspelled field. The single object argument keeps call sites readable as an event grows. `useMemo` keeps the returned methods stable across renders, so a caller can list one in a `useEffect` dependency array without it firing on every render. Older hooks return a plain object without `useMemo`. They work and don't need rewriting. [`useOrderDetailsTracking.ts`](../src/app/Scenes/OrderHistory/OrderDetails/hooks/useOrderDetailsTracking.ts) is a real hook with several events.

A hook for a shared component lives next to the component, like [`useProgressiveOnboardingTracking.tsx`](../src/app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking.tsx). A hook that isn't tied to one component goes in `src/app/utils/hooks/`, like [`useOnboardingTracking.ts`](../src/app/utils/hooks/useOnboardingTracking.ts).

### When one event is enough

If a component tracks a single event, call `useTracking()` in the component and type the payload inline. [`ArticleShareButton.tsx`](../src/app/Scenes/Article/Components/ArticleShareButton.tsx) does this:

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

Move the tracking into a hook when a second event shows up. A component that tracks three or four events inline repeats the `useTracking()` setup and buries its render logic under payload objects.

### Name methods after the event

Name each hook method after its Cohesion action, like `tappedBuyerProtection` for `ActionType.tappedBuyerProtection` in `useOrderDetailsTracking`. Some hooks prefix methods with `track` instead, like `trackSuggestionTapped` in `useArtAssistantTracking`. Most methods in the app follow the first style (`useHomeViewTracking` alone has about 30), so use it for new code. Never name a method `trackEvent`. It shadows the `trackEvent` from `useTracking()` and says nothing about the event.

## Choose the context fields

Three fields say where an event happened:

- `context_module` is the part of the screen the user touched: a rail, a header, a sheet.
- `context_screen_owner_type` is the screen that part lives on. Most `Tapped*` events need it alongside `context_module`.
- `context_owner_type` is what some events use instead of `context_screen_owner_type`, such as `ExperimentViewed`, `Share`, `Impression`, `AddedArtworkToArtworkList`, and follow and save events.

The event's Cohesion type decides which fields it takes, so a payload that mixes them up fails `yarn type-check`. The fields don't change how Segment records the event. Segment records a screen call only when `action` is `ActionType.screen`. Every other event is a track call.

## Track a screen view

The right tool depends on how the screen behaves:

| Screen                                               | Use                                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| A static screen, tracked once on mount               | `ProvideScreenTrackingWithCohesionSchema`                                    |
| A tab screen that must re-track each time you return | a `screen` method on the scene's tracking hook, called from `useFocusEffect` |
| A card or carousel that shows one item at a time     | a screen event fired as each item appears                                    |

For a static screen, wrap its content in `ProvideScreenTrackingWithCohesionSchema` and build the payload with the `screen()` helper. From [`ItineraryScreen.tsx`](../src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx):

```typescript
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"

// ...

return (
  <ProvideScreenTrackingWithCohesionSchema
    info={screen({
      context_screen_owner_type: OwnerType.cityGuideGuide,
      context_screen_owner_id: itinerary.internalID,
      context_screen_owner_slug: itinerary.slug ?? undefined,
    })}
  >
    {/* screen content */}
  </ProvideScreenTrackingWithCohesionSchema>
)
```

This `screen` is the payload helper from `app/utils/track/helpers`, not testing-library's `screen`. Import it by path so your editor doesn't pick the wrong one.

The provider fires once, on mount. That's right for a screen you navigate to and away from. A tab stays mounted, though, so switching back to it fires nothing. For a tab screen, add a `screen` method to the scene's tracking hook and call it from `useFocusEffect`, as `HomeView.tsx` does:

```typescript
const tracking = useHomeViewTracking()

useFocusEffect(
  useCallback(() => {
    tracking.screen(OwnerType.home)
  }, [])
)
```

A card or carousel changes the "screen" with each item, not with navigation. `InfiniteDiscovery.tsx` calls `track.displayedNewArtwork` each time a new card appears.

The provider only fires its own event. It renders a plain `<React.Fragment>` and passes nothing down, so child components don't get the screen's owner fields from it. The next section shows how to pass them.

## Pass screen context to shared components

A shared component, like a save or follow button, renders on many screens and can't know which one it's on. To fill in its screen fields, wrap the screen in `AnalyticsContextProvider` and read the fields with `useAnalyticsContext()` in the component. `Artwork.tsx` provides them:

```typescript
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"

// ...

<AnalyticsContextProvider
  contextScreenOwnerId={artworkAboveTheFold?.internalID}
  contextScreenOwnerSlug={artworkAboveTheFold?.slug}
  contextScreenOwnerType={OwnerType.artwork}
>
  {/* screen content */}
</AnalyticsContextProvider>
```

[`useSaveArtworkListsChanges.ts`](../src/app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useSaveArtworkListsChanges.ts) reads them:

```typescript
const analytics = useAnalyticsContext()
const { trackEvent } = useTracking()

const trackAddedArtworkToArtworkLists = () => {
  const event: AddedArtworkToArtworkList = {
    action: ActionType.addedArtworkToArtworkList,
    context_owner_id: analytics.contextScreenOwnerId,
    context_owner_slug: analytics.contextScreenOwnerSlug,
    context_owner_type: analytics.contextScreenOwnerType || OwnerType.artwork,
    artwork_ids: [artwork?.internalID ?? ""],
    owner_ids: addingArtworkListIDs,
  }

  trackEvent(event)
}
```

`useAnalyticsContext()` reads the nearest provider above the component that calls it. A component can't read a provider it renders itself, so render the provider in the screen and read it in a child. The provider is plain React context, separate from `react-tracking`, so a tracking hook sees these fields only if it calls `useAnalyticsContext()`.

## Track list impressions

To track which items in a HomeView list a user saw, use `useItemsImpressionsTracking` from [`useImpressionsTracking.ts`](../src/app/Scenes/HomeView/hooks/useImpressionsTracking.ts), and pass the `onViewableItemsChanged` and `viewabilityConfig` it returns to your list. From `HomeViewSectionScreenArtworks.tsx`:

```typescript
const { onViewableItemsChanged, viewabilityConfig } = useItemsImpressionsTracking({
  isInViewport: true,
  contextModule: ContextModule.artworkGrid,
  contextScreenOwnerType: section.ownerType as OwnerType,
})
```

`contextScreenOwnerType` defaults to `OwnerType.home`. That's right for a rail on the Home screen, which is why `HomeViewSectionArtworks.tsx` leaves it out. Pass it on any other screen, or every impression logs `context_screen: "home"`. The hook remembers which item ids it has tracked, so scrolling back never fires the same impression twice. It only fires while the `ARImpressionsTrackingHomeItemViews` feature flag is on.

The hook lives in `Scenes/HomeView`, so the cross-scene import rule in [AGENTS.md](../AGENTS.md) keeps other scenes from importing it. `HomeViewSectionScreenArtworks.tsx` imports it from `Scenes/HomeViewSectionScreen` anyway, which is a known exception. Move the hook to `app/utils/hooks` before another scene uses it.

> Under `__TEST__`, the hook tracks viewability with plain `useState` and `useEffect` instead of Reanimated, so a list can behave differently in a test than on device.

## Test your tracking

`mockTrackEvent` from `app/utils/tests/globallyMockedStuff` replaces `trackEvent` in every test. Jest setup installs it and clears it before each test, so you don't need to mock `react-tracking` or call `jest.clearAllMocks()` for it.

Check how many events fired, then snapshot the payload. For `MyFuncComp` from [Write the tracking hook](#write-the-tracking-hook):

```typescript
import { fireEvent, screen } from "@testing-library/react-native"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("tracks the follow", () => {
  renderWithWrappers(<MyFuncComp artistID="artist-id" artistSlug="artist-slug" />)

  fireEvent.press(screen.getByText("Follow"))

  expect(mockTrackEvent).toHaveBeenCalledTimes(1)
  expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
[
  {
    "action": "followedArtist",
    "context_module": "artistHeader",
    "context_owner_type": "artist",
    "owner_id": "artist-id",
    "owner_slug": "artist-slug",
    "owner_type": "artist",
  },
]
`)
})
```

Start with an empty `toMatchInlineSnapshot()`. Run the test and Jest fills in the payload. Check every field before you commit. The `toHaveBeenCalledTimes` check fails first if another event fired too, so `calls[0]` is always the event you meant.

### Screens that load data

A screen that loads its data over Relay fires its screen event after the data renders. Wait for the screen's content with a `findBy*` query before you assert. Never use `flushPromiseQueue`, which its own source marks as deprecated. This test for the screen from [Track a screen view](#track-a-screen-view) uses the fixtures in [`ItineraryScreen.tests.tsx`](../src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx):

```typescript
it("tracks the screen view", async () => {
  renderWithRelay({ Itinerary: () => ITINERARY }, props)

  await screen.findByText("Chill Vibes Only")

  expect(mockTrackEvent).toHaveBeenCalledTimes(1)
  expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
[
  {
    "action": "screen",
    "context_screen_owner_id": "chill-vibes-only",
    "context_screen_owner_slug": "chill-vibes-only",
    "context_screen_owner_type": "cityGuideGuide",
  },
]
`)
})
```

The `ITINERARY` fixture sets `internalID` and `slug` to `"chill-vibes-only"` and `title` to `"Chill Vibes Only"`, so the snapshot holds fields that came from the mocked query.

### Components that read the analytics context

A component that calls `useAnalyticsContext()` needs the provider in its test too. Without it, the snapshot records the screen fields as `undefined`. [`ContactGalleryButton.tests.tsx`](../src/app/Scenes/Artwork/Components/CommercialButtons/__tests__/ContactGalleryButton.tests.tsx) wraps the component like this (query omitted):

```typescript
const { renderWithRelay } = setupTestWrapper<ContactGalleryButtonTestsQuery>({
  Component: ({ artwork, me }) => (
    <AnalyticsContextProvider
      contextScreenOwnerType={OwnerType.artwork}
      contextScreenOwnerId="artwork-id"
      contextScreenOwnerSlug="artwork-slug"
    >
      <Suspense fallback={null}>
        <ContactGalleryButton artwork={artwork} me={me} />
      </Suspense>
    </AnalyticsContextProvider>
  ),
  query: graphql`...`,
})
```

### Mock the hook

When you only need to know that the right hook method ran with the right arguments, mock the hook instead of asserting on the payload. From [`InfiniteDiscoveryHeader.tests.tsx`](../src/app/Scenes/InfiniteDiscovery/Components/__tests__/InfiniteDiscoveryHeader.tests.tsx):

```typescript
const mockTrack = { tappedShare: jest.fn() }

jest.mock("app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking", () => ({
  useInfiniteDiscoveryTracking: () => mockTrack,
}))

it("renders share icon and calls share function when right button is pressed", () => {
  __globalStoreTestUtils__?.injectFeatureFlags({ AREnabledDiscoverDailyNegativeSignals: false })

  renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

  fireEvent.press(screen.getByTestId("top-right-icon"))

  expect(mockTrack.tappedShare).toHaveBeenCalledWith("artwork-id", "test-artwork", "artwork")
})
```

## Legacy patterns

You'll find these in older code. Don't write new ones. Convert them to a tracking hook when you next touch the file.

The `@screenTrack` decorator tracks a screen view in a class component:

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

The `@track` decorator tracks a method call in a class component:

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

Call the method as `() => this.follow()` or `this.follow.bind(this)`. Passing `this.follow` alone skips the tracking wrapper.

The most common pattern in the app is still a module-scope `const tracks = {}` object below a component that calls `useTracking()` and runs `trackEvent(tracks.someEvent())` itself. It works, but it splits each event across two places.

`app/utils/track/schema.ts` holds the pre-Cohesion schema, and its own source marks it for removal. Don't add to it.

## Still need help?

Ask in the [#practice-mobile 🔐](https://artsy.slack.com/archives/C02BAQ5K7) Slack channel.
