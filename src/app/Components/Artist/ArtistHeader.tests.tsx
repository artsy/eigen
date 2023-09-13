import { screen } from "@testing-library/react-native"
import { ArtistHeaderTestsQuery } from "__generated__/ArtistHeaderTestsQuery.graphql"
import { ArtistHeaderFragmentContainer } from "app/Components/Artist/ArtistHeader"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistHeader", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistHeaderTestsQuery>({
    Component: ({ artist, me }) => <ArtistHeaderFragmentContainer artist={artist!} me={me} />,
    query: graphql`
      query ArtistHeaderTestsQuery($artistID: String!, $artistIDAsID: ID!) @relay_test_operation {
        artist(id: $artistID) {
          ...ArtistHeader_artist
        }
        me {
          ...ArtistHeader_me @arguments(artistID: $artistIDAsID)
        }
      }
    `,
    variables: { artistID: "artist-id", artistIDAsID: "artist-id" },
  })

  it("displays the artwork count for an artist when present", () => {
    renderWithRelay({ Artist: () => mockArtist })

    expect(screen.queryByLabelText("Marcel cover image")).toBeOnTheScreen()
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
