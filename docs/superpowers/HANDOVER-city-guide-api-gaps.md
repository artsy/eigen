# City Guide — what's still missing in Gravity and Metaphysics

Written 2026-09-07, from reading eigen `city-guide-itineraries-docs`,
gravity `mounir/city-guide-itineraries`, and metaphysics `mounir/city-guide-itineraries`.

Both backends are far along. Gravity's itinerary support is effectively complete; Metaphysics
has the whole read path and none of the write path. The list below is only what blocks the
client, each with the evidence and a suggested shape.

---

## Gravity — one gap

### G1. `itineraries` has no image column

`ItineraryHeader.tsx:14` renders a hero image for the guide. `image_url` exists on
`itinerary_stops` but not on `itineraries`
(`db/migrate/20260827000001_create_itineraries.rb` — the `image_url` at line 62 is inside the
stops table).

**Ask:** add `image_url` (string) to `itineraries`, permit it on create and update, and include
it in the endpoint's JSON. A hero is an editorial choice, so it should be its own column rather
than derived from the first stop.

Everything else the client needs is already there: CRUD on all three levels, publish/unpublish,
`POST /:id/copy`, share-token mint and revoke, and stop reordering through `position`
(applied via `insert_at`, so sibling shifting is correct).

---

## Metaphysics — the write path is entirely absent

### M1. No mutations at all — blocks every write the app needs

`type Mutation` contains no itinerary field. Gravity's endpoints exist and are unexposed, so
the app can add nothing, reorder nothing, and accept no shared guide.

Each of these maps onto a Gravity route that already exists:

| Mutation                                                                       | Gravity route                              |
| ------------------------------------------------------------------------------ | ------------------------------------------ |
| `createItinerary` / `updateItinerary` / `deleteItinerary`                      | `POST/PUT/DELETE /itinerary(/:id)`         |
| `createItinerarySection` / `updateItinerarySection` / `deleteItinerarySection` | `POST/PUT/DELETE /itinerary_section(/:id)` |
| `createItineraryStop` / `updateItineraryStop` / `deleteItineraryStop`          | `POST/PUT/DELETE /itinerary_stop(/:id)`    |
| `publishItinerary` / `unpublishItinerary`                                      | `POST /:id/publish`, `POST /:id/unpublish` |
| `copyItinerary`                                                                | `POST /:id/copy`                           |
| share token mint / revoke                                                      | `PUT /:id` with the two token flags        |

Two notes for whoever writes these:

- **Reordering is `updateItineraryStop` with `position`,** not a separate mutation. Gravity
  already routes `position` through `insert_at` rather than assigning the column.
- `copyItinerary` is the "share a guide, recipient keeps it" requirement. It needs to work for
  a caller who does not own the source itinerary, which is what `share_token` authorizes.

### M2. `Itinerary` has no hero image field

Depends on G1. Suggest `heroImageURL: String`. Until it lands the client either mocks the hero
or derives it from the first stop, both of which we agreed against.

### M3. Resolvers are fixture-backed, so `ItineraryStop.item` always resolves to null

`src/schema/v2/itinerary/fixtures/itineraries.ts` says so in its own header: `item_id` holds
real artsy.net **slugs** rather than BSON ids, so the `Show | Fair | Partner` union resolves to
null for every stop. The client's save controls and anything derived from the real entity
cannot be exercised end to end.

**Ask:** swap the fixture calls for the Gravity loaders now that Gravity is built — the fixture
header says this is one line per call site. Dropping real staging ids into the fixture would
also work, but keeps a second source of truth alive.

### M4. `ItineraryStop.category` is `String`, and should be an enum

Its own description already reads `MUSEUM | GALLERY | SHOW | FAIR`, and Gravity validates
against `ItineraryStop::CATEGORIES`. The client has a closed union
(`itineraryTypes.ts` — `ItineraryStopCategory`), so as a `String` it has to validate at runtime
and cannot switch exhaustively.

### M5. `ItinerarySection.title` is nullable, the client treats it as required

The client uses the section title as a required opaque display string. Gravity's column is
nullable, so making it non-null in Metaphysics needs a fallback rule — "Day N" from `position`,
say. Either decide that rule server-side or tell us to fall back client-side; it just needs to
live in one place.

### M6. `FollowsAndSaves.galleriesConnection` takes no city filter

Its only args are `first`/`last`/`after`/`before`, while `showsConnection` accepts `city`.
The city-scoped saved list needs followed galleries filtered to the city the user is viewing;
today it would have to fetch everything and filter client-side.

---

## Resolved since the previous handover — no action

- **`Location.neighborhood`** exists. Neighborhood grouping is unblocked.
- **`Show.isFreeAdmission`** exists, so the rails' "Free / Paid Entry" line has a real field.
- **`Me.itinerariesConnection(citySlug:)`** and
  **`Query.itinerariesConnection(citySlug:, isCurated:)`** exist.
- **`displayTime` is not a gap.** Gravity dropped the column deliberately
  (`20260907000002_remove_display_time_from_itinerary_stops.rb`) and Metaphysics' `startAt` /
  `endAt` take a `format` argument, so the string is still formatted server-side and the client
  never parses a date.
- **Author stays a name, not a `User`.** Reverted on purpose in both repos; the Metaphysics
  type comment explains why — Gravity's user endpoint 403s anonymous readers, so a public
  guide would lose its byline entirely.

---

## Priority, from the client's point of view

1. **M1** — without mutations the itinerary is read-only, which is most of the feature.
2. **M3** — until `item` resolves, nothing about a stop's real entity can be tested.
3. **G1 + M2** — the header renders a hero today and has nothing to render.
4. **M4, M5, M6** — shape and ergonomics; each has a client-side workaround.
