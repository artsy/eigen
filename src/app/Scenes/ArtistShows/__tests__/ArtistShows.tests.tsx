import { Text } from "@artsy/palette-mobile"
import { ArtistShowsTestsQuery } from "__generated__/ArtistShowsTestsQuery.graphql"
import { ArtistShow } from "app/Components/Artist/ArtistShows/ArtistShow"
import { ArtistShowsPaginationContainer } from "app/Scenes/ArtistShows/ArtistShows"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { FlatList } from "react-native"
import { graphql } from "react-relay"

describe("ArtistShows", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistShowsTestsQuery>({
    Component: (props) => <ArtistShowsPaginationContainer artist={props.artist!} />,
    query: graphql`
      query ArtistShowsTestsQuery($artistID: String!) @relay_test_operation {
        artist(id: $artistID) {
          slug
          ...ArtistShows_artist
        }
      }
    `,
  })

  it("Renders artist name", () => {
    const tree = renderWithRelay({
      Artist: () => ({
        name: "Andy Warhol",
      }),
    })

    expect(extractText(tree.UNSAFE_getAllByType(Text)[0])).toEqual("Andy Warhol")
    expect(extractText(tree.UNSAFE_getAllByType(Text)[1])).toEqual("Past Shows")
  })

  it("Renders list of shows", () => {
    const tree = renderWithRelay({
      // ShowsConnection is named as ShowConnection
      ShowConnection: () => ({
        edges: [{ node: { id: "show1" } }, { node: { id: "show2" } }, { node: { id: "show3" } }],
      }),
    })

    expect(tree.UNSAFE_getAllByType(FlatList).length).toEqual(1)
    expect(tree.UNSAFE_getAllByType(ArtistShow).length).toEqual(3)
  })
})
