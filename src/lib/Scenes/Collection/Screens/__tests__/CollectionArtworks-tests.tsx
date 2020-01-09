import { Theme } from "@artsy/palette"
import { CollectionArtworks_collection } from "__generated__/CollectionArtworks_collection.graphql"
import { Artwork as GridItem } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { CollectionFixture } from "lib/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "lib/Scenes/Collection/Screens/CollectionArtworks"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, RelayPaginationProp } from "react-relay"

jest.unmock("react-relay")

describe("CollectionArtworks", () => {
  const getWrapper = async (marketingCollection: Omit<CollectionArtworks_collection, " $fragmentRefs">) =>
    await renderRelayTree({
      Component: (props: any) => {
        return (
          <Theme>
            <CollectionArtworks
              collection={{ ...marketingCollection }}
              relay={{ environment: {} } as RelayPaginationProp}
              {...props}
            />
          </Theme>
        )
      },
      query: graphql`
        query CollectionArtworksTestsQuery @raw_response_type {
          marketingCollection(slug: "street-art-now") {
            slug
            id
            collectionArtworks: artworksConnection(first: 6) {
              edges {
                node {
                  id
                }
              }
              ...InfiniteScrollArtworksGrid_connection
            }
          }
        }
      `,
      mockData: marketingCollection,
    })

  xit("renders collection artworks", async () => {
    // TODO: Fix failing test
    const wrapper = await getWrapper(CollectionFixture as any)
    wrapper
      .find(ScrollView)
      .at(1)
      .props()
      .onLayout({
        nativeEvent: {
          layout: { width: 768 },
        },
      })
    await flushPromiseQueue()
    wrapper.update()
    expect(wrapper.find(GridItem).length).toBe(6)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
