import { screen } from "@testing-library/react-native"
import { ArtistAboutTestsQuery } from "__generated__/ArtistAboutTestsQuery.graphql"
import { ArtistAboutContainer } from "app/Components/Artist/ArtistAbout/ArtistAbout"
import { ArtistAboutShowsFragmentContainer } from "app/Components/Artist/ArtistAbout/ArtistAboutShows"
import { Biography } from "app/Components/Artist/Biography"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistAbout", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistAboutTestsQuery>({
    Component: ({ artist }) => <ArtistAboutContainer artist={artist!} />,
    query: graphql`
      query ArtistAboutTestsQuery($artistID: String!) @relay_test_operation {
        artist(id: $artistID) {
          ...ArtistAbout_artist
        }
      }
    `,
    variables: { artistID: "artist-id" },
  })

  it("renders the empty state", () => {
    renderWithRelay({
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
    it("is shown when the artist has metadata", () => {
      renderWithRelay({
        ArtistBlurb: () => {
          return {
            text: "a biography",
          }
        },
      })

      expect(screen.UNSAFE_queryAllByType(Biography)).toHaveLength(1)
    })

    it("is hidden when the artist has metadata", () => {
      renderWithRelay({
        ArtistBlurb: () => {
          return {
            text: "",
          }
        },
      })

      expect(screen.UNSAFE_queryAllByType(Biography)).toHaveLength(0)
    })
  })

  describe("ArtistAboutShows", () => {
    it("is rendered by default", () => {
      renderWithRelay()

      expect(screen.UNSAFE_queryByType(ArtistAboutShowsFragmentContainer)).toBeTruthy()
    })
  })

  describe("ArtistAboutEditorial", () => {
    it("renders editorial section", () => {
      renderWithRelay({
        Artist: () => ({ name: "Andy Warhol" }),
      })

      expect(screen.getByText("Artsy Editorial Featuring Andy Warhol")).toBeOnTheScreen()
    })

    it("does not render when there are no articles", () => {
      renderWithRelay({
        Artist: () => ({
          counts: { articles: 0 },
        }),
      })

      expect(screen.queryByText(/Artsy Editorial Featuring/)).not.toBeOnTheScreen()
    })
  })
})
