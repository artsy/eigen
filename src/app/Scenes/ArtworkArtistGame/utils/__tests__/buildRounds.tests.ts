import {
  buildRounds,
  CHOICES_PER_ROUND,
  GameArtist,
  GameArtwork,
} from "app/Scenes/ArtworkArtistGame/utils/buildRounds"

const artist = (id: string, name: string): GameArtist => ({ internalID: id, name })

const artwork = (id: string, artistID: string, artistName: string): GameArtwork => ({
  internalID: id,
  title: `Artwork ${id}`,
  href: `/artwork/${id}`,
  imageURL: `https://example.com/${id}.jpg`,
  imageWidth: 800,
  imageHeight: 600,
  blurhash: null,
  artist: artist(artistID, artistName),
  saveArtworkRef: {} as GameArtwork["saveArtworkRef"],
})

const pool: GameArtist[] = [
  artist("p1", "Distractor One"),
  artist("p2", "Distractor Two"),
  artist("p3", "Distractor Three"),
  artist("p4", "Distractor Four"),
]

describe("buildRounds", () => {
  it("builds a round per artwork with the correct artist plus distractors", () => {
    const rounds = buildRounds([artwork("aw1", "c1", "Correct Artist")], pool)

    expect(rounds).toHaveLength(1)
    expect(rounds[0].correctArtistID).toBe("c1")
    expect(rounds[0].choices).toHaveLength(CHOICES_PER_ROUND)
    expect(rounds[0].choices.map((c) => c.internalID)).toContain("c1")
  })

  it("excludes the correct artist from the distractors", () => {
    const poolIncludingCorrect = [artist("c1", "Correct Artist"), ...pool]
    const rounds = buildRounds([artwork("aw1", "c1", "Correct Artist")], poolIncludingCorrect)

    const correctOccurrences = rounds[0].choices.filter((c) => c.internalID === "c1")
    expect(correctOccurrences).toHaveLength(1)
  })

  it("excludes distractors that share the correct artist's name", () => {
    const poolWithNameClash = [artist("other-id", "Correct Artist"), ...pool]
    const rounds = buildRounds([artwork("aw1", "c1", "Correct Artist")], poolWithNameClash)

    const names = rounds[0].choices.map((c) => c.name.toLowerCase())
    // "Correct Artist" should appear exactly once (the correct one)
    expect(names.filter((n) => n === "correct artist")).toHaveLength(1)
  })

  it("skips artworks without enough distractors to fill the choices", () => {
    const smallPool = [artist("p1", "Only One")]
    const rounds = buildRounds([artwork("aw1", "c1", "Correct Artist")], smallPool)

    expect(rounds).toHaveLength(0)
  })

  it("caps rounds at 10 even when given more artworks", () => {
    const manyArtworks = Array.from({ length: 15 }).map((_, i) =>
      artwork(`aw${i}`, `c${i}`, `Correct ${i}`)
    )
    const rounds = buildRounds(manyArtworks, pool)

    expect(rounds).toHaveLength(10)
  })

  it("falls back to later artworks when earlier ones lack enough distractors", () => {
    // With a pool of exactly CHOICES_PER_ROUND - 1 distractors, an artwork whose
    // correct artist shares a pool name drops the eligible count below the
    // threshold and is skipped — so a later artwork must fill the round instead.
    const tightPool = [artist("p1", "Distractor One"), artist("p2", "Two"), artist("p3", "Three")]
    const unbuildable = artwork("bad", "cbad", "Distractor One") // name clash → only 2 distractors left
    const buildable = Array.from({ length: 10 }).map((_, i) =>
      artwork(`aw${i}`, `c${i}`, `Correct ${i}`)
    )

    const rounds = buildRounds([unbuildable, ...buildable], tightPool)

    expect(rounds).toHaveLength(10)
    // the skipped artwork should not appear
    expect(rounds.map((r) => r.artwork.internalID)).not.toContain("bad")
  })

  it("uses the provided seeded shuffle to vary distractors per artwork", () => {
    const reversingShuffle = (items: GameArtist[]) => [...items].reverse()
    const rounds = buildRounds([artwork("aw1", "c1", "Correct Artist")], pool, reversingShuffle)

    // With the pool reversed, the first distractor should be the last pool entry.
    const distractors = rounds[0].choices.filter((c) => c.internalID !== "c1")
    expect(distractors[0].internalID).toBe("p4")
  })
})
