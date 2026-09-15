# Telling whether a stop is already on an itinerary

**Goal:** One API call that answers "which of my itineraries hold this entity, and which stop
is it in each" — so the Add to Itinerary sheet can tick the right rows and remove the right
stop, without fetching every itinerary's every stop.

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
GET /api/v1/itinerary_stops?item_type=PartnerShow&item_id=<id>
```

Returns **the caller's own** stops pointing at that item, one per itinerary that holds it, each
serialized with its `itinerary_id`. `permit :user`; never another user's stops — whether
someone else has a show on a private itinerary is not a public fact.

- `has_many :stops, through: :sections` on `Itinerary`, and the matching
  `ItineraryStop.for_item(item_type, item_id)` scope. Neither exists.
- The endpoint scopes to `Itinerary.where(user_id: current_user.id.to_s)` through the join, so
  authorization is the query rather than a per-row check.
- `item_type` and `item_id` are mutually inclusive, and `item_type` takes
  `ItineraryStop::ITEM_TYPES`, so a typo is a 400 rather than an empty list.
- A new `:with_itinerary` json_properties level adds `itinerary_id`. Not added to the default
  level: `itinerary_id` lives on the section, so every existing stop listing would gain a query
  per stop. The endpoint preloads `itinerary_section`, making it one extra query total.

Why an index rather than a filter on `GET /itineraries`: the client needs the **stop id** to
remove it, and the itineraries index serializes at `:short`, which omits sections. Filtering
that index would say which itineraries match but not which stop to delete, so the client would
need a second call anyway.

### Metaphysics: `Itinerary.stopForItem`

```graphql
me {
  itinerariesConnection(citySlug: "london-united-kingdom", first: 20) {
    edges { node {
      internalID
      title
      stopsCount
      stopForItem(itemType: SHOW, itemID: "5f2a...") { internalID }
    } }
  }
}
```

- `itineraryStopsLoader: gravityLoader("itinerary_stops")`, authenticated, beside the existing
  itinerary loaders.
- `stopForItem(itemType: ItineraryStopItemType!, itemID: String!): ItineraryStop`. The enum is
  the one that already exists, so a caller writes `SHOW` and Gravity receives `PartnerShow`.
- The resolver calls the loader with `{ item_type, item_id }`. Twenty itineraries in one query
  means one HTTP call, not twenty: the dataloader keys on path plus params, so every node with
  the same arguments shares it. Then it picks the stop whose `itinerary_id` matches the node.

`stopForItem` rather than a boolean, because the client needs the id to delete the stop and a
boolean would force a second round trip to find it. It answers both questions:
non-null is the tick.

## Why not the alternatives

**`Show.isOnMyItinerary`.** Reads better on a card, but a rail of twenty shows would ask
twenty times, and each answer needs the user's itineraries — so it wants a batch endpoint
keyed by item, which is a different Gravity shape. Worth having later for the rails; it is not
what the sheet needs, and the sheet is what exists.

**A membership filter on `Me.itinerariesConnection`.** Returns the matching itineraries but not
the stop ids, and the sheet has to show every itinerary anyway — ticked or not — so filtering
is the wrong operation.

## Files

**Gravity** (`../gravity`)

- `app/models/domain/itinerary.rb` — `has_many :stops, through: :sections`
- `app/models/domain/itinerary_stop.rb` — `for_item` scope, `:with_itinerary` properties level
- `app/api/v1/itinerary_stops_endpoint.rb` — the index
- `spec/models/domain/itinerary_stop_spec.rb` — scope and serialization
- `spec/api/v1/itinerary_stops_endpoint_spec.rb` — the index, including an N+1 guard mirroring
  the existing hero-image test at `itineraries_endpoint_spec.rb:92`

**Metaphysics** (`../metaphysics`)

- `src/lib/loaders/loaders_with_authentication/gravity.ts` — the loader
- `src/schema/v2/itinerary/itinerary.ts` — `stopForItem`
- `src/schema/v2/itinerary/types.ts` — the stop's `itinerary_id`
- `src/schema/v2/itinerary/__tests__/itinerary.test.ts` (or a new file) — resolves the stop,
  resolves null, and one loader call for many itineraries
- `_schemaV2.graphql` — regenerated

## Tasks

**1 — Gravity: the join and the scope.** `has_many :stops, through: :sections` and
`ItineraryStop.for_item`. Specs: the scope matches on type and id together, ignores a stop of
another type with the same id, and ignores a custom stop with no item. Commit.

**2 — Gravity: the index.** `GET /api/v1/itinerary_stops`, `permit :user`, filtered and scoped
to the caller. Specs: returns my stop for the item with its `itinerary_id`; returns nothing for
an item I have not added; never another user's stop even when they have it; 400 on `item_id`
without `item_type`; 400 on an unknown `item_type`; one query for the itinerary ids rather than
one per stop. Commit.

**3 — Metaphysics: the loader and the field.** `stopForItem` on `Itinerary`, regenerate the
schema. Tests: resolves the stop for an itinerary holding the item; resolves null for one that
does not; twenty itineraries in a query hit the loader once. Commit.

**4 — Two PRs**, one per repo, Metaphysics noting it depends on the Gravity deploy.

Each Gravity task ends with `bundle exec rspec <files>` and `bundle exec standardrb`, remembering
that Ruby 4.0.0 needs mise's bin on PATH in a non-interactive shell. Each Metaphysics task ends
with `yarn jest <files>` and `yarn type-check`.

## Afterwards, in eigen

Not part of this plan, but what it buys: `AddToItinerarySheet`'s query drops
`sections { stops { ... } }` entirely and asks each node for `stopForItem` instead, and
`itineraryStopTargets.ts` — the client-side matching — goes away. That also removes one of the
readers whose overlapping field sets corrupt Relay's positional records, which is worth having
on its own while `id` is still missing from those two types.
