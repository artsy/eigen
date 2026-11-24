import { screen } from "@testing-library/react-native"
import { ArtistAboutTestsQuery } from "__generated__/ArtistAboutTestsQuery.graphql"
import { ArtistAbout } from "app/Components/Artist/ArtistAbout/ArtistAbout"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistAbout", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistAboutTestsQuery>({
    Component: ({ artist }) => <ArtistAbout artist={artist!} />,
    query: graphql`
      query ArtistAboutTestsQuery($artistID: String!) @relay_test_operation {
        artist(id: $artistID) {
          ...ArtistAbout_artist
        }
      }
    `,
    variables: { artistID: "artist-id" },
  })

  it("renders the empty state", async () => {
    await renderWithRelay({
      Artist: () => ({
        hasArtistSeriesConnection: { totalCount: 0 },
        counts: { articles: 0, relatedArtists: 0 },
        insights: [],
      }),
      ArtistBlurb: () => ({
        text: null,
      }),
      ShowConnection: () => ({ totalCount: 0 }),
      GeneConnection: () => ({ edges: [] }),
    })

    expect(
      screen.getByText(/We'll update this page when more information is available/)
    ).toBeOnTheScreen()
  })

  describe("Biography", () => {
    it("is shown when the artist has metadata", async () => {
      await renderWithRelay({
        ArtistBlurb: () => {
          return {
            text: "a biography",
          }
        },
      })

      expect(screen.getByText("Biography")).toBeOnTheScreen()
      expect(screen.getByText(/a biography/)).toBeOnTheScreen()
    })

    it("is hidden when the artist has metadata", async () => {
      await renderWithRelay({
        ArtistBlurb: () => {
          return {
            text: "",
          }
        },
      })

      expect(screen.queryByText("Biography")).not.toBeOnTheScreen()
    })
  })

  describe("ArtistCareerHighlights", () => {
    it("is shown when there are insights", async () => {
      await renderWithRelay({
        Artist: () => {
          return { insights: [{ label: "Fancy pants", entities: ["A fancy museum"] }] }
        },
      })

      expect(screen.getByText("Highlights and Achievements")).toBeOnTheScreen()
      expect(screen.getByText("Fancy pants")).toBeOnTheScreen()
    })

    it("is hidden when there are no insights", async () => {
      await renderWithRelay({
        Artist: () => {
          return { insights: [] }
        },
      })

      expect(screen.queryByText("Highlights and Achievements")).not.toBeOnTheScreen()
    })
  })

  describe("ArtistAboutShows", () => {
    it("is rendered by default", async () => {
      await renderWithRelay({ Artist: () => ({ name: "Andy Warhol" }) })

      expect(screen.getByText("Shows Featuring Andy Warhol")).toBeOnTheScreen()
    })
  })

  describe("ArtistAboutEditorial", () => {
    it("renders editorial section", async () => {
      await renderWithRelay({
        Artist: () => ({ name: "Andy Warhol" }),
      })

      expect(screen.getByText("Artsy Editorial Featuring Andy Warhol")).toBeOnTheScreen()
    })

    it("does not render when there are no articles", async () => {
      await renderWithRelay({
        Artist: () => ({
          counts: { articles: 0 },
        }),
      })

      expect(screen.queryByText(/Artsy Editorial Featuring/)).not.toBeOnTheScreen()
    })
  })
})
