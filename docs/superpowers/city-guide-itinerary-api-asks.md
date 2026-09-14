# What Gravity and Metaphysics need for a real city itinerary

Written 2026-09-08. Narrower than `HANDOVER-city-guide-api-gaps.md`: this is only what the
"Your London Itinerary" list needs in order to stop being a filtered view of global follows.

## How it works today, for context

Nothing is stored. The list is assembled from the user's follows:

- **Shows** — `me.followsAndSaves.showsConnection(city:)`, scoped server-side.
- **Fairs** — the _city's_ fairs from `city(slug:)`, filtered client-side on
  `profile.isFollowed` (`CitySavedList.tsx:98`).
- **Galleries** — absent, because `FollowsAndSaves.galleriesConnection` takes no city argument.

So following a show anywhere adds it, unfollowing anywhere removes it, and there is no
membership, no ordering, and nothing a user could share.

## Already built — please don't rebuild

- Gravity `GET /itineraries` filters by `user_id`, `city_slug` and `is_curated`, and already
  scopes a listing to public itineraries plus the caller's own.
- Metaphysics exposes `Me.itinerariesConnection(citySlug:)` and
  `Query.itinerary(id:, shareToken:)`.

Reading "my itineraries in London" therefore works. Everything below is the write path and the
few read fields the screens need.

---

## 1. Somewhere for a stop to land, without a create flow

The UI has no "create an itinerary" step. Tapping the plus on a London show has to put it
somewhere. Two things make that awkward today:

- `POST /itinerary` creates no section, and `POST /itinerary_stop` requires an
  `itinerary_section_id`.
- So a client would need three calls — create itinerary, create section, create stop — and two
  quick taps would race into two itineraries.

**Ask, Metaphysics:** one mutation that does the whole thing.

```
addItineraryStop(input: { citySlug, itemType, itemID }): AddItineraryStopPayload
```

**Ask, Gravity:** an endpoint that finds-or-creates the caller's personal itinerary for a city
_and_ a default section, then appends the stop — idempotent, so a repeat is a no-op returning
the existing stop. Either `POST /itinerary_stop` accepting `city_slug` instead of a section id,
or a dedicated `POST /me/city_itinerary/stops`.

The alternative — auto-create a default section on `POST /itinerary` and add a find-or-create
itinerary endpoint — also works, but leaves the client orchestrating three calls.

## 2. Removing a stop by what it points at

The client is holding a show, not a stop: the rails and lists render entity cards. Removing by
stop id means every card first looks up its own stop.

**Ask:** accept item identity on the way out too —
`removeItineraryStop(input: { citySlug, itemType, itemID })`, backed by a Gravity delete that
resolves (user, city, item) to the stop.

## 3. A uniqueness constraint, so a double tap cannot add twice

`itinerary_stops` indexes `[item_type, item_id]` but nothing enforces uniqueness within a
section. Two taps in flight at once currently produce two identical stops.

**Ask, Gravity:** a partial unique index on `(itinerary_section_id, item_type, item_id)` where
`item_id IS NOT NULL` — partial, because editorial stops (a café, a plain address) have no item
and several of them may legitimately sit in one section.

## 4. "Is this already on my itinerary?"

Every card draws the plus as a tick when saved. Today that is `Show.isFollowed`. Once
membership is real, the client needs to know whether _this_ entity is on the city's itinerary,
and it cannot afford a lookup per card.

**Preferred ask:** a field per entity, from a batched loader —
`Show.isOnCityItinerary(citySlug:)`, and the same on `Fair` and `Partner`.

The alternative is for the client to load the itinerary's item ids once and match locally. That
is a single query, but it couples every card on the screen to the itinerary having loaded, and
the rails render before it.

## 5. An itinerary-level stop count

The home summary row reads "N stops". `Itinerary` exposes `sectionsCount`, and each
`ItinerarySection` its own `stopsCount`, so today a count means fetching every section and
summing.

**Ask:** `Itinerary.stopsCount`.

## 6. Reordering — nearly done

Gravity already routes `position` through `acts_as_list`'s `insert_at` on
`PUT /itinerary_stop`, which is the hard part. It just needs exposing:
`updateItineraryStop(input: { id, position })`.

## 7. Followed galleries by city — decide whether it still matters

`FollowsAndSaves.galleriesConnection` has no `city` argument (gap M6). If a gallery becomes an
itinerary stop like anything else, this stops being needed — a stop is a stop. Worth an
explicit decision rather than implementing it by default.

---

## The product decision underneath all of it

**Does tapping the plus follow the entity, add an itinerary stop, or both?** Today's UI
conflates them, because the itinerary _is_ the follow list.

- **Both** — the add mutation should also follow, or the client fires two calls and can leave
  them inconsistent. Simplest for users, and keeps the Saves tab in step.
- **Separate** — the Saves tab and the city itinerary diverge, the plus needs two distinct
  states, and the designs need a second affordance.

The API shape above assumes **both**, since that matches what the screens do now. If it should
be separate, `addItineraryStop` stays as specified and the follow mutations stay untouched, but
the client needs new design for the two states.

## Order to build in

1. **§1** — without somewhere to put a stop, nothing else is reachable.
2. **§4** — without membership, every card lies about its state.
3. **§2, §3** — removal and idempotency, to make adding safe.
4. **§5, §6** — the count and reordering.
