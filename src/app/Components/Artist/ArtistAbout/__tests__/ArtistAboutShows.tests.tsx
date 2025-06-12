import { screen } from "@testing-library/react-native"
import { ArtistAboutShowsTestsQuery } from "__generated__/ArtistAboutShowsTestsQuery.graphql"
import { ArtistAboutShowsFragmentContainer } from "app/Components/Artist/ArtistAbout/ArtistAboutShows"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { FlatList } from "react-native"
import { graphql } from "react-relay"

describe("ArtistAboutShows", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistAboutShowsTestsQuery>({
    Component: (props) => <ArtistAboutShowsFragmentContainer artist={props.artist!} />,
    query: graphql`
      query ArtistAboutShowsTestsQuery @relay_test_operation {
        artist(id: "artist-id") {
          ...ArtistAboutShows_artist
        }
      }
    `,
  })

  it("returns nothing if the user has no past/running/upcoming events", () => {
    renderWithRelay({ ShowConnection: () => ({ edges: [] }) })

    // component doesn't render anything
    expect(screen.toJSON()).toBe(null)
  })

  it("returns list of shows if the user has running events", () => {
    const tree = renderWithRelay({ ShowConnection: () => mockShows })

    expect(tree.UNSAFE_getAllByType(FlatList).length).toEqual(1)
  })
})

const mockShowsConnection = new Array(10).fill({
  node: {
    show: "show",
    id: "show-id",
  },
})

const mockShows = {
  edges: mockShowsConnection,
}
