# City Guide Itineraries — Design

**Date:** 2026-08-26
**Status:** Draft for review
**Scope:** Sub-project 1 of the City Guide increment

## Context

The City Guide already exists in two forms in `src/app/Scenes/CityGuide/`:

- `/local-discovery` → `CityGuide.tsx` — the live, map-based scene, fully wired to Relay via
  `CityGuideMapQueryRenderer.tsx`. It fetches `city(slug)` for `showsConnection` and
  `fairsConnection`.
- `/city-guide` → `CityGuideNew.tsx` — a rebuild added this month, currently rendering hardcoded
  mock arrays (`CityGuideMetaData.tsx`, `CityGuideCuratedLists.tsx`, `CityGuideEvents.tsx`) with
  `picsum.photos` placeholders. City selection runs off local JSON via `CityGuideCityPicker.tsx`,
  behind the `AREnableExpandedCityGuide` flag.

This spec covers itineraries only. The wider increment also includes browse/discovery, the city
picker, map work, and saving shows and galleries; each of those gets its own spec.

The Figma designs and the prototype are both still moving. This spec commits to the data shape and
the component boundaries, not to pixel values.

## What we are building

Read-only viewing of curated city itineraries — editorial guides such as "Chill Vibes Only" by
Casey Lesser. Users cannot create or edit an itinerary. The content arrives fully assembled from
the backend; for this pass it comes from a static mock module in the client.

Two views over the same itinerary:

- **List view** — hero image, title, subtitle, author, description, then collapsible sections. Each
  section holds numbered stops with a thumbnail, title, time label, an optional description line,
  and a save button.
- **Map view** — the same stops as numbered pins, with a filter pill per section.

The one interactive element on a stop is **save**, covered below.

## Data shape

Static mock for now, shaped so the swap to a GraphQL fragment is mechanical.

```ts
interface ItineraryStop {
  id: string
  title: string
  timeLabel: string // "6am-4pm", "12pm - 1pm"
  description?: string // freeform, may hold emoji ("🥂 🧀") or a short caption
  imageUrl: string
  coordinates: { lat: number; lng: number }
  order: number // the number rendered in the pin and the list bullet
  entity: {
    __typename: "Show" | "Partner"
    id: string
    slug: string
    isFollowed: boolean
  }
}

interface ItinerarySection {
  title: string // "Day 1 — Easing in" or "Mellow morning"
  stops: ItineraryStop[]
}

interface Itinerary {
  id: string
  citySlug: string
  title: string
  subtitle: string
  heroImageUrl: string
  authorName: string
  description: string
  sections: ItinerarySection[]
}
```

Two decisions worth stating plainly:

**Sections are freeform, not an enum.** Early drafts had a `TimeOfDay` enum plus a `dayNumber`.
The designs use both schemes — one frame groups by time of day ("Mellow morning", "Chill
afternoon"), another groups by day with editorial subtitles ("Day 1 — Easing in", "Day 2 — London
Frieze"). The backend owns the grouping and the naming; the client renders whatever titles it gets
and derives the map filter pills from the same list. This removes a class of change where a new
editorial grouping needs a client release.

**`description` is a single string, not a tag array.** The designs show emoji clusters under the
time label. Modelling them as `string[]` would force the backend into a tag vocabulary it may not
have. A plain string renders emoji and captions alike.

## Screens and components

New directory `src/app/Scenes/CityGuide/Screens/Itinerary/`:

- `ItineraryScreen.tsx` — owns the itinerary, holds the list/map toggle state, renders one or the
  other. One route, not two, so the toggle is a local state flip rather than a navigation push.
  This matches the floating "Map" pill in the design, which reads as a mode switch, not a new page.
- `Components/ItineraryHeader.tsx` — hero image, title, subtitle, author, description.
- `Components/ItinerarySection.tsx` — collapsible section wrapper with the title and chevron.
- `Components/ItineraryStopRow.tsx` — numbered bullet, thumbnail, title, time label, description,
  save button.
- `Components/ItineraryMapView.tsx` — pins and filter pills.
- `utils/mockItineraries.ts` — the static data, typed against the interfaces above.

## Saving a stop

The save button on a stop row is the `+` in the designs. Pressing it follows the show. The
behaviour:

1. On press, fire the follow mutation with an optimistic response.
2. The `+` icon animates into a tick. Reanimated drives it, per the project's rule about keeping
   animations off the JS thread; a scale-and-fade crossfade between the two icons.
3. A toast confirms the save, via `useToast` from `app/Components/Toast/toastHook`.
4. Pressing again unfollows, reverses the animation, and toasts the removal.

The mutation itself already exists in the codebase. `CityGuideEvent.tsx:32-67` runs
`followShow(input: { partnerShowID, unfollow })` through `useMutation` with an optimistic response
and a store updater. `src/app/Components/ShowFollowButton.tsx` runs the same mutation via
`commitMutation`. For galleries, `src/app/utils/mutations/useFollowProfile.ts` wraps
`followProfile(input: { profileID, unfollow })` and already returns `{ followProfile, isInFlight }`.

Rather than adding a third copy of the show-follow logic, this spec extracts the shared piece:

- `src/app/utils/mutations/useFollowShow.ts` — mirrors the existing `useFollowProfile` hook,
  wrapping the `followShow` mutation with the optimistic response and updater currently inlined in
  `CityGuideEvent.tsx`.
- `src/app/Components/SaveButton/` — the animated `+` → tick button, taking `isSaved`, `onPress`,
  and `isSaving`. Kept in shared `Components/` rather than inside the City Guide scene, since the
  browse and save sub-projects both need it and AGENTS.md forbids cross-scene imports.

`CityGuideEvent.tsx` then moves onto `useFollowShow`, deleting its inline mutation. That is a
targeted improvement to code this work touches, not a general refactor.

Mock itinerary stops are not Relay records, so the mutation has nothing real to write to. For this
pass `ItineraryStopRow` takes `isSaved` and `onSave` as props, and `ItineraryScreen` holds saved
state in a local `Set<string>` of stop ids. The animation and the toast run off that local state,
so the interaction is fully demonstrable. `useFollowShow` is built and tested in this pass but
consumed only by `CityGuideEvent.tsx`, which has real Relay records. When the backend lands, the
mock module becomes a fragment, `ItineraryScreen` drops its local set, and `ItineraryStopRow` reads
`entity.isFollowed` with `useFollowShow` behind it.

## Reuse

Per the constraint to prefer what exists over matching Figma exactly:

- `Flex`, `Box`, `Text`, `Button`, `Screen` from `@artsy/palette-mobile` throughout, with the
  padding the surrounding City Guide components already use.
- Map pins extend `CityGuideMapPins.tsx` instead of a second map implementation.
- Section titles reuse `app/Components/SectionTitle` if its shape fits the collapsible header;
  otherwise the chevron pattern from `app/Components/Icons/ChevronIcon`.
- `app/utils/hooks/withSuspense` for the loading and error fallbacks, as the neighbouring City
  Guide screens do.

## Navigation

A new route `/city-guide/:citySlug/itinerary/:itineraryId`, registered in
`src/app/Navigation/routes.tsx` beside the existing `/city-guide` entry. Entry point is the
existing `CityGuideCuratedLists.tsx` rows, which currently render but navigate nowhere. Deep
linking follows the same rules as the other City Guide routes, including the Android manifest
entry.

## Testing

Following `docs/testing.md` and the existing `Components/__tests__/` files:

- `ItineraryStopRow` — renders title, time label, description; save press calls the follow handler;
  the tick shows once saved.
- `ItinerarySection` — collapses and expands; renders each stop in order.
- `ItineraryScreen` — toggles between list and map; renders every section.
- `useFollowShow` — follows, unfollows, and applies the optimistic response.

The mock-data components added earlier (`CityGuideCityPicker`, `CityGuideCuratedLists`,
`CityGuideMetaData`, `CityGuideEvents`) carry `// @TODO: Implement test` comments. Adding those is
out of scope here except for `CityGuideCuratedLists`, which this work changes by giving its rows a
destination.

## Out of scope

- Any create or edit flow for itineraries. Users cannot author them.
- The backend schema. The mock module is deliberately a single file so that the GraphQL design
  session has a concrete target to match.
- Saving galleries. `useFollowProfile` already covers it; wiring it into the browse surfaces
  belongs to the save sub-project.
- Multi-day trip planning, date pickers, and scheduling.
