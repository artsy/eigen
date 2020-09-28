import {
  Fair2CollectionsTestsQuery,
  Fair2CollectionsTestsQueryRawResponse,
} from "__generated__/Fair2CollectionsTestsQuery.graphql"
import { Fair2CollectionsFragmentContainer } from "lib/Scenes/Fair2/Components/Fair2Collections"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text, TouchableWithScale } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

const FAIR_2_COLLECTIONS_FIXTURE: Fair2CollectionsTestsQueryRawResponse = {
  fair: {
    id: "art-basel-hong-kong-2020",
    marketingCollections: [
      {
        id: "xxx",
        slug: "collectible-sculptures",
        title: "Big Artists, Small Sculptures",
        category: "Collectible Sculptures",
        artworks: {
          id: "xxx",
          edges: [
            {
              node: {
                id: "xxx1",
                image: {
                  url: "https://example.com/example.jpg",
                },
              },
            },
            {
              node: {
                id: "xxx2",
                image: {
                  url: "https://example.com/example.jpg",
                },
              },
            },
            {
              node: {
                id: "xxx3",
                image: {
                  url: "https://example.com/example.jpg",
                },
              },
            },
          ],
        },
      },
      {
        id: "xxx2",
        slug: "example-collection-2",
        title: "Example Collection 2",
        category: "Subtitle 2",
        artworks: {
          id: "xxx2",
          edges: [
            {
              node: {
                id: "xxx1",
                image: {
                  url: "https://example.com/example.jpg",
                },
              },
            },
            {
              node: {
                id: "xxx2",
                image: {
                  url: "https://example.com/example.jpg",
                },
              },
            },
            {
              node: {
                id: "xxx3",
                image: {
                  url: "https://example.com/example.jpg",
                },
              },
            },
          ],
        },
      },
    ],
  },
}

describe("Fair2Collections", () => {
  const getWrapper = (fixture = FAIR_2_COLLECTIONS_FIXTURE) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappers(
      <QueryRenderer<Fair2CollectionsTestsQuery>
        environment={env}
        query={graphql`
          query Fair2CollectionsTestsQuery($fairID: String!) @raw_response_type {
            fair(id: $fairID) {
              ...Fair2Collections_fair
            }
          }
        `}
        variables={{ fairID: "art-basel-hong-kong-2020" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.fair) {
            return null
          }

          return <Fair2CollectionsFragmentContainer fair={props.fair} />
        }}
      />
    )

    env.mock.resolveMostRecentOperation({ errors: [], data: fixture })

    return tree
  }

  it("renders the 2 collections", () => {
    const wrapper = getWrapper()

    const links = wrapper.root.findAllByType(TouchableWithScale)
    expect(links).toHaveLength(2)

    const text = wrapper.root
      .findAllByType(Text)
      .map(({ props: { children } }) => children)
      .join()

    expect(text).toContain("Big Artists, Small Sculptures")
    expect(text).toContain("Collectible Sculptures")
    expect(text).toContain("Example Collection 2")
    expect(text).toContain("Subtitle 2")
  })

  it("renders null if there are no collections", () => {
    const wrapper = getWrapper({
      fair: {
        ...FAIR_2_COLLECTIONS_FIXTURE.fair,
        id: "art-basel-hong-kong-2020",
        marketingCollections: [],
      },
    })

    expect(wrapper.toJSON()).toBe(null)
  })
})
