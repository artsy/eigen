import { ArtistNotableWorksRailTestsQueryRawResponse } from "__generated__/ArtistNotableWorksRailTestsQuery.graphql"
import { ArtistNotableWorksRailFragmentContainer } from "app/Components/Artist/ArtistArtworks/ArtistNotableWorksRail"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { PrefetchFlatList } from "app/Components/PrefetchFlatList"
import { GlobalStoreProvider } from "app/store/GlobalStore"
import { renderRelayTree } from "app/tests/renderRelayTree"
import { Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"

jest.unmock("react-relay")

describe("Notable Works Rail", () => {
  const getWrapper = async () => {
    return renderRelayTree({
      Component: (props: any) => {
        return (
          <GlobalStoreProvider>
            <Theme>
              <ArtistNotableWorksRailFragmentContainer artist={props.artist} {...props} />
            </Theme>
          </GlobalStoreProvider>
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
    expect(wrapper.find(PrefetchFlatList)).toHaveLength(1)
    expect(wrapper.find(ArtworkRailCard)).toHaveLength(3)
  })

  describe("Notable artwork metadata", () => {
    it("renders artwork price and title metadata when price", async () => {
      const wrapper = await getWrapper()

      expect(wrapper.find(ArtworkRailCard).first().text()).toContain("My Second Greatest Art")

      expect(wrapper.find(ArtworkRailCard).first().text()).toContain("€2,500 - 5,000")
    })

    it("renders artwork price and title metadata when bidding closed", async () => {
      const wrapper = await getWrapper()

      expect(wrapper.find(ArtworkRailCard).at(1).text()).toContain("Bidding closed")
      expect(wrapper.find(ArtworkRailCard).at(1).text()).toContain("My Greatest Art")
    })

    it("renders artwork price and title metadata when auction price", async () => {
      const wrapper = await getWrapper()

      expect(wrapper.find(ArtworkRailCard).at(2).text()).toContain("My Third Greatest Art")

      expect(wrapper.find(ArtworkRailCard).at(2).text()).toContain("$4,500")
    })
  })
})

const artistMockData: ArtistNotableWorksRailTestsQueryRawResponse["artist"] = {
  id: "an-id",
  internalID: "an-id",
  slug: "a-slug",
  filterArtworksConnection: {
    id: "another-id",
    edges: [
      {
        node: {
          id: "another-another-id-2",
          href: "/artwork/another-another-id-3",
          artistNames: "Artist Name",
          date: "2020",
          partner: null,
          image: {
            resized: {
              src: "https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=295&height=400&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F6q3YwlLkt3gxMLuUx9xvCw%2Flarge.jpg",
              srcSet:
                "https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=295&height=400&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F6q3YwlLkt3gxMLuUx9xvCw%2Flarge.jpg 1x, https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=590&height=800&quality=50&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F6q3YwlLkt3gxMLuUx9xvCw%2Flarge.jpg 2x",
              width: 295,
              height: 400,
            },
            aspectRatio: 0.74,
          },
          saleMessage: "€2,500 - 5,000",
          saleArtwork: null,
          sale: null,
          title: "My Second Greatest Art",
          internalID: "37297491dDsddS22222",
          slug: "this-artworks-slug-2",
          realizedPrice: null,
        },
      },
      {
        node: {
          id: "another-another-id",
          href: "/artwork/another-another-id-3",
          artistNames: "Artist Name",
          date: "2020",
          partner: null,
          image: {
            resized: {
              src: "https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=295&height=400&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F6q3YwlLkt3gxMLuUx9xvCw%2Flarge.jpg",
              srcSet:
                "https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=295&height=400&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F6q3YwlLkt3gxMLuUx9xvCw%2Flarge.jpg 1x, https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=590&height=800&quality=50&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F6q3YwlLkt3gxMLuUx9xvCw%2Flarge.jpg 2x",
              width: 295,
              height: 400,
            },
            aspectRatio: 0.74,
          },
          saleMessage: null,
          saleArtwork: null,
          sale: {
            isAuction: true,
            isClosed: true,
            id: "sale-id2",
            endAt: "2020-01-01T00:00:00+00:00",
          },
          title: "My Greatest Art",
          internalID: "37297491dDsddS",
          slug: "this-artworks-slug",
          realizedPrice: null,
        },
      },
      {
        node: {
          id: "another-another-id-3",
          href: "/artwork/another-another-id-3",
          artistNames: "Artist Name",
          date: "2020",
          partner: null,
          image: {
            resized: {
              src: "https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=295&height=400&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F6q3YwlLkt3gxMLuUx9xvCw%2Flarge.jpg",
              srcSet:
                "https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=295&height=400&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F6q3YwlLkt3gxMLuUx9xvCw%2Flarge.jpg 1x, https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=590&height=800&quality=50&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F6q3YwlLkt3gxMLuUx9xvCw%2Flarge.jpg 2x",
              width: 295,
              height: 400,
            },
            aspectRatio: 0.74,
          },
          saleMessage: null,
          saleArtwork: {
            currentBid: {
              display: "$4,500",
            },
            counts: {
              bidderPositions: 2,
            },
            id: "id-123",
          },
          sale: {
            isClosed: false,
            isAuction: true,
            endAt: "2020-01-01T00:00:00+00:00",
            id: "sale-id",
          },
          title: "My Third Greatest Art",
          internalID: "37297491dDsddS3333",
          slug: "this-artworks-slug-3",
          realizedPrice: null,
        },
      },
    ],
  },
}
