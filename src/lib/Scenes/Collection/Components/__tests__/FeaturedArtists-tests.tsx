import { Theme } from "@artsy/palette"
import { FeaturedArtistsTestsQueryRawResponse } from "__generated__/FeaturedArtistsTestsQuery.graphql"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { CollectionFeaturedArtistsContainer as FeaturedArtists } from "../FeaturedArtists"

jest.unmock("react-relay")

const CollectionFixture: FeaturedArtistsTestsQueryRawResponse["marketingCollection"] = {
  id: "some-id",
  artworksConnection: {
    id: "connection-id",
    merchandisableArtists: [
      {
        id: "2342-pablo-picassos-id",
        slug: "pablo-picasso",
        internalID: "2342-pablo-picassos-id",
        name: "Pablo Picasso",
        image: {
          url: "/some/resized/picasso/image/url",
        },
        birthday: "1877",
        nationality: "American",
        is_followed: true,
        initials: "PP",
        href: "/a/link/to/picasso",
        deathday: "1973",
      },
      {
        id: "34534-andy-warhols-id",
        slug: "andy-warhol",
        internalID: "34534-andy-warhols-id",
        name: "Andy Warhol",
        image: {
          url: "/some/resized/warhol/image/url",
        },
        birthday: "1947",
        nationality: "American",
        is_followed: true,
        initials: "AW",
        href: "/a/link/to/warhol",
        deathday: "1987",
      },
      {
        id: "3454",
        slug: "joan-miro",
        internalID: "3454",
        name: "Joan Miro",
        image: {
          url: "/some/resized/miro/image/url",
        },
        birthday: "1877",
        nationality: "Spanish",
        is_followed: true,
        initials: "JM",
        href: "/a/link/to/miro",
        deathday: "1983",
      },
    ],
  },
  featuredArtistExclusionIds: [],
  query: {
    id: "query-id",
    artistIDs: [],
  },
}

describe("FeaturedArtists", () => {
  const render = (collection: FeaturedArtistsTestsQueryRawResponse["marketingCollection"]) =>
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

  describe("when artist ids are explicitly requested", () => {
    it("does not render an EntityHeader for any non-requested artists", async () => {
      const tree = await render({
        ...CollectionFixture,
        query: { id: "some-id", artistIDs: ["34534-andy-warhols-id"] },
      })

      const entityHeaders = tree.find("EntityHeader")
      expect(entityHeaders.length).toEqual(1)

      const output = tree.html()
      expect(output).toContain("Andy Warhol")
      expect(output).not.toContain("Joan Miro")
      expect(output).not.toContain("Pablo Picasso")
    })
  })
})
