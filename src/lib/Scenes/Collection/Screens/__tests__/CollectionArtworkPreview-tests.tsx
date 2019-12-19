import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { CollectionFixture } from "../../Components/__fixtures__/CollectionFixture"
import { CollectionArtworkPreview } from "../CollectionArtworkPreview"

jest.unmock("react-relay")

describe("CollectionArtworkPreview", () => {
  it("renders properly", async () => {
    const tree = await renderRelayTree({
      Component: (props: any) => <CollectionArtworkPreview {...props} />,
      query: graphql`
        query CollectionArtworkPreviewTestsQuery @raw_response_type {
          marketingCollection(slug: "street-art-now") {
            ...CollectionArtworkPreview_collection
          }
        }
      `,
      mockData: { marketingCollection: CollectionFixture },
    })

    expect(tree.html()).toMatchSnapshot()
  })
})
