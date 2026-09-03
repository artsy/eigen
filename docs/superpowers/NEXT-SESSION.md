# Kickoff prompt for the next session

Copy everything below the line into a fresh Claude Code session started from
`/Users/mounirdhahri/work/eigen`.

---

Read `docs/superpowers/HANDOVER.md` first — it has the full state of the City Guide work,
the decisions already made, and the repo conventions that bit us last time. Don't
rediscover them.

We're starting the next chunk of the City Guide. I want this one done properly: **a full
spec that we build together first, then an implementation plan, and I want to review both
over several rounds before any code is written.** Don't jump to implementation.

## Scope

Two things, and I want them designed as one piece of work because they overlap:

1. **The event sections on the City Guide home** — "Current Fairs", "Current Shows", and a
   new "Opening Soon". Today `src/app/Scenes/CityGuide/Components/CityGuideEvents.tsx`
   renders these as stubs: a `SectionTitle` plus one row reading "N Fairs" with a
   `picsum.photos` image and the literal text "Date Placeholder". Their `onPress` handlers
   are empty. So these need real content, real navigation, and an "Opening Soon" grouping
   that doesn't exist yet.

2. **Saves** — a city-scoped saved list, "Add Full List" bulk-follow, and save/follow
   polish. The research is already in HANDOVER.md under "Saves sub-project"; read it,
   because one finding matters a lot: named lists cannot hold shows or galleries today
   (Gravity's `Collection` is `has_many :collected_artworks`), so that part is backend
   work. There's also an open question in there I never answered — ask me about it.

## How I want you to work

- Start with `superpowers:brainstorming`. Ask me questions one at a time. Don't write a
  spec until we've talked it through.
- Flag it early if this is really two specs rather than one.
- Ground design decisions in the actual backend. `../metaphysics` and `../gravity` are
  checked out as siblings and can be read directly — that's how we settled the last spec's
  hardest question.
- Designs are in Figma file `HMwmWnpQClcGnwTOcYdyKx` (Fireworks City Guide). Ask me for
  specific frame links; the file's node structure is not readable from the top.
- Reuse existing components and patterns over matching Figma exactly.
- Anything needing an API that doesn't exist: draft the data shape, use static mock data,
  and we'll design the real API together later.

## Branch

The previous work is on `city-guide-itineraries-docs`, open as draft PR #13992. There's an
empty `city-guide-saves` branched off it that **needs rebasing** before use — it was cut
before that branch was rebased onto main. Ask me whether to stack on it or start fresh.
