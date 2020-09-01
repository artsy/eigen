import { ArtistNotableWorksRailTestsQueryRawResponse } from "__generated__/ArtistNotableWorksRailTestsQuery.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { ArtistNotableWorksRailFragmentContainer } from "lib/Components/Artist/ArtistArtworks/ArtistNotableWorksRail"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"

jest.unmock("react-relay")

describe("Notable Works Rail", () => {
  const getWrapper = async () => {
    return renderRelayTree({
      Component: (props: any) => {
        return (
          <Theme>
            <ArtistNotableWorksRailFragmentContainer artist={props.artist} {...props} />
          </Theme>
        )
      },
      query: graphql`
        query ArtistNotableWorksRailTestsQuery @raw_response_type {
          artist(id: "a-really-talented-artist") {
            ...ArtistNotableWorksRail_artist
          }
        }
      `,
      mockData: {
        artist: artistMockData,
      },
    })
  }

  it("renders without throwing an error when 3 or more notable artworks", async () => {
    const wrapper = await getWrapper()
    expect(wrapper.find(AboveTheFoldFlatList)).toHaveLength(1)
    expect(wrapper.find(ArtworkTileRailCard)).toHaveLength(3)
  })

  describe("Notable artwork metadata", () => {
    it("renders artwork price and title metadata when price", async () => {
      const wrapper = await getWrapper()

      expect(
        wrapper
          .find(ArtworkTileRailCard)
          .first()
          .props().title
      ).toBe("My Second Greatest Art")

      expect(
        wrapper
          .find(ArtworkTileRailCard)
          .first()
          .props().saleMessage
      ).toBe("€2,500 - 5,000")
    })

    it("renders artwork price and title metadata when bidding closed", async () => {
      const wrapper = await getWrapper()

      expect(
        wrapper
          .find(ArtworkTileRailCard)
          .at(1)
          .props().saleMessage
      ).toBe("Bidding closed")
      expect(
        wrapper
          .find(ArtworkTileRailCard)
          .at(1)
          .props().title
      ).toBe("My Greatest Art")
    })

    it("renders artwork price and title metadata when auction price", async () => {
      const wrapper = await getWrapper()

      expect(
        wrapper
          .find(ArtworkTileRailCard)
          .at(2)
          .props().title
      ).toBe("My Third Greatest Art")

      expect(
        wrapper
          .find(ArtworkTileRailCard)
          .at(2)
          .props().saleMessage
      ).toBe("$4,500")
    })
  })
})

const artistMockData: ArtistNotableWorksRailTestsQueryRawResponse["artist"] = {
  id: "an-id",
  filterArtworksConnection: {
    id: "another-id",
    edges: [
      {
        node: {
          id: "another-another-id-2",
          image: {
            imageURL: "https://www.testimages.net/test2.jpg",
            aspectRatio: 0.5,
          },
          saleMessage: "€2,500 - 5,000",
          saleArtwork: null,
          sale: null,
          title: "My Second Greatest Art",
          internalID: "37297491dDsddS22222",
          slug: "this-artworks-slug-2",
        },
      },
      {
        node: {
          id: "another-another-id",
          image: {
            imageURL: "https://www.testimages.net/test.jpg",
            aspectRatio: 0.8,
          },
          saleMessage: null,
          saleArtwork: null,
          sale: {
            isAuction: true,
            isClosed: true,
            id: "sale-id2",
          },
          title: "My Greatest Art",
          internalID: "37297491dDsddS",
          slug: "this-artworks-slug",
        },
      },
      {
        node: {
          id: "another-another-id-3",
          image: {
            imageURL: "https://www.testimages.net/test3.jpg",
            aspectRatio: 0.9,
          },
          saleMessage: null,
          saleArtwork: {
            highestBid: {
              display: "$4,500",
            },
            openingBid: {
              display: "$2,500",
            },
            id: "id-123",
          },
          sale: {
            isClosed: false,
            isAuction: true,
            id: "sale-id",
          },
          title: "My Third Greatest Art",
          internalID: "37297491dDsddS3333",
          slug: "this-artworks-slug-3",
        },
      },
    ],
  },
}
