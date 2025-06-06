import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistCareerHighlightsTestsQuery } from "__generated__/ArtistCareerHighlightsTestsQuery.graphql"
import { ArtistCareerHighlights } from "app/Components/Artist/ArtistAbout/ArtistCareerHighlights"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistCareerHighlights", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistCareerHighlightsTestsQuery>({
    Component: (props) => <ArtistCareerHighlights artist={props.artist!} />,
    query: graphql`
      query ArtistCareerHighlightsTestsQuery @relay_test_operation {
        artist(id: "artist-id") {
          ...ArtistCareerHighlights_artist
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({ Artist: () => ({ insights: insights }) })

    expect(screen.getByText("Highlight 1")).toBeOnTheScreen()
    expect(screen.getByText("Highlight 2")).toBeOnTheScreen()
  })

  it("toggle works", () => {
    renderWithRelay({ Artist: () => ({ insights: insights }) })

    expect(screen.queryByText("AB, CD, and EF")).not.toBeOnTheScreen()
    expect(screen.queryByText("GH, IJ, and KL")).not.toBeOnTheScreen()

    fireEvent.press(screen.getByText("Highlight 1"))
    expect(screen.queryByText("AB, CD, and EF")).toBeOnTheScreen()
    expect(screen.queryByText("GH, IJ, and KL")).not.toBeOnTheScreen()

    fireEvent.press(screen.getByText("Highlight 2"))
    expect(screen.queryByText("AB, CD, and EF")).toBeOnTheScreen()
    expect(screen.queryByText("GH, IJ, and KL")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Highlight 1"))
    expect(screen.queryByText("AB, CD, and EF")).not.toBeOnTheScreen()
    expect(screen.queryByText("GH, IJ, and KL")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Highlight 2"))
    expect(screen.queryByText("AB, CD, and EF")).not.toBeOnTheScreen()
    expect(screen.queryByText("GH, IJ, and KL")).not.toBeOnTheScreen()
  })

  it("shows half of the insights if the insights length is greater than 4", () => {
    renderWithRelay({
      Artist: () => ({
        insights: ["1", "2", "3", "4", "5"].map((e) => ({ label: `element ${e}` })),
      }),
    })

    expect(screen.queryByText("element 1")).not.toBeOnTheScreen()
    expect(screen.queryByText("element 2")).not.toBeOnTheScreen()
    expect(screen.queryByText("element 3")).toBeOnTheScreen()
    expect(screen.queryByText("element 4")).toBeOnTheScreen()
    expect(screen.queryByText("element 5")).toBeOnTheScreen()
  })
})

const insights = [
  { entities: ["AB", "CD", "EF"], label: "Highlight 1" },
  { entities: ["GH", "IJ", "KL"], label: "Highlight 2" },
]
