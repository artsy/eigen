# City Guide — handover

**Written:** 2026-08-27. Supersede or delete this once the work lands.

## Where things stand

|                |                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Branch         | `city-guide-itineraries-docs` (pushed, rebased onto `main`)                                    |
| PR             | [#13992](https://github.com/artsy/eigen/pull/13992), **draft**, → `main`                       |
| Stacked branch | `city-guide-saves` — created, empty, **branched from the pre-rebase tip so it needs rebasing** |
| Working tree   | clean, nothing unpushed                                                                        |

CI was green except `ci/circleci: test-js`, which was still running when the session
ended. Worth a glance: the full Jest suite never runs locally here (see Conventions), so
that job is the only thing that would catch a break elsewhere in the app.

## What the itinerary feature does

Read-only curated city itineraries in the City Guide. Sub-project 1 of 5; browse,
saving, city picker and map each follow separately.

Everything lives in `src/app/Scenes/CityGuide/Screens/Itinerary/`, plus two extractions
(`app/utils/mutations/useFollowShow.ts`, `app/utils/mapbox.ts`).

- List view: hero header, collapsible sections, numbered stops
- Tapping a stop opens a bottom-sheet preview with Save and "Show on map"
- Map view: numbered pins, per-section filter pills, fit-to-bounds, clustering for
  co-located stops, tappable pins with a preview card
- Route line between stops, behind `AREnableCityGuideItineraryRoute`
- Saving works for real, against real entities

**The load-bearing idea:** the itinerary _structure_ is mock, but each stop's _entity_ is
real. A stop stores a slug; the screen resolves it through Relay. So saving fires the
same `followShow` / `followProfile` mutation as everywhere else and genuinely persists.

## Decisions that are expensive to revisit

These came out of three review rounds. The reasoning is in
`docs/superpowers/reviews/` and the spec.

- **Section titles are opaque strings with a separate `id`.** The designs group by day in
  one frame and by time of day in another. The client renders whatever titles it gets.
  Identity is `id`, never the title — two sections may legitimately share a title.
- **Stop numbers are derived, never stored.** The list numbers continuously across
  sections; the map renumbers from 1 within a filtered section. Both come from position
  in a flattened list, so they cannot disagree.
- **`category` is editorial**, authored with the stop, because a museum and a gallery are
  both Partners and the save target cannot tell them apart.
- **One Relay query per stop.** Slugs cannot be batched: `showsConnection(ids:)` reaches
  Gravity's `shows.in(_id:)`, which matches BSON ids only and returns them unordered.
  Each query sits behind its own Suspense and error boundary. This disappears when the
  API returns entities inline.

## Still to do on itineraries

- [ ] Test on Android; add screenshots to the PR
- [ ] "Add Full List" bulk-follow from the design
- [ ] Track gallery follows — `GalleryFollow` / `GalleryUnfollow` exist at
      `utils/track/schema.ts:280-281` and the partner branch ignores them
- [ ] Move `ShowFollowButton` and `Components/Lists/ShowItemRow` onto `useFollowShow`
- [ ] Replace mock itineraries with the real API
- [ ] Decide whether `/city-guide` needs a flag — it is deep-link reachable today
- [ ] Run the final whole-branch review (never happened)
- [ ] Decide whether `docs/superpowers/` belongs in the PR (6,232 of its 8,533 lines)

## Saves sub-project — research done, nothing built

The user wants four things. They are independent, and one dominates.

|                                   | Size      | Blocked on            |
| --------------------------------- | --------- | --------------------- |
| City saved list screen            | Small     | —                     |
| Named collections ("Frieze week") | **Large** | Gravity + Metaphysics |
| "Add Full List" bulk-follow       | Small     | —                     |
| Save/follow polish                | Small     | —                     |

Findings worth not rediscovering:

- **Named lists cannot hold shows, galleries or fairs.** Gravity's model is
  `class Collection ... has_many :collected_artworks` (`app/models/domain/collection.rb:4`),
  and Metaphysics exposes only `artworksConnection` / `artworksCount`
  (`me/collection.ts:25,81`). This is backend work, not client work. For scale, the
  existing ArtworkLists feature is ~2,600 lines across ~30 files.
- **`CitySavedList` already exists and is unreachable.** Routed at `/city-save/:citySlug`
  (`routes.tsx:814-816`), queries `showsConnection(city:)` with pagination. Its only entry
  point is `CityGuideSavedEventSection`, which no live screen renders.
- **Only `showsConnection` takes a `city` argument.** Galleries, fairs and artists have no
  city filter, so a city-scoped saved list can show saved shows natively and needs client
  filtering or new backend args for anything else.
- **Sequencing risk:** named lists change what "save" _means_. Build the city saved list
  and bulk-follow on a flat model first and you may rebuild them after.

An open question was put to the user and not answered: whether named lists are a real
commitment, exploratory, or client-only mock for now.

## Conventions learned the hard way

- **Never run the full Jest suite, and never `--findRelatedTests`.** Both are unreliable
  here — one `--findRelatedTests` run sat for eight minutes before being killed. Name test
  files explicitly. The plan's Global Constraints say this too.
- **`lint-staged` reformats and amends each commit after you make it**, so the SHA you
  push and the SHA you keep differ. Pushing then needs `--force-with-lease`. Verify the
  remote-only commit is a content-identical twin first: `git diff <remote> <local> --stat`
  should be empty.
- **Mapbox's `MapView` mocks to `() => null`** (`src/setupJest.tsx:295-304`), so pins,
  camera and overlays never mount under Jest and cannot be asserted on. Every map bug in
  this work surfaced in the simulator, not in tests. Pure functions carry that coverage —
  put map logic in `utils/itineraryStopsToGeoJSON.ts` where it can be tested.
- **Data-driven tests, not hardcoded counts.** Asserting "8 stops" broke three times as
  the mock grew, each a false alarm. Derive totals from the data and assert the shape.
- **`@artsy/icons` maps `./*` to `dist/web`**, so `import X from "@artsy/icons/XIcon"`
  pulls the DOM build. Use the named native export: `import { X } from "@artsy/icons/native"`.
- Agent-created PRs need an `Assisted-by:` trailer (Artsy convention, enforced by a hook).

## Corrections made to earlier claims

Recorded because they were stated confidently and were wrong.

- Gallery-follow tracking **does** exist (`GalleryFollow`/`GalleryUnfollow`). An earlier
  sub-agent said it did not, and that was repeated in the spec before being caught.
- `CityGuideEvent`'s optimistic update was **fully** broken, not partly: the updater wrote
  the `is_followed` alias key that Relay never reads, _and_ the optimistic response omitted
  `id`, so it could not merge either. The `useFollowShow` migration fixes both.
