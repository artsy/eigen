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
    expect(screen.getByText("AB, CD, and EF")).toBeOnTheScreen()
    expect(screen.queryByText("GH, IJ, and KL")).not.toBeOnTheScreen()

    fireEvent.press(screen.getByText("Highlight 2"))
    expect(screen.getByText("AB, CD, and EF")).toBeOnTheScreen()
    expect(screen.getByText("GH, IJ, and KL")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Highlight 1"))
    expect(screen.queryByText("AB, CD, and EF")).not.toBeOnTheScreen()
    expect(screen.getByText("GH, IJ, and KL")).toBeOnTheScreen()

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
    expect(screen.getByText("element 3")).toBeOnTheScreen()
    expect(screen.getByText("element 4")).toBeOnTheScreen()
    expect(screen.getByText("element 5")).toBeOnTheScreen()
  })

  describe("formatList function", () => {
    it("returns empty string for empty array", () => {
      renderWithRelay({
        Artist: () => ({
          insights: [{ entities: [], label: "Test", description: "fallback" }],
        }),
      })

      fireEvent.press(screen.getByText("Test"))
      expect(screen.getByText("fallback")).toBeOnTheScreen()
    })

    it("returns single item for array with one element", () => {
      renderWithRelay({
        Artist: () => ({
          insights: [{ entities: ["Single Item"], label: "Test", description: "fallback" }],
        }),
      })

      fireEvent.press(screen.getByText("Test"))
      expect(screen.getByText("Single Item")).toBeOnTheScreen()
    })

    it("formats two items with 'and'", () => {
      renderWithRelay({
        Artist: () => ({
          insights: [{ entities: ["First", "Second"], label: "Test", description: "fallback" }],
        }),
      })

      fireEvent.press(screen.getByText("Test"))
      expect(screen.getByText("First and Second")).toBeOnTheScreen()
    })

    it("formats multiple items with commas and 'and'", () => {
      renderWithRelay({
        Artist: () => ({
          insights: [
            { entities: ["First", "Second", "Third"], label: "Test", description: "fallback" },
          ],
        }),
      })

      fireEvent.press(screen.getByText("Test"))
      expect(screen.getByText("First, Second, and Third")).toBeOnTheScreen()
    })

    it("handles items with commas correctly", () => {
      renderWithRelay({
        Artist: () => ({
          insights: [
            {
              entities: [
                "Museum of Modern Art, New York",
                "Whitney Museum, New York",
                "Tate Modern, London",
              ],
              label: "Test",
              description: "fallback",
            },
          ],
        }),
      })

      fireEvent.press(screen.getByText("Test"))
      expect(
        screen.getByText(
          "Museum of Modern Art, New York, Whitney Museum, New York, and Tate Modern, London"
        )
      ).toBeOnTheScreen()
    })
  })
})

const insights = [
  { entities: ["AB", "CD", "EF"], label: "Highlight 1" },
  { entities: ["GH", "IJ", "KL"], label: "Highlight 2" },
]
