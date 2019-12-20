import { Theme } from "@artsy/palette"
import { FeaturedArtists_collection } from "__generated__/FeaturedArtists_collection.graphql"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { CollectionFeaturedArtistsContainer as FeaturedArtists } from "../FeaturedArtists"

jest.unmock("react-relay")

const CollectionFixture: FeaturedArtists_collection = {
  artworksConnection: {
    merchandisableArtists: [
      {
        slug: "pablo-picasso",
        internalID: "1234",
        name: "Pablo Picasso",
        // TODO: should this be image.url (and resized)?
        imageUrl: "/some/picasso/image/url",
        birthday: "1877",
        nationality: "American",
        isFollowed: true,
      },
      {
        slug: "andy-warhol",
        internalID: "2342",
        name: "Andy Warhol",
        // TODO: should this be image.url (and resized)?
        imageUrl: "/some/warhol/image/url",
        birthday: "1947",
        nationality: "American",
        isFollowed: false,
      },
      {
        slug: "joan-miro",
        internalID: "3454",
        name: "Joan Miro",
        // TODO: should this be image.url (and resized)?
        imageUrl: "/some/miro/image/url",
        birthday: "1877",
        nationality: "Spanish",
        isFollowed: true,
      },
    ],
  },
  " $refType": null,
}

describe("FeaturedArtists", () => {
  const render = () =>
    renderRelayTree({
      Component: ({ marketingCollection }) => (
        <Theme>
          <FeaturedArtists collection={marketingCollection} />
        </Theme>
      ),
      query: graphql`
        query FeaturedArtistsTestsQuery @raw_response_type {
          marketingCollection(slug: "emerging-photographers") {
            ...FeaturedArtists_collection
          }
        }
      `,
      mockData: {
        marketingCollection: CollectionFixture,
      },
    })

  it("renders properly", async () => {
    const tree = await render()
    expect(tree.html()).toMatchSnapshot()
  })

  it("renders an EntityHeader for each featured artist", async () => {
    const tree = await render()

    const entityHeaders = tree.find("EntityHeader")
    expect(entityHeaders.length).toEqual(3)

    const output = tree.html()
    expect(output).toContain("Pablo Picasso")
    expect(output).toContain("Andy Warhol")
    expect(output).toContain("Joan Miro")
  })
})
