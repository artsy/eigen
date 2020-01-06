import { Theme } from "@artsy/palette"
import { CollectionArtworksTestsQueryRawResponse } from "__generated__/CollectionArtworksTestsQuery.graphql"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { CollectionFixture } from "../../Components/__fixtures__/CollectionFixture"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "../CollectionArtworks"

jest.unmock("react-relay")

describe("Collection Artworks", () => {
  const render = () =>
    renderRelayTree({
      Component: ({ marketingCollection }) => (
        <Theme>
          <CollectionArtworks collection={marketingCollection} />
        </Theme>
      ),
      query: graphql`
        query CollectionArtworksTestsQuery @raw_response_type {
          marketingCollection(slug: "street-art-now") {
            ...CollectionArtworks_collection
          }
        }
      `,
      mockData: { marketingCollection: CollectionFixture } as CollectionArtworksTestsQueryRawResponse,
    })

  it("renders properly", async () => {
    const tree = await render()
    expect(tree.html()).toMatchSnapshot()
  })
})
