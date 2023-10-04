import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistHeaderTestsQuery } from "__generated__/ArtistHeaderTestsQuery.graphql"
import { ArtistHeaderFragmentContainer } from "app/Components/Artist/ArtistHeader"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

describe("ArtistHeader", () => {
  const tracking = useTracking().trackEvent
  const { renderWithRelay } = setupTestWrapper<ArtistHeaderTestsQuery>({
    Component: ({ artist, me }) => <ArtistHeaderFragmentContainer artist={artist!} me={me!} />,
    query: graphql`
      query ArtistHeaderTestsQuery($artistID: String!) @relay_test_operation {
        artist(id: $artistID) {
          ...ArtistHeader_artist
        }
        me {
          ...ArtistHeader_me @arguments(artistID: $artistID)
        }
      }
    `,
    variables: { artistID: "artist-id" },
  })

  it("displays the artwork count for an artist when present", () => {
    renderWithRelay({ Artist: () => mockArtist })

    expect(screen.queryByLabelText("Marcel cover image")).toBeOnTheScreen()
  })

  it("displays represented by list given verifiedRepresentatives", () => {
    renderWithRelay({
      Artist: () => ({
        ...mockArtist,
        verifiedRepresentatives: [
          {
            partner: {
              internalID: "representative-id",
              name: "Test representative",
              href: "representative-href",
              profile: { icon: { url: "image-url" } },
            },
          },
        ],
      }),
    })

    const representative = screen.getByText("Test representative")
    expect(representative).toBeOnTheScreen()

    fireEvent.press(representative)
    expect(navigate).toHaveBeenCalledWith("representative-href")
    expect(tracking).toHaveBeenCalledWith({
      action: "tappedVerifiedRepresentative",
      context_module: "artistHeader",
      context_screen_owner_type: "artist",
      context_screen_owner_id: mockArtist.internalID,
      context_screen_owner_slug: mockArtist.slug,
      destination_screen_owner_id: "representative-id",
      destination_screen_owner_type: "partner",
    })
  })

  describe("alerts set", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        ARShowArtistsAlertsSet: true,
      })
    })

    it("displays the numbers of alerts if the user has alerts for an artist", () => {
      const { getByText } = renderWithRelay({
        Artist() {
          return mockArtist
        },
        Me() {
          return {
            savedSearchesConnection: {
              totalCount: 2,
            },
          }
        },
      })

      expect(getByText("2 Alerts Set")).toBeDefined()
    })

    it("hides the numbers of alerts if the user has no alerts for an artist", () => {
      const { getByText } = renderWithRelay({
        Artist() {
          return mockArtist
        },
        Me() {
          return {
            savedSearchesConnection: {
              totalCount: 0,
            },
          }
        },
      })

      expect(() => getByText("2 Alerts Set")).toThrow()
    })
  })
})

const mockArtist = {
  internalID: "some-id",
  id: "marcel-duchamp",
  slug: "marcel-duchamp",
  name: "Marcel",
  nationality: "French",
  birthday: "11/17/1992",
  counts: {
    artworks: 22,
  },
}
