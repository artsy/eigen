import { screen } from "@testing-library/react-native"
import { ArtistHeaderTestsQuery } from "__generated__/ArtistHeaderTestsQuery.graphql"
import { ArtistHeaderFragmentContainer } from "app/Components/Artist/ArtistHeader"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistHeader", () => {
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
    renderWithRelay({
      Artist() {
        return mockArtist
      },
    })

    expect(screen.queryByLabelText("Marcel cover image")).toBeOnTheScreen()
  })
  describe("alerts set", () => {
    it("displays the numbers of alerts if the user has alerts for an artist", () => {
      renderWithRelay({
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

      expect(screen.queryByText("2 Alerts Set")).toBeOnTheScreen()
    })

    it("hides the numbers of alerts if the user has no alerts for an artist", () => {
      renderWithRelay({
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

      expect(screen.queryByText("2 Alerts Set")).not.toBeOnTheScreen()
    })
  })
})

const mockArtist = {
  internalID: "some-id",
  id: "marcel-duchamp",
  name: "Marcel",
  nationality: "French",
  birthday: "11/17/1992",
  counts: {
    artworks: 22,
  },
}
