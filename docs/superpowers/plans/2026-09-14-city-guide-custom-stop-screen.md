# Custom Stop Screen

**Goal:** A custom stop on an itinerary — a cafe, a landmark, anything with no Artsy entity
behind it — opens its own screen shaped like the Show screen, and can be added to your own
itinerary from there.

Today it opens a bottom sheet (`ItineraryCustomStopSheet`), added an hour ago. That sheet
goes away.

## What the API allows

Two findings that shape the design.

**There is no root query for one stop.** `Query` exposes `itinerary(id:)` and
`itinerariesConnection` only; the `itineraryStop` field at `data/schema.graphql:23583` is a
mutation payload, not a lookup. So the screen is addressed by _itinerary plus stop_ and picks
the stop out of the itinerary's sections by `internalID`. The itinerary is normally already in
the Relay store from the screen you tapped from, so this usually paints without a fetch.

**A custom stop can be created from nothing.** `createItineraryStopInput` leaves `itemID` and
`itemType` optional and accepts `title`, `address`, `note`, `sourceURL`, `latitude`,
`longitude`, `category` and `isFreeAdmission`. So "add to itinerary" copies those fields onto
your own itinerary.

One limit worth stating: `imageURL` on that input takes "S3 upload URL for the stop image;
Gravity converts it via Gemini. Other URLs are rejected." A copied stop therefore cannot carry
the original's picture, and will show the grey placeholder until someone uploads one. Carrying
the image over needs either an `imageID`-style input or server-side copying — an API ask, not
something this plan can solve.

## Route

```
/city-guide/:citySlug/itinerary/:itineraryId/stop/:stopId
```

Nested under the itinerary because that is what the query needs. `citySlug` stays in the path
for the same reason the itinerary route keeps it: the URL reads as a city's guide and matches
artsy.net. Registered in `routes.tsx` beside `CityGuideItinerary`.

## Screen

`CustomStopScreen`, shaped after the Show screen, top to bottom:

| Block                                           | Source                               | Show screen counterpart |
| ----------------------------------------------- | ------------------------------------ | ----------------------- |
| Hero image, or the grey `NoArtIcon` placeholder | `stop.image.url`                     | `ShowInstallShots`      |
| Title, category badge                           | `stop.title`, `stop.category`        | `ShowHeader`            |
| Address, tappable, opening the map action sheet | `stop.address`                       | `ShowPartnerLocation`   |
| Hours and admission                             | `startAt`/`endAt`, `isFreeAdmission` | `ShowHeader` meta       |
| Description                                     | `stop.note`                          | `ShowInfo`              |
| "More information" link                         | `stop.sourceURL`                     | —                       |
| Add to itinerary                                | mutation, below                      | Save button             |

The address reuses the action sheet `ShowPartnerLocation` opens, rather than a second
implementation. A block with no data renders nothing, as the Show screen's do.

Not a Show-screen clone: no artworks grid, no viewing room, no context card. A custom stop has
none of that.

## Add to itinerary

`useCityItineraryStops.addStop` currently takes `{ itemType, itemID, title }` and finds an
existing stop by matching `item.__typename` + `item.internalID`. A custom stop has no item, so
both need widening:

- `addStop` accepts either an entity stop (as now) or a custom one carrying `title`, `address`,
  `note`, `sourceURL`, `latitude`, `longitude`, `category`, `isFreeAdmission`.
- Duplicate detection for a custom stop matches on `title` plus `address`, since there is no id
  to compare. Imperfect, and the honest alternative — allowing duplicates — is worse.

The button is hidden while you are looking at your own itinerary: the stop is already on it.
On a curated guide it reads "Add to Itinerary", then "Added" once done, matching
`ItineraryAddFullListButton`'s states.

## Files

- Create `src/app/Scenes/CityGuide/Screens/CustomStop/CustomStopScreen.tsx`
- Create `src/app/Scenes/CityGuide/Screens/CustomStop/Components/CustomStopAddButton.tsx`
- Create `src/app/Scenes/CityGuide/Screens/CustomStop/utils/customStopFromItinerary.ts` —
  picks the stop out of the itinerary payload by id, returns `null` when it is missing or turns
  out to have an entity after all
- Modify `src/app/Scenes/CityGuide/hooks/useCityItineraryStops.ts` — widen `addStop`
- Modify `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow.tsx` — a
  custom stop navigates to the new route instead of calling `onPress`
- Modify `src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx` — drop the sheet
  state and the `onSelectStop` prop threading
- Modify `src/app/Navigation/routes.tsx`
- Delete `ItineraryCustomStopSheet.tsx` and its test

`ItinerarySectionRow`'s `onSelectStop` prop disappears with the sheet, so every row becomes a
link and the screen stops holding selection state.

## Tasks

**1 — Pull the stop out of the itinerary payload.** `customStopFromItinerary`, tested against
a payload with several sections: finds by id, returns null for an unknown id, returns null for
a stop that has an `item`. Commit.

**2 — The screen.** Route registered, query wired, every block rendered from a stop fixture.
Tests: each block appears with data and is absent without it; the placeholder stands in for a
missing image; an unknown stop id renders the unavailable state rather than a blank screen.
Commit.

**3 — Add to itinerary.** Widen `addStop`, add the button. Tests: a custom stop posts
`createItineraryStop` with the copied fields and no `itemType`; a second tap is a no-op; the
button is absent on your own itinerary. Commit.

**4 — Rewire the row and delete the sheet.** The row links to the new route; the sheet, its
test and the `onSelectStop` threading go. Tests: tapping a custom stop navigates to
`/city-guide/:citySlug/itinerary/:itineraryId/stop/:stopId`. Commit.

Each task ends with `yarn tsc`, the CityGuide suite and lint on the changed files.

## Worth flagging

- **The image cannot be copied** (above). The added stop shows a placeholder.
- **RNTL performs no layout.** Three bugs on this branch have been flex collapses invisible to
  tests, two of them in the last hour. The new screen's layout needs a look on a device, not
  just green tests.
- **Duplicate detection by title and address** is the weak point of task 3. An
  `itemID`-less uniqueness rule is a Gravity concern really.
