# Telling whether a stop is already on an itinerary

**Goal:** One API call that answers "is this stop already on one of my itineraries, and which
stop is it there" — so a guide's rows can show a tick or a plus, and remove the right stop,
without fetching every itinerary's every stop.

Spans `../gravity` and `../metaphysics`. The eigen side is a follow-up, not part of this.

## What exists today

Nothing. I checked:

- `Itinerary` has `curated`, `personal`, `in_city`, `published`, `publicly_readable`,
  `with_contents`, `with_stop_counts`. No membership scope.
- `GET /api/v1/itineraries` filters on `user_id`, `city_slug`, `is_curated`. Nothing about
  containing an item.
- `itinerary_stops_endpoint.rb` has `post`, `put` and `delete` on `itinerary_stop/:id`. **There
  is no index at all**, so stops cannot be queried, only written.
- Metaphysics exposes `Itinerary`, `ItinerarySection`, `ItineraryStop` and
  `Me.itinerariesConnection`. No `isOnCityItinerary`, no membership argument, no field on
  `Show`, `Fair` or `Location`.

So the client does it by hand: `me.itinerariesConnection` with
`sections { stops { internalID item { __typename ... internalID } } }`, then matches on typename
plus id. That over-fetches every stop of every itinerary to answer one boolean per row, and it
is the same query whose positional Relay records caused the "this stop is no longer available"
bug, because `ItinerarySection` and `ItineraryStop` have no `id`.

## The shape

`ItineraryStop` rows carry `item_type` and `item_id` already — the join needed is
itinerary → sections → stops, which no association spans today.

### Gravity: an index on `itinerary_stops`

```
GET /api/v1/itinerary_stops                                     # all of mine
GET /api/v1/itinerary_stops?city_slug=london-united-kingdom      # one trip's worth
GET /api/v1/itinerary_stops?item_type=PartnerShow&item_id=<id>   # one entity
```

Returns **the caller's own** stops, each serialized with the `itinerary_id` it belongs to.
`permit :user`; never another user's stops — whether someone else has a show on a private
itinerary is not a public fact. Asking it of a whole guide means one call filtered by city.

- `has_many :stops, through: :sections` on `Itinerary`, and the matching
  `ItineraryStop.for_item(item_type, item_id)` scope. Neither exists.
- The endpoint scopes to `Itinerary.where(user_id: current_user.id.to_s)` through the join, so
  authorization is the query rather than a per-row check.
- `item_type` and `item_id` are all-or-none, and `item_type` takes
  `ItineraryStop::ITEM_TYPES`, so a typo is a 400 rather than an empty list.
- `itinerary_id` is selected through the join and merged into the response, rather than added
  to `json_properties`: the levels are fixed at `short`/`public`/`all`, and it lives on the
  section, so serializing it everywhere would cost a query per stop in every existing listing.

Why an index rather than a filter on `GET /itineraries`: the client needs the **stop id** to
remove it, and the itineraries index serializes at `:short`, which omits sections. Filtering
that index would say which itineraries match but not which stop to delete, so the client would
need a second call anyway.

### Metaphysics: `ItineraryStop.myItineraries`

```graphql
itinerary(id: "chill-vibes-only") {
  sections { stops {
    internalID
    isOnMyItinerary
    myItineraries { internalID title }
  } }
}
```

The caller's own itineraries holding this stop's entity, so a client can name which ones it is
already on. `isOnMyItinerary` is the same answer as a boolean, for a caller that only wants a
tick. Both empty/false for a custom stop, which points at no entity.

On the stop, not the itinerary: the question is "is _this stop_ already on one of mine?", asked
from a guide the reader is looking at.

Two caches keep it off the N+1 path, and each needs a test asserting the property that makes it
work, since a mocked loader does no caching:

- The caller's stops are asked for **by city**, not by entity, so every stop of a guide sends
  identical params and `gravityLoader`'s cache collapses them into one request
  (`loader_with_authentication_factory.ts:87-89`). A stop's payload has no city, so
  `attachStopItemsToMany` stamps the parent's on — it already walks every stop once per page.
- Itineraries are then fetched **by id**, so the ids asked for are the ones actually holding the
  entity rather than one per stop, and `itineraryLoader` caches each. By id rather than by
  listing the caller's itineraries, so a page size cannot truncate the answer.

## Why not the alternatives

**`Itinerary.stopForItem(itemType:, itemID:)`.** Built first and removed: it answers the
mirror question — "does this itinerary hold that entity?" — which suits a list of itineraries
but not a guide's list of stops, which is what actually needed asking.

**`ItineraryStop.myItineraryStops`.** The first shape of this field, returning the caller's own
_stops_ so each carried the id `deleteItineraryStop` takes. Renamed because it read as "the
stops on my itineraries" rather than as the question, and because naming the itinerary is what
a client actually shows. The cost is that removing now needs the stop id looked up separately —
`Itinerary.stopForItem` or a by-item delete mutation would close that.

**`Show.isOnMyItinerary`.** Reads better on a rail card, where there is no stop to hang the
field on. The same by-city call would serve it, but a rail's shows span no single itinerary, so
the key would have to be the caller alone. Worth having later; not what a guide needs.

**A membership filter on `Me.itinerariesConnection`.** Returns the matching itineraries but not
the stop ids, and the sheet has to show every itinerary anyway — ticked or not — so filtering
is the wrong operation.

## Files

**Gravity** (`../gravity`)

- `app/models/domain/itinerary.rb` — `has_many :stops, through: :sections`
- `app/models/domain/itinerary_stop.rb` — `for_item` scope
- `app/api/v1/itinerary_stops_endpoint.rb` — the index
- `spec/models/domain/itinerary_stop_spec.rb` — the scope and the join
- `spec/api/v1/itinerary_stops_endpoint_spec.rb` — the index, including an N+1 guard mirroring
  the existing hero-image test at `itineraries_endpoint_spec.rb:92`

**Metaphysics** (`../metaphysics`)

- `src/lib/loaders/loaders_with_authentication/gravity.ts` — the loader
- `src/schema/v2/itinerary/itineraryStop.ts` — `myItineraryStops` and `itineraryID`
- `src/schema/v2/itinerary/stopItems.ts` — stamp the parent's city onto each stop
- `src/schema/v2/itinerary/types.ts` — the stop's `itinerary_id`
- `src/schema/v2/itinerary/__tests__/myItineraryStops.test.ts`
- `_schemaV2.graphql` — regenerated

## Tasks

**1 — Gravity: the join and the scope.** `has_many :stops, through: :sections` and
`ItineraryStop.for_item`. Specs: the scope matches on type and id together, ignores a stop of
another type with the same id, and ignores a custom stop with no item. Commit.

**2 — Gravity: the index.** `GET /api/v1/itinerary_stops`, `permit :user`, scoped to the caller
and filterable by city or by item. Specs: every stop of mine with its `itinerary_id`; limited
to one city; limited to one item; nothing for an item I have not added; never another user's
stop, with or without a filter; 400 on half an item reference; 400 on an unknown `item_type`;
one query for the itinerary ids rather than one per stop. Commit.

**3 — Metaphysics: the loader and the field.** `myItineraryStops` and `itineraryID` on
`ItineraryStop`, the parent's city stamped on in `attachStopItemsToMany`, schema regenerated.
Tests: names the caller's own stop for the same entity; empty when not added; no match across
item types; empty for a custom stop; each stop of a guide matched to the caller's own;
identical loader params across a guide's stops; empty unauthenticated. Commit.

**4 — Two PRs**, one per repo, Metaphysics noting it depends on the Gravity deploy.

Each Gravity task ends with `bundle exec rspec <files>` and `bundle exec standardrb`, remembering
that Ruby 4.0.0 needs mise's bin on PATH in a non-interactive shell. Each Metaphysics task ends
with `yarn jest <files>` and `yarn type-check`.

## Afterwards, in eigen

Not part of this plan, but what it buys: a guide's stop rows ask `myItineraryStops` for their
own tick state, and `AddToItinerarySheet` stops fetching `sections { stops { ... } }` across
every itinerary to work it out — `itineraryStopTargets.ts`, the client-side matching, goes
away. That also removes one of the readers whose overlapping field sets corrupt Relay's
positional records, which is worth having while `id` is still missing from those two types.
