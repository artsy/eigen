import { screen } from "@testing-library/react-native"
import { ArtworkHistory_artwork$data } from "__generated__/ArtworkHistory_artwork.graphql"
import { ArtworkHistory } from "app/Scenes/Artwork/Components/ArtworkHistory"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Artwork History", () => {
  it("renders everything correctly", async () => {
    const artworkHistoryInfo: ArtworkHistory_artwork$data = {
      " $fragmentType": "ArtworkHistory_artwork",
      provenance: "vegas",
      exhibitionHistory: "this was in shows",
      literature: "bibliography",
    }

    await renderWithWrappers(<ArtworkHistory artwork={artworkHistoryInfo} />)

    expect(screen.getByText("Provenance")).toBeOnTheScreen()
    expect(screen.getByText("Exhibition history")).toBeOnTheScreen()
    expect(screen.getByText("Bibliography")).toBeOnTheScreen()
  })

  it("renders only set keys", async () => {
    const artworkHistoryInfo: ArtworkHistory_artwork$data = {
      " $fragmentType": "ArtworkHistory_artwork",
      provenance: "vegas",
      exhibitionHistory: null,
      literature: "bibliography",
    }

    await renderWithWrappers(<ArtworkHistory artwork={artworkHistoryInfo} />)

    expect(screen.getByText("Provenance")).toBeOnTheScreen()
    expect(screen.queryByText("Exhibition history")).not.toBeOnTheScreen()
    expect(screen.getByText("Bibliography")).toBeOnTheScreen()
  })

  it("doesn't render anything without data", async () => {
    const artworkHistoryInfo: ArtworkHistory_artwork$data = {
      " $fragmentType": "ArtworkHistory_artwork",
      provenance: null,
      exhibitionHistory: null,
      literature: null,
    }

    const { toJSON } = await renderWithWrappers(<ArtworkHistory artwork={artworkHistoryInfo} />)

    expect(screen.queryByText("Provenance")).not.toBeOnTheScreen()
    expect(screen.queryByText("Exhibition history")).not.toBeOnTheScreen()
    expect(screen.queryByText("Bibliography")).not.toBeOnTheScreen()
    expect(toJSON()).toBeNull()
  })
})
