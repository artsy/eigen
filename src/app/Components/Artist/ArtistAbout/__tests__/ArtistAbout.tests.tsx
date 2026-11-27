import { screen } from "@testing-library/react-native"
import { ArtistAboutTestsQuery } from "__generated__/ArtistAboutTestsQuery.graphql"
import {
  ArtistAbout,
  ArtistAboutQueryRenderer,
} from "app/Components/Artist/ArtistAbout/ArtistAbout"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistAbout", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistAboutTestsQuery>({
    Component: ({ artist }) => <ArtistAbout artist={artist!} />,
    query: graphql`
      query ArtistAboutTestsQuery($artistID: String!) @relay_test_operation {
        artist(id: $artistID) {
          ...ArtistAbout_artist @arguments(enableArtistStory: true)
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

  describe("with AREnableArtistStory off", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtistStory: false })
    })

    it("shows the career highlights and none of the Story pieces", async () => {
      await renderWithRelay({
        Artist: () => ({
          featuredStory: { pullQuote: { text: "A quote", attribution: null } },
          insights: [{ kind: "AWARDS", label: "Prize One", entities: [] }],
        }),
      })

      expect(screen.getByText("Prize One")).toBeOnTheScreen()
      expect(screen.queryByText("“A quote”")).not.toBeOnTheScreen()
      expect(screen.queryByText("View CV")).not.toBeOnTheScreen()
      expect(screen.queryByText("Recognition")).not.toBeOnTheScreen()
    })

    it("hides the career highlights when there are no insights", async () => {
      await renderWithRelay({
        Artist: () => ({ insights: [] }),
      })

      expect(screen.queryByText("Highlights and Achievements")).not.toBeOnTheScreen()
    })
  })

  describe("with AREnableArtistStory on", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtistStory: true })
    })

    it("opens with the pull quote and the bio, without the Biography title", async () => {
      await renderWithRelay({
        Artist: () => ({
          featuredStory: { pullQuote: { text: " A quote ", attribution: "Artist Name, 2026" } },
        }),
        ArtistBlurb: () => ({ text: "a biography" }),
      })

      expect(screen.getByText("“A quote”")).toBeOnTheScreen()
      expect(screen.getByText("Artist Name, 2026")).toBeOnTheScreen()
      expect(screen.getByText(/a biography/)).toBeOnTheScreen()
      expect(screen.queryByText("Biography")).not.toBeOnTheScreen()
    })

    it("leaves the quote out when the artist has no Story", async () => {
      await renderWithRelay({
        Artist: () => ({ featuredStory: null }),
      })

      expect(screen.queryByText(/“/)).not.toBeOnTheScreen()
    })

    it("links to the CV when the artist has no bio and no Story", async () => {
      await renderWithRelay({
        Artist: () => ({
          featuredStory: null,
          hasArtistSeriesConnection: { totalCount: 0 },
          counts: { articles: 0, relatedArtists: 0 },
          insights: [],
        }),
        ArtistBlurb: () => ({ text: null }),
        ShowConnection: () => ({ totalCount: 0, edges: [] }),
        GeneConnection: () => ({ edges: [] }),
      })

      expect(screen.getByText("View CV")).toBeOnTheScreen()
    })

    it("shows the achievements in place of the career highlights, and keeps the running shows", async () => {
      await renderWithRelay({
        Artist: () => ({
          name: "Artist Name",
          insights: [{ kind: "AWARDS", label: "Prize One", entities: [] }],
        }),
      })

      expect(screen.getByText("Recognition")).toBeOnTheScreen()
      expect(screen.queryByText("Prize One")).not.toBeOnTheScreen()
      expect(screen.getByText("Shows Featuring Artist Name")).toBeOnTheScreen()
    })
  })

  describe("ArtistAboutQueryRenderer", () => {
    const requestedVariables = () =>
      getMockRelayEnvironment().mock.getMostRecentOperation().request.variables

    it("leaves the Story out of the query with AREnableArtistStory off", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtistStory: false })

      await renderWithWrappers(<ArtistAboutQueryRenderer artistID="artist-id" />)

      expect(requestedVariables()).toMatchObject({ enableArtistStory: false })
    })

    it("asks for the Story with AREnableArtistStory on", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtistStory: true })

      await renderWithWrappers(<ArtistAboutQueryRenderer artistID="artist-id" />)

      expect(requestedVariables()).toMatchObject({ enableArtistStory: true })
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
