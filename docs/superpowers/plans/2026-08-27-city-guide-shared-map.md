# Shared map for City Guide event lists — plan

**Goal:** a floating button on the three event screens and the city itinerary screen that shows
those events on a map, reusing the itinerary map's clustering and its pin-tap card, without
route lines or pin numbers.

## Boundary, set by the developer

**Frozen — faces users, do not touch:** `CityGuideMap.tsx`, `CityGuideMapQueryRenderer.tsx`,
`CityGuideMapPins.tsx`, `CityGuideMapHeader.tsx`, `CityGuideFloatingMapButton.tsx`. That is the
`/local-discovery` map (`routes.tsx:1117`). If the shared map wants something from it, **copy,
do not refactor**, and say so.

**Becomes the shared map:** the itinerary map components, which ship only on an unmerged draft PR
and face nobody — `ItineraryMapView`, `ItineraryMapPins`, `ItineraryMapPreview`,
`ItineraryMapRoute`, `utils/itineraryStopsToGeoJSON.ts`.

## What the developer asked for

- A floating button on Current Fairs, Current Shows, Opening Soon, and the city itinerary screen.
- It shows **that screen's** events on a map — Current Shows gives current shows.
- On pin tap, the **same card** the itinerary map shows.
- The **same clustering** as the itinerary map.
- **No route lines and no pin numbers.**
- Reading of "to show the map view": an in-screen list/map toggle, as the itinerary already has
  (`ItineraryScreen.tsx:169`), not navigation to a separate screen.

## The one real design problem

The map components are typed to `ItineraryStop`. Event rows are `Show` and `Fair`. Two specific
couplings have to be broken:

1. **`ItineraryMapPreview` renders `ItineraryStopSaveControl`**, which reads the itinerary's
   entity-provider context. On an event screen there is no provider and no stops. So the shared
   card must take its save control as an injected `React.ReactNode`, exactly as `CityEventRow`
   already does — callers pass `CityEventShowSaveControl`, `CityEventFairSaveControl` or the
   itinerary's context-reading control.
2. **`itineraryStopsToGeoJSON` bakes numbering into feature properties** (`number: String(index + 1)`).
   Numbering becomes optional.

`itineraryStopsToRouteGeoJSON` stays itinerary-only. Event screens want no route.

Coordinates need no new API: both `CityGuideShow_show` and `CityGuideFair_fair` already fetch
`location { coordinates { lat lng } }`.

## Shared shape — corrected after review

Three holes in the first draft, each of which would have derailed Task 1 halfway.

**1. Numbering is positional and post-filter, so it cannot live on the place.** Filtering the map
to day two renumbers that day's stops 1 and 2, not 4 and 5 — deliberate, documented at
`itineraryStopsToGeoJSON.ts:36-41`, relied on at `ItineraryMapView.tsx:57-59`. A `number` baked
on at adapt time is computed before filtering and would show 4 and 5. Numbering stays a
**converter option computed from position in the list it is given**.

**2. The input is section-shaped, not flat.** Filtering and camera fitting both key on
`sectionId` (`ItineraryMapView.tsx:49-55`). So the view takes
`{ id: string; title: string; places: MapPlace[] }[]`.

**3. The pin-tap card's detail line cannot come from a `MapPlace` field.** For the itinerary it is
a lazy Relay query for address and dates, falling back to the stop's own time label
(`ItineraryMapPreview.tsx:54-67`). For an event screen the detail is already in hand. So the card
takes the detail as an **injected node**, exactly as it takes the save control:

```ts
interface MapPlace {
  id: string
  title: string
  coordinates: { lat: number; lng: number } // already validated; see below
  href?: string | null
  /** Injected, so the card holds no Relay or context dependency. */
  detail?: React.ReactNode
  saveControl?: React.ReactNode
}
```

The itinerary injects its existing lazy `StopDetails` and its context-reading save control; the
event screens inject plain text and a `CityEventShowSaveControl` / `CityEventFairSaveControl`.

**Two dead properties to drop while generalising.** The converter writes `title` and `sectionId`
into feature properties (`itineraryStopsToGeoJSON.ts:53-56`) and **no layer reads either** —
`ItineraryMapPins` reads only `number` and `id`. Section filtering happens on the list before
conversion.

**Coordinates must be filtered, not trusted.** `lat`/`lng` are nullable in the generated types
(`CityGuideShow_show.graphql.ts:25-27`). `utils/isValidLatLng.ts` already exists — adapters use it.
With zero valid places the camera target is `undefined` (`ItineraryMapView.tsx:74`) and the map
opens on Mapbox's world view, so **the floating button hides when there is nothing to map**.
`CityEventListScreen` already has an empty branch to hang that off (`:154-159`).

## Pins and clusters when there is no numbering

The developer confirmed the event map wants **no numbering** — it is pins, not an itinerary. Two
consequences that are not mere omissions:

**There is no unnumbered pin style today.** A pin is a black circle plus a `SymbolLayer` whose
`textField` is `["get", "number"]` (`ItineraryMapPins.tsx:21-29`). Dropping the number would render
an empty label rather than no label, so the shared pin layer must **skip that symbol layer
entirely** when numbering is off.

**Cluster labels differ by map, deliberately.** Clusters currently read `"2+"` rather than `"2"`
because a bare count would be indistinguishable from the stop numbered 2
(`ItineraryMapPins.tsx:40-43`). Without numbered pins that confusion cannot arise, and the
developer chose a **plain count** for the event map. So:

- Itinerary map: numbered pins, clusters read `"2+"`.
- Event maps: unnumbered pins, clusters read the bare count.

`CLUSTER_RADIUS = 20` stays for both. It is far below Mapbox's default of 50 so pins merge only
when they genuinely overlap, and the developer asked to keep the same clustering.

## Section filter pills: generalise, and the event map keeps them

Nearly free, because both data models are already `{ id, title, items[] }` — `ItinerarySection`
(`itineraryTypes.ts:37-43`) and `CityEventSection` (`cityEventSections.ts`). `ItineraryMapView`'s
filtering is already section-generic. Neighbourhood pills on a hundred-show map are genuinely
useful, and "Opening Soon" gets This Week / Next Week pills, which reads fine. Hiding them would
mean adding a prop to suppress a feature.

## The cost the first draft omitted: header chrome

`CityEventListScreen` uses `Screen.AnimatedHeader` + `Screen.StickySubHeader`
(`CityEventListScreen.tsx:150-151`), both driven by scroll events from `Screen.FlatList`. **In map
mode there is no scroll view**, so that chrome has nothing feeding it. The itinerary screen hit
exactly this and had to suppress its header and hand-roll a floating back button plus
`useBackHandler` (`ItineraryScreen.tsx:47-56,99-125`).

That dance repeats here. Budget for it rather than discovering it. Collapsed-section state
survives a toggle because `collapsedSectionIds` is state; scroll offset does not, because the list
unmounts. Decide whether that matters before building.

## Tasks — three, not two

**Task 1 — extract the shared map.** Move the four components and the converter to
`Components/Map/`. Generalise to section-shaped `MapPlace` input with numbering and route as
options. Add an `itineraryStopsToMapSections` adapter and point `ItineraryScreen` at it. Drop the
two dead feature properties.

**Task 2 — the event list screen.** `showsToMapSections` / `fairsToMapSections` adapters, the
floating button, the map toggle, and the header-chrome rework. Serves all three sections.

**Task 3 — the city itinerary screen.** `CitySavedList` is a different container with different
data: it renders fairs and shows together, and it paginates shows twenty at a time
(`CitySavedList.tsx:143-146`), so its map shows only the pages fetched so far. Say in the PR
whether that is acceptable.

Split three ways because Task 2's header rework is real work that should not share a commit with
a different screen's pagination question.

## What the regression net actually is

The first draft claimed Task 1 leaves the itinerary "provably unchanged". That was overstated, and
the plan contradicted itself two sections earlier.

**Mapbox's `MapView` mocks to `() => null`** (`setupJest.tsx:295-306`), so pins, camera, overlays
and the card never mount under Jest and cannot be asserted. `ItineraryScreen.tests.tsx:50-63` says
so itself. `LineLayer` is not in the mock at all, safe only because children never mount.

So the honest net is: the converter and adapter tests, which are pure functions and where the real
coverage lives, plus the toggle-and-pills chrome test. **Pins, camera, route line and the pin-tap
card are verified in the simulator, against the current behaviour, or not at all.** Every map bug
in the previous sub-project surfaced on a device rather than in a test.

## Other things that will bite

- `fair.profile` is nullable and the fair save control takes **profile** ids, not fair ids
  (`CityEventSaveControls.tsx:71-75`).
- Fairs fetch no `href`; rows build `/fair/${slug}` by hand (`CityEventListScreen.tsx:213`).
- The itinerary's route line sits behind `AREnableCityGuideItineraryRoute` (`features.ts:192`,
  read at `ItineraryMapView.tsx:45`). Keep the flag working across the move.
- A floating button over `Screen.Body fullwidth` is proven — the itinerary already does it
  (`ItineraryScreen.tsx:160-183`) and this screen has the same body structure.
- Map-toggle tracking on the event screens is not specified. Decide it.
- Fairs' coordinates are the fair's location, which may be a venue rather than a booth.
