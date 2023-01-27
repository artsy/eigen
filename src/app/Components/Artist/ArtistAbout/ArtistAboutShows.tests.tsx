import { ArtistAboutShowsTestsQuery } from "__generated__/ArtistAboutShowsTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Button, Flex } from "palette"
import { FlatList } from "react-native"
import { graphql } from "react-relay"
import { ArtistAboutShowsFragmentContainer } from "./ArtistAboutShows"

describe("ArtistAboutShows", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistAboutShowsTestsQuery>({
    Component: (props) => <ArtistAboutShowsFragmentContainer artist={props.artist!} />,
    query: graphql`
      query ArtistAboutShowsTestsQuery($artistID: String!) @relay_test_operation {
        artist(id: $artistID) {
          ...ArtistAboutShows_artist
          currentShows: showsConnection(status: "running", first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `,
    variables: { artistID: "artist-id" },
  })

  it("returns nothing if the user has no past/running/upcoming events", () => {
    const tree = renderWithRelay({
      ShowConnection: (context) => {
        switch (context.alias) {
          case "currentShows":
            return { edges: [] }
          case "upcomingShows":
            return { edges: [] }
          case "pastShows":
            return { edges: [] }
        }
      },
    })

    expect(tree.UNSAFE_getAllByType(Flex).length).toEqual(0)
  })

  it("returns list of shows if the user has past/running/upcoming events", () => {
    const tree = renderWithRelay({
      ShowConnection: (context) => {
        switch (context.alias) {
          case "currentShows":
            return mockShows
          case "upcomingShows":
            return { edges: [] }

          case "pastShows":
            return { edges: [] }
        }
      },
    })

    expect(tree.UNSAFE_getAllByType(FlatList).length).toEqual(1)
  })

  describe("See all past shows Button", () => {
    it("is visible when the user has past shows", () => {
      const tree = renderWithRelay({
        ShowConnection: (context) => {
          switch (context.alias) {
            case "currentShows":
            case "upcomingShows":
              return { edges: [] }

            case "pastShows":
              return mockShows
          }
        },
      })

      expect(tree.UNSAFE_getAllByType(Button).length).toEqual(1)
    })

    it("is hidden when the user has no past shows", () => {
      const tree = renderWithRelay({
        ShowConnection: (context) => {
          switch (context.alias) {
            case "currentShows":
            case "upcomingShows":
              return mockShows

            case "pastShows":
              return { edges: [] }
          }
        },
      })

      expect(tree.UNSAFE_getAllByType(Button).length).toEqual(0)
    })
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
