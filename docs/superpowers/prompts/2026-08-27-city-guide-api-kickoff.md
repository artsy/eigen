# Kickoff prompt — City Guide API sub-project

Open a new session **from `/Users/mounirdhahri/work/gravity`** and paste everything below the line.

---

We're starting the City Guide's backend work: giving it a real API in **Gravity** (this repo) and
**Metaphysics** (`../metaphysics`). The client already exists and is fully built against mock data,
so this is the piece that makes it real.

**Read these first, in this order.** They exist so you don't rediscover a day's worth of findings:

1. `../eigen/docs/superpowers/HANDOVER-city-guide-api.md` — written for you. Start here.
2. `../eigen/docs/superpowers/specs/2026-08-27-city-guide-events-and-saves-design.md` — the client
   design, including a "Backend grounding" section listing what does and does not exist today.
3. `../eigen/docs/superpowers/plans/2026-08-27-city-guide-events-and-saves.md` — if you need to see
   how the client actually consumes things.

## What we're building

Right now a user's "city itinerary" is not stored anywhere. It's a filtered view of their global
follows — `me.followsAndSaves.showsConnection(city:)` plus the city's fairs filtered on
`profile.isFollowed`. That shipped deliberately, to avoid blocking on backend work, and every
consequence was accepted knowingly: following a show anywhere adds it, unfollowing anywhere
removes it, an ended show disappears, and there is no ordering.

Your job is the model and the API that let the client stop conflating "saved" with "on my
itinerary".

## Three requirements that shape the data model

These arrived after the client was built. **Design for all three now**, even though today's UI only
exercises the first in its simplest form.

1. **More than one itinerary per person, per city.** The client currently assumes exactly one — the
   default — but that's a v1 simplification, not a product decision, and we expect multiple soon.
   So the schema is plural from the start: an itinerary is an entity with an owner and a city, not
   a singleton derived per user.
2. **Itineraries are shareable.** A user should be able to share one — either so the recipient can
   copy it into their own account, or as a link they just open. That implies a stable public
   identifier, a visibility concept, and "copy this itinerary to my account" as a real mutation.
   Think about what a recipient sees if the owner later edits or deletes it.
3. **Stop order is real data.** The UI doesn't show ordering today, but it matters: we want the
   option of numbered "go here, then here" lists later. So stops carry an explicit position,
   ordering is stable, and reordering is a mutation.

Note what 1 and 3 imply together: the same show can sit in two of one user's itineraries at
different positions, so membership is a join with its own attributes, not a set.

## How I want you to work

**Don't jump to implementation.** Start with `superpowers:brainstorming` and ask me questions one
at a time. I want to settle the data shape together before any code exists.

Ground every decision in the actual repos rather than assuming — that's how the client's hardest
questions got settled. Both `../metaphysics` and `../eigen` are readable from here.

Present the design and the eventual plan in **Plannotator**, not as terminal prose: write the
markdown, then `plannotator annotate <file> --gate`, and act on what comes back.

## Things worth knowing before you start

- **There is no `Itinerary` model in Gravity**, and `Collection` is the wrong thing to stretch:
  it's ActiveRecord with `has_many :collected_artworks`, and `CollectedArtwork` holds a plain
  `artwork_id` FK, not a polymorphic association. A show or a gallery cannot be a member.
- **A "city" is a 25km radius, not a boundary** — `LOCAL_DISCOVERY_RADIUS_KM = 25` in Metaphysics,
  sent to Gravity as `max_distance`. Gravity's own 75km default never applies.
- **Not every stop is an Artsy entity.** A curated itinerary can include a cafe or a plain address.
  The client models this as a nullable save target; the schema needs the same idea.
- **Slugs can't be batched.** `showsConnection(ids:)` reaches Gravity's `shows.in(_id:)`, which
  matches BSON ids only and returns them unordered. This is why the client fires one query per
  stop. If the API returns entities inline, that whole mechanism disappears — the single biggest
  client simplification available.
- Three fields the designs want that nothing stores: `Location.neighborhood`,
  `Show.isFreeAdmission`, and a city filter for followed galleries. The first is cheaper than it
  looks — Gravity's `CityGeocodingService` already receives a `neighborhood` from the geocoder and
  discards it.

The handover has the full list with file and line references.

## Practicalities

- Both repos are on `main`. Fresh branch in each.
- This will be **two PRs**, one per repo. Gravity first, since Metaphysics can only expose what
  Gravity stores.
- **Don't change the eigen client yet.** It works against the current view-over-follows model. We
  migrate it once the API shape is agreed, as its own piece of work.
- Follow each repo's own conventions for migrations, endpoints and tests. Read a comparable
  existing model and endpoint before writing a new one.

Start by reading the handover, then ask me your first question.
