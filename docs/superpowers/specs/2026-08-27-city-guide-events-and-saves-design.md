# City Guide — event sections and city itineraries (design)

**Written:** 2026-08-27. Sub-project 2 of the City Guide work. Follows the itinerary
sub-project on `city-guide-itineraries-docs` ([PR #13992](https://github.com/artsy/eigen/pull/13992)).

## What this covers

Two pieces of work, specced together because they share a row component and a section model:

1. **Event sections.** The "Current Fairs", "Current Shows" and new "Opening Soon" sections
   on the City Guide home, and the screen each one opens.
2. **City itineraries.** A user's saved things in a city, plus "Add Full List" and the
   follow polish left over from the itinerary sub-project.

They ship as two phases. Phase 1 stands alone. Phase 2 depends on phase 1's row component
and nothing else.

## Design source

Figma file `HMwmWnpQClcGnwTOcYdyKx` (Fireworks City Guide).

| Frame                       | Node       | What it shows                                                |
| --------------------------- | ---------- | ------------------------------------------------------------ |
| City Guide home             | `49:5487`  | The three summary rows                                       |
| City Guide home, with saves | `96:42328` | Same, plus a saved section above City Guides                 |
| Current Fairs               | `71:26436` | Destination screen, grouped by neighbourhood                 |
| Current Shows               | `71:26488` | Destination screen, grouped by neighbourhood, admission line |
| Opening Soon                | `71:26576` | Destination screen, grouped by week                          |
| Saving flow                 | `84:36315` | The `+` affordance and its bottom sheet                      |

## Backend grounding

Everything below was read from `data/schema.graphql`, `../metaphysics` and `../gravity`
rather than assumed. This table is the reason several design decisions came out the way
they did.

| Design needs              | Status today                              | Source                                                                        |
| ------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- |
| Current fairs in a city   | Exists                                    | `City.fairsConnection(status: RUNNING, sort: START_AT_ASC)`                   |
| Current shows in a city   | Exists                                    | `City.showsConnection(status: RUNNING, sort:)`, `event_status.rb:19-24`       |
| Shows opening soon        | Exists                                    | `City.showsConnection(status: UPCOMING, dayThreshold:)`                       |
| A show's postcode         | Exists, not yet fetched, defaults to `""` | `Show.location.postalCode`, `partner_location.rb:26`                          |
| A show's neighbourhood    | **Not stored anywhere**                   | No field on `Location`, `PartnerLocation` or `PartnerShow`                    |
| Free vs paid entry        | **Not stored anywhere**                   | No admission field on `PartnerShow` or in the schema                          |
| Saved shows in a city     | Exists, 25km radius                       | `me.followsAndSaves.showsConnection(city:)`, `city/constants.ts:1`            |
| Saved fairs in a city     | Derivable, 15-day upcoming ceiling        | `City.fairsConnection` + `profile.isFollowed`; `v1/fairs_endpoint.rb:164-166` |
| Saved galleries in a city | **No city filter**                        | `followsAndSaves.galleriesConnection` takes no `city`                         |
| User-created itineraries  | **No model**                              | No `Itinerary` in Gravity; `Collection has_many :collected_artworks`          |

Two findings shaped the plan:

- **Neighbourhood is unstored, not merely unexposed.** Gravity's `CityGeocodingService`
  already receives a `neighborhood` from the geocoder and throws it away, because it only
  builds city-level slugs. `spec/services/city_geocoding_service_spec.rb:15` exercises
  exactly that value. So the eventual backend is short: persist
  `PartnerLocation#neighborhood`, resolve it in `location.ts` next to `postalCode`. Worth
  designing toward.
- **`PartnerLocation.geocoded_city` looks like a way out and is not.**
  `PartnerLocationService` sets it from `CityGeocodingService.build_full_name`, so it holds
  `"London, United Kingdom"`. `PartnerShow.partner_city` is city-level too. `Partner.region`
  exists but is free text used by address verification, and Metaphysics does not expose it.

## Decisions

Recorded with reasons, so they are cheap to revisit and expensive to relitigate by accident.

1. **One spec, two phases.** Events first, city itineraries second.
2. **Neighbourhood grouping ships against real postcodes and a mock label table.** The
   grouping input (`location.postalCode`) is real per-show data. The mapping from postcode
   district to a label like "Farringdon" is editorial mock, London only to start. This keeps
   the itinerary sub-project's idiom: mock structure, real entities.
3. **The admission line ships as dates, not as a mock.** The designs show "Free" or
   "Paid Entry" and nothing in Gravity or the schema can tell us which. With no feature flag,
   a mocked "Free" claim about a real gallery would be reachable in production through the
   `/city-guide` deep link, and a wrong one is a partner-relations problem rather than a
   cosmetic bug. Every row shows `exhibitionPeriod`, which is what Current Fairs and Opening
   Soon show anyway. The line arrives when `Show.isFreeAdmission` does.
4. **New shared destination screen; the legacy screens stay untouched.** `CitySectionList`
   and `CityFairList` keep their routes and their legacy callers.
5. **One fetch, no pagination, on the destination screens.** Grouping and infinite scroll
   fight each other: a section can look complete, then grow while the user scrolls, and the
   collapsible headers make that worse. The screens fetch one page and state the cap.
6. **Section titles stay opaque strings with a separate `id`.** Carried over from the
   itinerary sub-project. Two sections may legitimately share a title, so identity is `id`.
7. **A user gets one itinerary per city.** No picker, no list creation, no multi-list state.
   Artsy can still author many curated itineraries per city.
8. **A city itinerary is an unordered, city-scoped view of global follows.** Not storage of
   its own. It is the user's follows within **25km** of the city, with the show window widened
   to 365 days so a trip you are planning is visible. No Gravity or Metaphysics work is needed
   to ship it. Because it is a view and not storage, every consequence of sharing state with
   follows applies, and they are listed in full under phase 2 rather than buried.
9. **No feature flag, and no logged-out branch.** The new home is only reachable by deep link
   and is not linked from anywhere in the app. Every user of this feature is signed in, so
   there are no login checks, sign-up prompts or hidden-when-anonymous controls anywhere in
   this work.
10. **Stack on the itineraries branch.** `city-guide-saves` gets rebased onto
    `city-guide-itineraries-docs` first, since it was branched from the pre-rebase tip.

## Phase 1: event sections

### The home rows

`CityGuideEvents.tsx` today renders a hardcoded stub: a `SectionTitle` with an empty
`onPress`, a `picsum.photos` image, and the literal text "Date Placeholder". All of it goes.

One new component, `CityGuideEventSummaryRow`, in `CityGuide/Components/`:

```ts
interface Props {
  title: string // "Current Fairs"
  count: number
  countLabel: string // "Fair" | "Show", pluralised by app/utils/pluralize
  subtitle: string // first three names, comma joined, one line, ellipsised
  imageURL: string | null // first event's cover image
  onPress: () => void
}
```

It renders the existing `SectionTitle` (which already draws the chevron and takes `onPress`)
above a 44px thumbnail, the count line, and the subtitle. Three instances, one per section.

The `TKTK` placeholder in the designs becomes **names**: fair names for Current Fairs,
partner names for Current Shows and Opening Soon. Partner names beat show titles there
because "Tate Modern, Serpentine, Atlas Gallery" reads better than "David Turley: House
Plant Care, Splash: Sea, Beach…". Both the title and the row open the destination.

### The queries

The home and the destination screens want very different amounts of data, so they get
separate queries rather than sharing one.

The home needs three counts, three names per section, and one image. `totalCount` exists on
both `ShowConnection` and `FairConnection`, so it never fetches more than it shows:

```graphql
query CityGuideEventsQuery($citySlug: String!) {
  city(slug: $citySlug) {
    name
    fairs: fairsConnection(first: 3, status: RUNNING, sort: START_AT_ASC) {
      totalCount
      edges {
        node {
          name
          image {
            url
          }
        }
      }
    }
    currentShows: showsConnection(
      first: 3
      status: RUNNING
      sort: START_AT_ASC
      includeStubShows: false
    ) {
      totalCount
      edges {
        node {
          coverImage {
            url
          }
          partner {
            ... on Partner {
              name
            }
          }
        }
      }
    }
    openingShows: showsConnection(
      first: 3
      status: UPCOMING
      dayThreshold: 14
      sort: START_AT_ASC
    ) {
      totalCount
      edges {
        node {
          coverImage {
            url
          }
          partner {
            ... on Partner {
              name
            }
          }
        }
      }
    }
  }
}
```

Each destination screen fetches only its own section, one page of 100, using the shared
fragments:

```graphql
query CityEventListQuery($citySlug: String!) {
  city(slug: $citySlug) {
    name
    showsConnection(first: 100, status: RUNNING, sort: START_AT_ASC, includeStubShows: false) {
      totalCount
      edges {
        node {
          ...CityGuideShow_show
        }
      }
    }
  }
}
```

`status: RUNNING` for both Current Fairs and Current Shows, not `CURRENT`. `CURRENT` means
"start date or end date is in the future", which overlaps `UPCOMING`, so the same show would
appear under both Current Shows and Opening Soon. `RUNNING` means open right now, which
makes the two sets disjoint and matches what the section titles claim.

`dayThreshold: 14` because the Opening Soon design groups into "This Week" and "Next Week".

Fragment additions: `location { postalCode }` on both `CityGuideShow_show` and
`CityGuideFair_fair`, since both screens group by postcode, plus
`profile { internalID isFollowed }` on the fair fragment for the save control and phase 2.

### The grouping seam

One pure module, `CityGuide/utils/cityEventSections.ts`:

```ts
export interface CityEventSection<T> {
  id: string
  title: string
  items: T[]
}

export const groupByNeighborhood: <T extends HasPostalCode>(
  items: T[],
  citySlug: string,
  cityName: string
) => CityEventSection<T>[]

export const groupByOpeningWeek: <T extends HasStartAt>(
  items: T[],
  now: DateTime
) => CityEventSection<T>[]
```

Both are pure and unit-tested. `now` is injected rather than read from the clock, so the
week boundaries are testable. Luxon is already the date library in `bucketCityResults.ts`.

`groupByNeighborhood` drives Current Fairs and Current Shows. `groupByOpeningWeek` drives
Opening Soon.

Its buckets are **rolling, not calendar**: "This Week" is `startAt < now + 7d`, "Next Week"
is `now + 7d <= startAt < now + 14d`. Gravity's `upcoming` scope is
`start_at > now && start_at < in_days.days.from_now` (`event_status.rb:26-28`), so with
`dayThreshold: 14` the two buckets tile the result set exactly and a third bucket is
impossible. The function still drops anything outside both rather than trusting that, and a
test covers the day-14 boundary.

Rules for both: empty sections are dropped, section order follows the table order, the
fallback section sorts last.

### The mock label table

`CityGuide/utils/mockCityNeighborhoods.ts`, named so nobody mistakes it for real data:

```ts
interface NeighborhoodDef {
  id: string
  title: string
  postalPrefixes: string[] // outward-code prefixes, e.g. ["EC1"]
}

export const MOCK_NEIGHBORHOODS: Record<string, NeighborhoodDef[]>
```

London to start, using the labels from the designs where they fit ("Farringdon" is EC1,
"Central London" is the W1/SW1/WC cluster, "North London" is the NW group). Matching
normalises the postcode to uppercase with spaces stripped, takes the outward code, and
picks the longest matching prefix. Anything unmatched, and every city with no table entry,
falls into one section titled `More in ${cityName}`.

`postal_code` is optional in Gravity and **defaults to the empty string**, not null
(`partner_location.rb:26`), so the matcher must treat `""` as unmatched rather than as a
prefix that matches everything.

**Check this before writing the screen.** Nothing in the code proves galleries fill the
field in. One query against staging answers it:

```graphql
{
  city(slug: "london-united-kingdom") {
    showsConnection(first: 100, status: RUNNING) {
      edges {
        node {
          location {
            postalCode
          }
        }
      }
    }
  }
}
```

If most come back empty, every section collapses into "More in London" and the grouping
design needs rethinking before, not after, implementation.

### The destination screen

One screen serves all three sections, at `src/app/Scenes/CityGuide/Screens/CityEventList/`.

Route: `/city-guide/:citySlug/events/:section` where `section` is `fairs`, `shows` or
`opening`. That mirrors the itinerary route already in `routes.tsx:1144` and leaves
`/city/:citySlug/:section` to the legacy screen.

Layout, matching the frames: back button, centred city name, then the section title as a
large heading, then collapsible sections of rows.

The list is a `FlashList` over a flattened array, not a `ScrollView`, per the repo's
list guidance. Sections and their collapsed state flatten to:

```ts
type CityEventListItem<T> =
  | { kind: "header"; sectionId: string; title: string; isExpanded: boolean }
  | { kind: "row"; sectionId: string; item: T }
```

with `getItemType` returning `kind`, so header and row cells recycle separately.

**The screen owns expansion state**, as a `Set` of collapsed section ids, and the flattened
array is memoised on that set plus the sections. This is why `ItinerarySectionRow` cannot be
generalised into this screen: it holds its own `isExpanded` in `useState`
(`ItinerarySectionRow.tsx:19`), which a recycled FlashList cell cannot own. The itinerary
screen keeps it as its ScrollView idiom; this screen gets a stateless header row with an
`onToggle`. Two components, on purpose.

Other list details, so they are not decided twice: `keyExtractor` uses the section id for
headers and the entity id for rows; headers are **not** sticky, because collapsing shifts
every index below it; `getItemType` keys on `kind`.

The screen fetches one page of 100, which is also Gravity's hard page cap
(`api_helpers.rb:8`), so there is no larger single page to ask for. When `totalCount` exceeds
that, the screen renders a footer naming both numbers, for example "Showing 100 of 143".

Truncation and grouping interact badly, so: with `START_AT_ASC` the rows dropped are the
latest-starting ones, scattered across every section. A section can therefore look complete
while missing rows. The screen shows **no per-section counts** for that reason, and the
footer is the only count. Worth knowing that `maxPerPartner` exists on the connection
(`city/index.ts:94`) and is unused here, so one prolific gallery can occupy a visible share
of the 100.

Loading and failure use the existing `withSuspense` helper and `LoadFailureView`, matching
`CitySectionList` and `CityFairList`. An empty result reuses the copy already in
`CityGuideEventList`.

The share icon in the frames is **out of scope for phase 1**. `ShareSheet` exists and works,
but these screens have no artsy.net equivalent to share, and inventing a URL is worse than
omitting the button. Flagged for the designer below.

### Components we reuse rather than build

| Design element             | Already exists as                   | Change needed                                                                             |
| -------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| Collapsible section header | Nothing reusable                    | New stateless `CityEventSectionHeader`. `ItinerarySectionRow` stays as it is, see below   |
| Circular `+` / checkmark   | `ItinerarySaveButton`               | Move to `CityGuide/Components/CityGuideSaveButton`, drop the prefix                       |
| Save behaviour             | `ItineraryStopSaveControl`          | Loses its per-row query; becomes a thin component over an entity resolved at screen level |
| Section title with chevron | `SectionTitle`                      | None                                                                                      |
| Follow mutations           | `useFollowShow`, `useFollowProfile` | None                                                                                      |

The save control matters. `ItineraryStopSaveControl` fires **one Relay query per row**,
because an itinerary stop only carries a slug. On these screens the show data is already in
the list query, so the shared control takes a fragment ref and fires nothing. That removes
the itinerary sub-project's most expensive decision from the new screens instead of
inheriting it.

The row itself is new: `CityEventRow` in `CityGuide/Components/`, with a thumbnail, the show
or fair name, the partner name, `exhibitionPeriod` as the third line, and the save button.
Tapping the row opens the entity's `href`.

### Testing

Pure functions carry most of the coverage, which is also the lesson from the itinerary work:
`groupByNeighborhood`, `groupByOpeningWeek`, postcode normalisation and the neighbourhood
lookup get unit tests. Screen tests use `relay-test-utils` with `MockPayloadGenerator` and derive
their expected counts from the mock data rather than hardcoding numbers, since hardcoded
counts produced three false alarms last time.

Test files are named explicitly when running Jest. Never the full suite, never
`--findRelatedTests`.

## Phase 2: city itineraries

### What a city itinerary is

**It is a view, not storage.** A user has one itinerary per city, and for v1 it is a
city-scoped filter over their global follows. Nothing about it is independent of following.
Every one of these follows from that, and all of them are intended for v1:

- Saving a show anywhere else in the app adds it to that city's itinerary, with no action
  taken inside the City Guide.
- Unfollowing from the show page, from Favorites, or from anywhere else removes it.
- "Add Full List" changes the user's global follows, not a private list.
- A show or fair that has ended disappears from the itinerary.
- There is no visit order, and no way to remove a stop while staying followed.

If any of those turn out to be unacceptable, the itinerary needs its own storage, which is
the appendix's fourth API draft and a different piece of work.

**"City" is a 25km radius, not a boundary.** `LOCAL_DISCOVERY_RADIUS_KM = 25`
(`city/constants.ts:1`), which `me/followed_shows.ts:47` sends to Gravity as `max_distance`
after resolving the city slug to coordinates. `City.showsConnection` and
`City.fairsConnection` use the same constant, so phase 1 and phase 2 agree on what a city is.
Gravity's own default is 75km but Metaphysics always overrides it, so 75 never applies.

**The show window is widened; the fair window cannot be.** `CitySavedList` today queries
`status: RUNNING_AND_UPCOMING` with no `dayThreshold` (`CitySavedList.tsx:79`), and Gravity
defaults that upcoming window to 15 days (`event_status.rb:5,46-48`), so a show opening in
three weeks would be missing from the itinerary of the trip you are planning it for. Shows
therefore pass `dayThreshold: 365`.

Fairs get no such option. Gravity's fairs endpoint calls the scope with no argument,
`fairs.send(params[:status].to_sym)` (`v1/fairs_endpoint.rb:166`), and Metaphysics' fairs
resolver forwards only `near`, `max_distance`, `sort` and `status` (`city/index.ts:128-141`).
So a followed fair appears once it is running or opens within 15 days, and there is no
argument that changes it. The asymmetry is real and unfixable from the client. It is small in
practice, since fairs are announced long in advance but are few per city.

### Contents

**Shows.** `me.followsAndSaves.showsConnection(city:, status: RUNNING_AND_UPCOMING,
dayThreshold: 365)`. Filtered server side, paginated, and `CitySavedList` already queries
exactly this shape.

**Fairs.** `City.fairsConnection(status: RUNNING_AND_UPCOMING)` filtered client-side on
`profile.isFollowed`. This is exact rather than approximate: membership comes from the city's
own fair list, not from guessing a fair's city. `followsAndSaves.fairsConnection` is the wrong
tool here because it takes no `city` argument.

**Galleries.** Deferred. `followsAndSaves.galleriesConnection` has no `city` argument, and a
gallery with locations in several cities has no single correct answer. Recorded as an open
question rather than designed.

### Ordering and pagination, given two connections

Shows paginate and fairs do not, so the two cannot be interleaved by date without the order
changing under the user as pages load. The rule is therefore positional and stated once:

1. **Followed fairs first**, sorted `START_AT_ASC`, all of them, unpaginated. One page of 100
   city fairs is the whole set for any real city.
2. **Followed shows after**, in the connection's existing order, paginated as they are today.

A fair never appears below a show, so loading another page of shows cannot reorder anything
already on screen.

### The home entry point

A fourth summary row under Opening Soon, reusing `CityGuideEventSummaryRow`:
`Your London Itinerary`, with a combined count and the first few names. It opens the itinerary
screen. The row renders nothing when the combined count is zero, rather than showing an empty
state on the home.

**The count is fairs plus shows, and neither half can be read cheaply.**
`FollowedShowConnection` exposes only `edges` and `pageInfo`
(`schema.graphql:19965-19975`), unlike the `City` connections, so the show count comes from
counting edges over one page of 100. The fair count comes from counting the city's fairs whose
`profile.isFollowed` is true, which needs no extra request because the same query fetches
them. The row renders a `+` suffix when the show half comes back full, since the true total is
then unknown. Adding `totalCount` to `FollowedShowConnection` is a one-line Metaphysics change
and is the appendix's cheapest item.

### The itinerary screen

`CitySavedList` gets an entry point and its rows restyled, at its existing route
`/city-save/:citySlug`.

It **stops delegating to `CityGuideEventList`** and renders its own list of `CityEventRow`.
Today it passes a bucket to that shared component (`CitySavedList.tsx:56-64`), which renders
`ShowItemRow` and is also used by `CitySectionList`. Extending `CityGuideEventList` to handle
fairs, the new row and a mixed list would change a component the legacy City Guide still
renders, which decision 4 rules out. So the shared component is left exactly as it is.

Pagination stays for the show half. This screen has no grouping, so pagination has nothing to
fight with.

### Add Full List

A button on the curated itinerary screen that follows every stop's entity at once. Since the
itinerary is a view over follows, this changes the user's global follows and the copy should
not imply a private list.

Behaviour: idle "Add Full List", in flight, then "Added" once nothing is left unfollowed.
Already-followed stops are skipped rather than toggled off, so pressing twice cannot unsave
anything. On partial failure the button returns to its idle label and a toast names what
landed, for example "Added 6 of 8". Rows update as each mutation lands, not in a batch at the
end.

**Where the entities come from.** The button needs every stop's entity, including stops in
sections the user has collapsed, and today each stop resolves its own entity inside its own
save control. Collapsing a section unmounts those rows, so a naive "read what the rows
fetched" approach silently drops stops.

So the screen renders one invisible resolver per saveable stop, each inside its own Suspense
and error boundary, and each reports its resolved entity into a screen-owned store keyed by
`stopId`. Rows and the button both read that store. Resolvers stay mounted regardless of which
sections are open.

The query count does not change. Slugs still cannot be batched, because
`showsConnection(ids:)` reaches Gravity's `shows.in(_id:)`, which matches BSON ids only and
returns them unordered. What changes is that resolution no longer depends on a row being
visible.

**Mutations must keep their optimistic updates.** `useFollowShow` and `useFollowProfile` each
supply an optimistic response and an updater (`useFollowShow.ts:37-48`,
`useFollowProfile.ts:34-46`). Bulk-add must produce the same store writes, so the mutation
configuration is extracted into a shared imperative helper that both the hooks and the button
use. Committing the raw documents without that configuration would leave rows stale until a
refetch, and the previous sub-project already shipped one broken optimistic updater.

### Follow polish

The leftovers from the itinerary handover, all small. The handover overstates two of them, so
the accurate version:

- **`ShowFollowButton` and `Components/Lists/ShowItemRow` hand-roll `commitMutation`** and
  should move onto `useFollowShow`. Neither is the fully broken case the handover describes:
  `ShowFollowButton` supplies a valid `id`, field name and updater
  (`ShowFollowButton.tsx:65-78`), and `ShowItemRow` has a malformed aliased optimistic
  response but still has an explicit record updater (`ShowItemRow.tsx:73-86`). The fully
  broken implementation was `CityGuideEvent`, which is already migrated. So this is
  consolidation, not a bug fix, and the migration must preserve each one's tracking, in-flight
  guard, callbacks and error behaviour.
- **`GalleryFollow` and `GalleryUnfollow` are missing from `ItineraryStopSaveControl`.** They
  exist at `utils/track/schema.ts:280-281` and are used elsewhere in the app, by Onboarding at
  `useOnboardingTracking.ts:92`. They are unused by the City Guide specifically, not unused
  in Eigen.

## Analytics

Every new surface sends tracking, because a screen with no events is invisible in reporting
and gets rebuilt rather than fixed.

| Event                 | Fires when                                                                        |
| --------------------- | --------------------------------------------------------------------------------- |
| Screen view           | Each destination screen mounts, carrying the section key and city slug            |
| Screen view           | The itinerary screen mounts, carrying the city slug                               |
| Tap                   | A home summary row or its title is pressed, carrying which section it opens       |
| Save / unsave show    | An event row's `+` is pressed, using the existing `SaveShow` / `UnsaveShow` names |
| Save / unsave gallery | A partner is followed, using `GalleryFollow` / `GalleryUnfollow`                  |
| Save fair             | A fair's profile is followed                                                      |
| Bulk add              | "Add Full List" completes, carrying how many were attempted and how many landed   |

Existing event names are reused wherever one exists. Nothing new is invented for an action
Eigen already tracks.

## Open questions for the designer

- **The `TKTK` subtitle** on the home rows is read here as the first three names. Confirm.
- **The row's second line** is inconsistent in the frames: "8 Holland Street" on one row,
  "Atlas Gallery" on the next. This spec uses the partner name throughout.
- **"Spots" and "stops"** are both used for the same thing, in the sheet and on the
  home. Pick one.
- **The admission line is omitted entirely**, not mocked, and every row shows dates instead.
  Confirm that is acceptable until `Show.isFreeAdmission` exists.
- **Neighbourhood labels for cities other than London.** All other cities get one
  `More in ${cityName}` section until the real field exists.
- **The share icon** on the destination screens has no obvious target. Omitted for now.
- **Galleries in a city itinerary.** No city filter exists, and multi-location galleries
  have no single answer. Deferred rather than designed.
- **A followed fair opening more than 15 days out** is missing from the itinerary and cannot
  be included from the client, because Gravity's fairs endpoint calls the status scope with no
  argument. Acceptable, or does it need a Metaphysics change?
- **"Add Full List" changes global follows**, since the itinerary is a view over them. Confirm
  the copy should not imply a private list.

## Out of scope

- The "Add to Itinerary" bottom sheet, "Create New Itinerary", and multi-list selection.
  All removed by the one-itinerary-per-city decision.
- Any Gravity or Metaphysics change. The appendix drafts them; this work ships without them.
- The legacy `CityGuide.tsx`, `CitySectionList` and `CityFairList` screens, beyond leaving
  them alone.
- Replacing the mock curated itineraries with a real API.
- A mocked admission line, and any `useSaveTarget` style seam over the follow mutations.
  Both were considered and cut, for the reasons given above.
- Extending `CityGuideEventList` to render fairs or the new row. `CitySavedList` stops using
  it instead, so the legacy City Guide keeps the component it renders today.
- Visit ordering, and removing a stop from an itinerary without unfollowing. Both need
  storage the itinerary does not have.
