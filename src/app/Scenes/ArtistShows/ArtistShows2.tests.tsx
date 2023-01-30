import { ArtistShows2TestsQuery } from "__generated__/ArtistShows2TestsQuery.graphql"
import { ArtistShowFragmentContainer } from "app/Components/Artist/ArtistShows/ArtistShow"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Text } from "palette"
import { FlatList } from "react-native"
import { graphql } from "react-relay"
import { ArtistShows2PaginationContainer } from "./ArtistShows2"

describe("ArtistShows2", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistShows2TestsQuery>({
    Component: (props) => <ArtistShows2PaginationContainer artist={props.artist!} />,
    query: graphql`
      query ArtistShows2TestsQuery($artistID: String!) @relay_test_operation {
        artist(id: $artistID) {
          slug
          ...ArtistShows2_artist
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
    expect(tree.UNSAFE_getAllByType(ArtistShowFragmentContainer).length).toEqual(3)
  })
})
