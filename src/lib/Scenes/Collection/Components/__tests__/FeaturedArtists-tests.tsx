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
        internalID: "2342-pablo-picassos-id",
        name: "Pablo Picasso",
        image: {
          resized: {
            url: "/some/resized/picasso/image/url",
          },
        },
        birthday: "1877",
        nationality: "American",
        isFollowed: true,
      },
      {
        slug: "andy-warhol",
        internalID: "34534-andy-warhols-id",
        name: "Andy Warhol",
        image: {
          resized: {
            url: "/some/resized/warhol/image/url",
          },
        },
        birthday: "1947",
        nationality: "American",
        isFollowed: false,
      },
      {
        slug: "joan-miro",
        internalID: "3454",
        name: "Joan Miro",
        image: {
          resized: {
            url: "/some/resized/miro/image/url",
          },
        },
        birthday: "1877",
        nationality: "Spanish",
        isFollowed: true,
      },
    ],
  },
  featuredArtistExclusionIds: [],
  " $refType": null,
}

describe("FeaturedArtists", () => {
  const render = (collection: FeaturedArtists_collection) =>
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
        marketingCollection: collection,
      },
    })

  it("renders properly", async () => {
    const tree = await render(CollectionFixture)
    expect(tree.html()).toMatchSnapshot()
  })

  it("renders an EntityHeader for each featured artist", async () => {
    const tree = await render(CollectionFixture)

    const entityHeaders = tree.find("EntityHeader")
    expect(entityHeaders.length).toEqual(3)

    const output = tree.html()
    expect(output).toContain("Pablo Picasso")
    expect(output).toContain("Andy Warhol")
    expect(output).toContain("Joan Miro")
  })

  it("does not render an EntityHeader for excluded artists", async () => {
    const tree = await render({
      ...CollectionFixture,
      featuredArtistExclusionIds: ["34534-andy-warhols-id", "2342-pablo-picassos-id"],
    })

    const entityHeaders = tree.find("EntityHeader")
    expect(entityHeaders.length).toEqual(1)

    const output = tree.html()
    expect(output).toContain("Joan Miro")
    expect(output).not.toContain("Andy Warhol")
    expect(output).not.toContain("Pablo Picasso")
  })
})
