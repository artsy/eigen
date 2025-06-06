import { ArtworkHistory_artwork$data } from "__generated__/ArtworkHistory_artwork.graphql"
import { ArtworkHistory } from "app/Scenes/Artwork/Components/ArtworkHistory"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Artwork History", () => {
  it("renders everything correctly", () => {
    const artworkHistoryInfo: ArtworkHistory_artwork$data = {
      " $fragmentType": "ArtworkHistory_artwork",
      provenance: "vegas",
      exhibitionHistory: "this was in shows",
      literature: "bibliography",
    }

    const { queryByText } = renderWithWrappers(<ArtworkHistory artwork={artworkHistoryInfo} />)

    expect(queryByText("Provenance")).toBeTruthy()
    expect(queryByText("Exhibition history")).toBeTruthy()
    expect(queryByText("Bibliography")).toBeTruthy()
  })

  it("renders only set keys", () => {
    const artworkHistoryInfo: ArtworkHistory_artwork$data = {
      " $fragmentType": "ArtworkHistory_artwork",
      provenance: "vegas",
      exhibitionHistory: null,
      literature: "bibliography",
    }

    const { queryByText } = renderWithWrappers(<ArtworkHistory artwork={artworkHistoryInfo} />)

    expect(queryByText("Provenance")).toBeTruthy()
    expect(queryByText("Exhibition history")).toBeNull()
    expect(queryByText("Bibliography")).toBeTruthy()
  })

  it("doesn't render anything without data", () => {
    const artworkHistoryInfo: ArtworkHistory_artwork$data = {
      " $fragmentType": "ArtworkHistory_artwork",
      provenance: null,
      exhibitionHistory: null,
      literature: null,
    }

    const { toJSON, queryByText } = renderWithWrappers(
      <ArtworkHistory artwork={artworkHistoryInfo} />
    )

    expect(queryByText("Provenance")).toBeNull()
    expect(queryByText("Exhibition history")).toBeNull()
    expect(queryByText("Bibliography")).toBeNull()
    expect(toJSON()).toBeNull()
  })
})
