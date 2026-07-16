import { useSaveArtworkToArtworkLists_artwork$key } from "__generated__/useSaveArtworkToArtworkLists_artwork.graphql"

export const ROUNDS_PER_GAME = 10
export const CHOICES_PER_ROUND = 4

export interface GameArtist {
  internalID: string
  name: string
}

export interface GameArtwork {
  internalID: string
  title: string | null | undefined
  href: string | null
  imageURL: string
  imageWidth: number | null | undefined
  imageHeight: number | null | undefined
  blurhash: string | null | undefined
  artist: GameArtist
  /** Relay fragment ref used to save the artwork. */
  saveArtworkRef: useSaveArtworkToArtworkLists_artwork$key
}

export interface GameRound {
  artwork: GameArtwork
  choices: GameArtist[]
  correctArtistID: string
}

/**
 * Optional shuffle applied to the distractor pool, keyed by a per-artwork seed,
 * so each round draws a different set of wrong answers. Defaults to identity
 * (deterministic) for easy testing.
 */
type SeededShuffle = (items: GameArtist[], seed: string) => GameArtist[]

/**
 * Builds up to ROUNDS_PER_GAME rounds. Each round pairs an artwork with
 * CHOICES_PER_ROUND artist choices: the correct artist plus distractors drawn
 * from `artistPool` (excluding the correct artist and duplicate names).
 *
 * The `correct` choice is always placed first — shuffle the final choice order
 * at render time (seeded by artwork id) so it is stable across re-renders.
 */
export const buildRounds = (
  artworks: GameArtwork[],
  artistPool: GameArtist[],
  shuffleWithSeed: SeededShuffle = (items) => items
): GameRound[] => {
  return artworks.reduce<GameRound[]>((rounds, artwork) => {
    // Stop once we have a full game — later artworks are only used as fallback
    // for any earlier ones that couldn't build a full set of choices.
    if (rounds.length >= ROUNDS_PER_GAME) return rounds

    const correct = artwork.artist

    const eligible = artistPool
      .filter(
        (artist) =>
          artist.internalID !== correct.internalID &&
          artist.name.toLowerCase() !== correct.name.toLowerCase()
      )
      // de-dupe distractor names so choices never repeat
      .filter(
        (artist, index, self) =>
          self.findIndex((a) => a.name.toLowerCase() === artist.name.toLowerCase()) === index
      )

    const distractors = shuffleWithSeed(eligible, artwork.internalID).slice(
      0,
      CHOICES_PER_ROUND - 1
    )

    // Skip artworks we can't build a full set of choices for.
    if (distractors.length < CHOICES_PER_ROUND - 1) {
      return rounds
    }

    rounds.push({
      artwork,
      choices: [correct, ...distractors],
      correctArtistID: correct.internalID,
    })

    return rounds
  }, [])
}
