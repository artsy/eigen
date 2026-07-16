import AsyncStorage from "@react-native-async-storage/async-storage"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkArtistGame } from "app/Scenes/ArtworkArtistGame/ArtworkArtistGame"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// Stub the Relay-backed play screen so we can drive the game flow deterministically.
jest.mock("app/Scenes/ArtworkArtistGame/Components/ArtworkArtistGamePlay", () => ({
  ArtworkArtistGamePlayQueryRenderer: ({
    onFinish,
  }: {
    onFinish: (result: { correctCount: number; total: number }) => void
  }) => {
    const { Text } = require("@artsy/palette-mobile")
    return <Text onPress={() => onFinish({ correctCount: 8, total: 10 })}>Finish Game</Text>
  },
}))

describe("ArtworkArtistGame", () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it("renders the start screen with a play button and empty history", async () => {
    renderWithWrappers(<ArtworkArtistGame />)

    expect(screen.getByText("Play")).toBeOnTheScreen()
    expect(await screen.findByText("No games played yet.")).toBeOnTheScreen()
  })

  it("plays a game, shows the score, and persists it to history", async () => {
    renderWithWrappers(<ArtworkArtistGame />)

    fireEvent.press(screen.getByText("Play"))
    fireEvent.press(await screen.findByText("Finish Game"))

    // Results screen
    expect(await screen.findByText("80%")).toBeOnTheScreen()
    expect(screen.getByText("You got 8 out of 10 right")).toBeOnTheScreen()

    // Back to start — the score is now in history
    fireEvent.press(screen.getByText("Back to start"))
    expect(await screen.findByText("80% (8/10)")).toBeOnTheScreen()
  })

  it("clears history", async () => {
    renderWithWrappers(<ArtworkArtistGame />)

    fireEvent.press(screen.getByText("Play"))
    fireEvent.press(await screen.findByText("Finish Game"))
    fireEvent.press(await screen.findByText("Back to start"))

    fireEvent.press(await screen.findByText("Clear"))

    expect(await screen.findByText("No games played yet.")).toBeOnTheScreen()
  })
})
