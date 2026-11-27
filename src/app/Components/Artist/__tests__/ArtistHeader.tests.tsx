import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistHeaderStoryOffTestsQuery } from "__generated__/ArtistHeaderStoryOffTestsQuery.graphql"
import { ArtistHeaderTestsQuery } from "__generated__/ArtistHeaderTestsQuery.graphql"
import { ArtistHeader } from "app/Components/Artist/ArtistHeader"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistHeader", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const headerImage = {
    altText: "The artist in her studio",
    image: { url: "https://example.com/header.jpg" },
  }

  describe("with AREnableArtistStory off", () => {
    const { renderWithRelay } = setupTestWrapper<ArtistHeaderStoryOffTestsQuery>({
      Component: ({ artist }) => <ArtistHeader artist={artist!} />,
      query: graphql`
        query ArtistHeaderStoryOffTestsQuery($artistID: String!) @relay_test_operation {
          artist(id: $artistID) {
            ...ArtistHeader_artist @arguments(enableArtistStory: false)
          }
        }
      `,
    })

    it("shows the cover artwork, ignoring the Story and Vanguard year", async () => {
      await renderWithRelay({
        Artist: () => ({ ...mockArtist, featuredStory: { headerImage }, vanguardYear: "2027" }),
      })

      expect(screen.getByLabelText("Marcel cover image")).toBeOnTheScreen()
      expect(screen.queryByLabelText("The artist in her studio")).not.toBeOnTheScreen()
      expect(screen.queryByText("2027 Vanguard Artist")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("artist-header-gradient")).not.toBeOnTheScreen()
    })

    it("navigates to a verified representative and tracks the tap", async () => {
      const partner = {
        internalID: "representative-id",
        name: "Test representative",
        href: "representative-href",
        profile: { icon: { url: "image-url" } },
      }
      await renderWithRelay({
        Artist: () => ({ ...mockArtist, verifiedRepresentatives: [{ partner }] }),
      })

      await fireEvent.press(screen.getByText("Test representative"))

      expect(navigate).toHaveBeenCalledWith("representative-href")
      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedVerifiedRepresentative",
            "context_module": "artistHeader",
            "context_screen_owner_id": "some-id",
            "context_screen_owner_type": "artist",
            "destination_screen_owner_id": "representative-id",
            "destination_screen_owner_type": "partner",
          },
        ]
      `)
    })
  })

  describe("with AREnableArtistStory on", () => {
    const { renderWithRelay } = setupTestWrapper<ArtistHeaderTestsQuery>({
      Component: ({ artist }) => <ArtistHeader artist={artist!} />,
      query: graphql`
        query ArtistHeaderTestsQuery($artistID: String!) @relay_test_operation {
          artist(id: $artistID) {
            ...ArtistHeader_artist @arguments(enableArtistStory: true)
          }
        }
      `,
    })

    it("shows the Story's Header Image with the gradient in place of the cover artwork", async () => {
      await renderWithRelay({ Artist: () => ({ ...mockArtist, featuredStory: { headerImage } }) })

      expect(screen.getByLabelText("The artist in her studio")).toBeOnTheScreen()
      expect(screen.queryByLabelText("Marcel cover image")).not.toBeOnTheScreen()
      expect(screen.getByTestId("artist-header-gradient")).toBeOnTheScreen()
    })

    it("keeps the plain cover artwork when the Story has no Header Image", async () => {
      await renderWithRelay({
        Artist: () => ({ ...mockArtist, featuredStory: { headerImage: null } }),
      })

      expect(screen.getByLabelText("Marcel cover image")).toBeOnTheScreen()
      expect(screen.queryByTestId("artist-header-gradient")).not.toBeOnTheScreen()
    })

    it("keeps the cover artwork when the Header Image has no url", async () => {
      await renderWithRelay({
        Artist: () => ({
          ...mockArtist,
          featuredStory: { headerImage: { ...headerImage, image: { url: null } } },
        }),
      })

      expect(screen.getByLabelText("Marcel cover image")).toBeOnTheScreen()
      expect(screen.queryByLabelText("The artist in her studio")).not.toBeOnTheScreen()
    })

    it("leaves the badge out for other artists", async () => {
      await renderWithRelay({ Artist: () => ({ ...mockArtist, featuredStory: { headerImage } }) })

      expect(screen.queryByText(/Vanguard Artist/)).not.toBeOnTheScreen()
    })

    it("opens the Vanguard article from the badge and tracks the tap", async () => {
      await renderWithRelay({
        Artist: () => ({
          ...mockArtist,
          vanguardYear: "2027",
          vanguardArticle: {
            href: "/article/vanguard-article-slug",
            slug: "vanguard-article-slug",
          },
        }),
      })

      await fireEvent.press(screen.getByText("2027 Vanguard Artist"))

      expect(navigate).toHaveBeenCalledWith("/article/vanguard-article-slug")
      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "clickedVanguardBadge",
            "context_module": "artistVanguardBadge",
            "context_page_owner_id": "some-id",
            "context_page_owner_slug": "marcel-duchamp",
            "context_page_owner_type": "artist",
            "destination_page_owner_slug": "vanguard-article-slug",
            "destination_page_owner_type": "article",
          },
        ]
      `)
    })

    it("leaves the badge unlinked without a Vanguard article", async () => {
      await renderWithRelay({
        Artist: () => ({ ...mockArtist, vanguardYear: "2027", vanguardArticle: null }),
      })

      await fireEvent.press(screen.getByText("2027 Vanguard Artist"))

      expect(navigate).not.toHaveBeenCalled()
      expect(mockTrackEvent).not.toHaveBeenCalled()
    })

    it("shows the Vanguard badge over a gradient on the cover artwork", async () => {
      await renderWithRelay({ Artist: () => ({ ...mockArtist, vanguardYear: "2027" }) })

      expect(screen.getByText("2027 Vanguard Artist")).toBeOnTheScreen()
      expect(screen.getByTestId("artist-header-gradient")).toBeOnTheScreen()
    })
  })
})

const mockArtist = {
  featuredStory: null,
  vanguardYear: null,
  vanguardArticle: null,
  internalID: "some-id",
  slug: "marcel-duchamp",
  name: "Marcel",
}
