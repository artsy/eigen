import { ArtistAboutShowsTestsQuery } from "__generated__/ArtistAboutShowsTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Button, Flex } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtistAboutShowsFragmentContainer } from "./ArtistAboutShows"

jest.unmock("react-relay")

describe("ArtistAboutShows", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<ArtistAboutShowsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
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
      `}
      variables={{ artistID: "artist-id" }}
      render={({ props }) => {
        if (props?.artist) {
          return <ArtistAboutShowsFragmentContainer artist={props.artist} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("returns nothing if the user has no past/running/upcoming events", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
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

    expect(tree.root.findAllByType(Flex).length).toEqual(0)
  })

  it("returns list of shows if the user has past/running/upcoming events", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
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

    expect(tree.root.findAllByType(FlatList).length).toEqual(1)
  })

  describe("See all past shows Button", () => {
    it("is visible when the user has past shows", () => {
      const tree = renderWithWrappers(<TestRenderer />)

      mockEnvironmentPayload(mockEnvironment, {
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

      expect(tree.root.findAllByType(Button).length).toEqual(1)
    })

    it("is hidden when the user has no past shows", () => {
      const tree = renderWithWrappers(<TestRenderer />)

      mockEnvironmentPayload(mockEnvironment, {
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

      expect(tree.root.findAllByType(Button).length).toEqual(0)
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
