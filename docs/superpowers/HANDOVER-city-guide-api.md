# City Guide — handover for the API work

**Written:** 2026-08-27. **Supersedes** `docs/superpowers/HANDOVER.md`, which covered only the
first sub-project. Delete both once the API work lands.

The next piece is the one that matters: giving the City Guide a real backend in
**`../metaphysics`** and **`../gravity`**. Start fresh — new branch, new PR. This document is
what you need so you do not rediscover any of it.

---

## 1. Three requirements that change the data model

These came from the developer after the client work was built. **Design for all three now**, even
though the current UI only exercises the first in its simplest form.

**1. More than one itinerary per person, per city.** Today the client assumes exactly one — the
default. That is a v1 simplification, not a product decision, and the developer expects multiple
"pretty soon". So the schema must be plural from the start: an itinerary is an entity with an
owner and a city, not a singleton derived per user. Get this wrong and every client query needs
rewriting rather than extending.

**2. Itineraries are shareable.** A user should be able to share one with someone else — either so
they can copy it into their own account, or just as a link they open without copying. That means
an itinerary needs a stable public identifier and a visibility concept, and "copy this itinerary
to my account" is a real mutation, not a client-side loop. Think about what a recipient sees if
the owner later edits or deletes it.

**3. Stop order is part of the data.** The current UI does not show ordering, but the developer
was explicit that it matters, because they want the option of numbered "go here, then here" lists
later. So stops carry an explicit position, ordering is stable, and reordering is a mutation. Do
not let order be an accident of insertion time or of a sort key that happens to work today.

A consequence worth stating: requirements 1 and 3 together mean the same show can sit in two of
one user's itineraries at different positions. So membership is a join with its own attributes,
not a set.

---

## 2. Where the client is

|                  |                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Branch           | `city-guide-saves`, 61 commits, stacked on `city-guide-itineraries-docs`                                                        |
| Parent PR        | [#13992](https://github.com/artsy/eigen/pull/13992), draft, → `main`                                                            |
| Specs            | `docs/superpowers/specs/2026-08-27-city-guide-events-and-saves-design.md`                                                       |
| Plans            | `docs/superpowers/plans/2026-08-27-city-guide-events-and-saves.md` (16 tasks), `…-shared-map.md` (3 tasks)                      |
| Execution record | `.superpowers/sdd/2026-08-27-city-guide-events-and-saves/progress.md` — every decision, deviation and deferred item, gitignored |

**Built and reviewed:** the three event sections on the City Guide home with real data; one shared
screen serving Current Fairs / Current Shows / Opening Soon, grouped into collapsible sections; a
city itinerary screen; bulk "Add Full List"; a shared map across three screens with clustering, a
pin-tap card and a cluster rail.

**Still mock:** the curated itineraries themselves (`Screens/Itinerary/utils/mockItineraries.ts`)
and the neighbourhood label table (`utils/mockCityNeighborhoods.ts`).

---

## 3. The v1 model, and why the API replaces it

**Today a "city itinerary" is not stored. It is a filtered view of the user's global follows.**
`me.followsAndSaves.showsConnection(city:)` plus the city's fairs filtered on
`profile.isFollowed`. That was a deliberate decision to ship without backend work, and its
consequences were accepted knowingly:

- Following a show anywhere in the app adds it to that city's itinerary.
- Unfollowing anywhere removes it.
- "Add Full List" changes the user's global follows, not a private list.
- An ended show disappears.
- There is no order, and no way to remove a stop while staying followed.

**Every one of those becomes wrong once itineraries are real.** The API work is what lets the
client stop conflating "saved" with "on my itinerary". Expect to revisit
`CityGuideItinerarySummary` and `CitySavedList` when it lands.

---

## 4. Backend findings — do not rediscover these

All verified by reading the checkouts, not inferred.

**There is no `Itinerary` model in Gravity.** And `Collection` is the wrong thing to stretch: it
is ActiveRecord with `has_many :collected_artworks` (`app/models/domain/collection.rb:4`), and
`CollectedArtwork` holds a plain `artwork_id` FK, not a polymorphic association. Metaphysics
exposes only `artworksConnection` / `artworksCount` (`me/collection.ts:25,81`). A show or a
gallery cannot be a member. Expect a new `Itinerary` + `ItineraryStop` pair with a `position` and
a polymorphic stop target, rather than a widened `Collection`.

**A "city" is a 25km radius, not a boundary.** `LOCAL_DISCOVERY_RADIUS_KM = 25`
(`../metaphysics/src/schema/v2/city/constants.ts:1`), sent to Gravity as `max_distance` by both
`city/index.ts` and `me/followed_shows.ts:47`. Gravity's own default is 75km but Metaphysics
always overrides it. An earlier review reported 75 by reading the constant's name and not its
value, and that error reached a spec — read values.

**`RUNNING` and `UPCOMING` are disjoint; `CURRENT` overlaps both.**
`../gravity/app/models/concerns/event_status.rb:19-35`. Using `CURRENT` puts the same show in
both "Current Shows" and "Opening Soon".

**`RUNNING_AND_UPCOMING` defaults to a 15-day upcoming window** (`event_status.rb:5,46-48`), which
silently hid shows opening more than two weeks out. The client passes `dayThreshold: 365`.

**Fairs cannot have their window widened from the client.** Gravity's fairs endpoint calls the
status scope with no argument (`../gravity/app/api/v1/fairs_endpoint.rb:166`) and Metaphysics
forwards no threshold (`city/index.ts:128-141`).

**`FollowedShowConnection` has no `totalCount`** (`data/schema.graphql:19965-19975`,
`me/followed_shows.ts:9-13`), unlike the `City` connections — it uses bare
`connectionDefinitions`. This forced a "100+" fudge on the home count and is a one-line fix worth
doing.

**Three fields the designs want and no backend has:**

- `Location.neighborhood` — nothing stores it. But Gravity's `CityGeocodingService` **already
  receives a `neighborhood` from the geocoder and discards it** (`spec/services/city_geocoding_service_spec.rb:15`
  exercises the value), because it only builds city-level slugs. Persist
  `PartnerLocation#neighborhood` and resolve it beside `postalCode` in `location.ts`, and
  `mockCityNeighborhoods.ts` can be deleted. `postal_code` itself defaults to `""`, not null
  (`partner_location.rb:26`).
- `Show.isFreeAdmission` — nothing stores admission. The designs show "Free / Paid Entry"; the
  client omits the line rather than faking it.
- Galleries have no city filter. `followsAndSaves.galleriesConnection` takes no `city` argument,
  and a gallery with locations in several cities has no single answer.

---

## 5. A starting point for the shape

Not a design. A first draft to argue with, written against the three requirements above.

```graphql
type Itinerary {
  id: ID!
  internalID: ID!
  slug: ID!
  name: String!
  city: City
  """
  Artsy-authored (a curated guide) vs user-authored.
  """
  isCurated: Boolean!
  """
  Stable public identifier for sharing, independent of the owner.
  """
  shareableID: ID
  visibility: ItineraryVisibility! # PRIVATE | LINK | PUBLIC ?
  stopsCount: Int!
  stops: [ItineraryStop!]! # ordered by position
  coverImage: Image
}

type ItineraryStop {
  id: ID!
  position: Int! # explicit, stable, reorderable
  """
  Opaque display string; two stops may share one. Identity is `id`.
  """
  sectionTitle: String
  """
  Editorial: a museum and a gallery are both Partners and the save target cannot tell them apart.
  """
  category: String
  item: ItineraryStopItem
}

union ItineraryStopItem = Show | Fair | Partner

extend type Me {
  itinerariesConnection(city: String, first: Int, after: String): ItineraryConnection
}
```

Mutations to think through: create, rename, delete, add stops, remove stop, **reorder stops**,
and **copy an itinerary to my account** (which is requirement 2's real shape, not a client loop).

**Do not batch stop lookups by slug.** `showsConnection(ids:)` reaches Gravity's `shows.in(_id:)`,
which matches BSON ids only and returns them unordered. The client resolves one query per stop
because of this. If the API returns entities inline, that whole mechanism disappears — which is
the single biggest client simplification available.

**Not every stop is an Artsy entity.** A curated itinerary can include a cafe or a plain address.
The client models this as a nullable save target and excludes such stops from following. The
schema needs the same: a stop that is a place, not an entity.

---

## 6. Conventions learned the hard way

- **Never run the full Jest suite, and never `--findRelatedTests`.** Both hang in eigen. Name test
  files explicitly.
- **`lint-staged` amends every commit after you make it**, so the SHA you push differs from the
  one you kept. Push needs `--force-with-lease`, and only after `git diff <remote> <local> --stat`
  comes back empty.
- **Generated Relay artifacts are gitignored** (`.gitignore:147`); only `.gitkeep` is tracked.
- **Relay requires operation names prefixed with their module name.** Moving a query between files
  without renaming it breaks `yarn relay`.
- **`useFragment(fragment, extractNodes(...))` infers `unknown`.** Pass the `$key` type explicitly.
- **`setupTestWrapper`'s `renderWithRelay` resolves exactly one operation unconditionally at
  render** (`setupTestWrapper.tsx:112-129`), so it throws on a tree that fires no query and
  under-resolves one that fires several. `mockResolveLastOperation` returns void. For multi-query
  trees drive `createMockEnvironment` and queue **one fresh resolver function per operation** —
  Relay removes a consumed resolver by reference, so queuing the same function twice removes both.
- **`env.mock.reject(operation, error)`** rejects a specific operation; `rejectMostRecentOperation`
  in a loop hits the same one repeatedly and hangs a bounded runner.
- **Jest does not clear mocks between tests here.** Any file asserting on `navigate` or
  `mockTrackEvent` needs `beforeEach(() => jest.clearAllMocks())`, or a later assertion passes off
  an earlier test's call.
- **`@gorhom/portal` does not carry React context.** Anything context-dependent inside a bottom
  sheet silently renders nothing. This cost a fix round.
- **`@artsy/icons`** must be imported from `@artsy/icons/native`.
- Agent-created PRs need an `Assisted-by:` trailer.

---

## 7. What verification can and cannot see

Three bugs this session were **invisible to tests by construction**, and all three were found by
the developer on a device in seconds:

- **Row text rendered at zero width.** RNTL performs no layout, so `getByText` found it happily.
  Eleven passing tests, a review that traced the render path, and a simulator check that happened
  to open the one empty screen.
- **A section title that never scrolled.** Nothing in Jest scrolls.
- **A context read inside a portal**, which rendered nothing.

And **Mapbox's `MapView` mocks to `() => null`** (`setupJest.tsx:295-306`), so pins, camera,
clustering, the route line and every card have **no automated coverage at all**. Map logic lives
in pure functions for that reason. A missing `iconImage` name draws nothing rather than erroring.

For the API work the equivalent trap is different but real: a resolver that compiles and returns
plausible-looking data is not a resolver that returns _correct_ data. Prefer checking against real
Gravity responses over trusting types.

---

## 8. Open items on the client, carried forward

- Two regressions this session came from briefs that said "stop using X" without saying what the
  user should see instead — a lost screen title, and a lost header. When removing a dependency,
  state the replacement.
- Deferred minors, all triaged as shippable: an unasserted tracking name on the show save control;
  a test using a header count as its readiness gate; a misleadingly named test in
  `ItineraryStopEntities.tests.tsx`.
- `useTracking()` is untyped in most City Guide call sites. It is typed in
  `ItineraryAddFullListButton` and `CityEventListScreen`, and that typing is what would have
  caught a malformed payload that shipped for three commits.
- The bulk-add event now carries `owner_id`/`owner_slug`; two new `ActionNames` values
  (`CityGuideShowMap`, `CityGuideShowList`) were added for the map toggle and want a glance from
  whoever owns the analytics vocabulary.
- The palette `Image` + blurhash change was **reverted** after crashing on Android: palette's
  `Image` reads `width`/`height` from **props**, not `style`, and two call sites passed them only
  in `style`. Worth redoing with `height` as a prop, plus `aspectRatio` where height is unknown.
- Never verified visually: the Save button in the itinerary stop preview sheet, and the compact
  header title on the event screens.
