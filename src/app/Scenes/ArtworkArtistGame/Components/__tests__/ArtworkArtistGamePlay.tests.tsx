import { act, fireEvent, screen } from "@testing-library/react-native"
import {
  ArtworkArtistGamePlayQueryRenderer,
  GamePlay,
  REVEAL_DELAY,
} from "app/Scenes/ArtworkArtistGame/Components/ArtworkArtistGamePlay"
import { GameArtwork, GameRound } from "app/Scenes/ArtworkArtistGame/utils/buildRounds"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

// The artwork image (with its save mutation + gesture) is covered by its own test.
jest.mock("app/Scenes/ArtworkArtistGame/Components/GameArtworkImage", () => ({
  GameArtworkImage: () => {
    const { Text } = require("@artsy/palette-mobile")
    return <Text>Artwork Image</Text>
  },
}))

const buildArtwork = (id: string): GameArtwork => ({
  internalID: id,
  title: `Artwork ${id}`,
  href: `/artwork/${id}`,
  imageURL: `https://example.com/${id}.jpg`,
  imageWidth: 800,
  imageHeight: 600,
  blurhash: null,
  artist: { internalID: `${id}-correct`, name: `Correct ${id}` },
  saveArtworkRef: {} as GameArtwork["saveArtworkRef"],
})

const round = (id: string): GameRound => ({
  artwork: buildArtwork(id),
  correctArtistID: `${id}-correct`,
  choices: [
    { internalID: `${id}-correct`, name: `Correct ${id}` },
    { internalID: `${id}-w1`, name: `Wrong ${id} A` },
    { internalID: `${id}-w2`, name: `Wrong ${id} B` },
    { internalID: `${id}-w3`, name: `Wrong ${id} C` },
  ],
})

describe("GamePlay", () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it("shows the current round and reports progress", () => {
    const onProgress = jest.fn()
    renderWithWrappers(
      <GamePlay
        rounds={[round("aw1"), round("aw2")]}
        onFinish={jest.fn()}
        onProgress={onProgress}
      />
    )

    expect(screen.getByText("Correct aw1")).toBeOnTheScreen()
    expect(screen.getByText("Wrong aw1 A")).toBeOnTheScreen()
    expect(onProgress).toHaveBeenCalledWith(1, 2)
  })

  it("scores correct answers and finishes after the last round", () => {
    const onFinish = jest.fn()
    const onProgress = jest.fn()
    renderWithWrappers(
      <GamePlay rounds={[round("aw1"), round("aw2")]} onFinish={onFinish} onProgress={onProgress} />
    )

    // Round 1: pick the correct answer
    fireEvent.press(screen.getByText("Correct aw1"))
    act(() => jest.advanceTimersByTime(REVEAL_DELAY))

    // Round 2: pick a wrong answer
    expect(onProgress).toHaveBeenLastCalledWith(2, 2)
    fireEvent.press(screen.getByText("Wrong aw2 A"))
    act(() => jest.advanceTimersByTime(REVEAL_DELAY))

    expect(onFinish).toHaveBeenCalledWith({ correctCount: 1, total: 2 })
  })

  it("ignores taps after an answer is locked in", () => {
    const onFinish = jest.fn()
    renderWithWrappers(
      <GamePlay rounds={[round("aw1")]} onFinish={onFinish} onProgress={jest.fn()} />
    )

    fireEvent.press(screen.getByText("Correct aw1"))
    // second tap on a wrong answer should be ignored
    fireEvent.press(screen.getByText("Wrong aw1 A"))
    act(() => jest.advanceTimersByTime(REVEAL_DELAY))

    expect(onFinish).toHaveBeenCalledWith({ correctCount: 1, total: 1 })
  })
})

describe("ArtworkArtistGamePlayQueryRenderer", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArtworkArtistGamePlayQueryRenderer,
  })

  const resolvers = {
    Query: () => ({
      // 15 fully-specified artworks so buildRounds can make the 10 required rounds.
      discoverArtworks: {
        edges: Array.from({ length: 15 }, (_, i) => ({
          node: {
            internalID: `aw-${i}`,
            image: { url: `https://example.com/${i}.jpg`, width: 800, height: 600, blurhash: null },
            artists: [{ internalID: "correct-artist", name: "The Correct Artist" }],
          },
        })),
      },
      highlights: {
        popularArtists: [
          { internalID: "p1", name: "Distractor One" },
          { internalID: "p2", name: "Distractor Two" },
          { internalID: "p3", name: "Distractor Three" },
          { internalID: "p4", name: "Distractor Four" },
        ],
      },
    }),
  }

  it("renders the first round's choices from fetched data", async () => {
    renderWithRelay(resolvers, { onFinish: jest.fn() })

    // The QueryRenderer suspends; flush the boundary so the resolved content renders.
    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByText("The Correct Artist")).toBeOnTheScreen()
    expect(screen.getByText("Artwork Image")).toBeOnTheScreen()
  })
})
