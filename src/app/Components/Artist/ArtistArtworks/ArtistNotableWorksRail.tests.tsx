import { ArtistNotableWorksRailTestsQuery } from "__generated__/ArtistNotableWorksRailTestsQuery.graphql"
import { ArtistNotableWorksRailFragmentContainer } from "app/Components/Artist/ArtistArtworks/ArtistNotableWorksRail"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"

describe("Notable Works Rail", () => {
  const TestWrapper = () => {
    return (
      <QueryRenderer<ArtistNotableWorksRailTestsQuery>
        environment={getRelayEnvironment()}
        query={graphql`
          query ArtistNotableWorksRailTestsQuery @relay_test_operation @raw_response_type {
            artist(id: "a-really-talented-artist") {
              ...ArtistNotableWorksRail_artist
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.artist) {
            return <ArtistNotableWorksRailFragmentContainer artist={props.artist} />
          }
          return null
        }}
      />
    )
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders without throwing an error when 3 or more notable artworks", async () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation({
      Artist: () => artistMockData,
    })

    expect(getByText("My Second Greatest Art, 2020")).toBeTruthy()
    expect(getByText("My Greatest Art, 2020")).toBeTruthy()
    expect(getByText("My Third Greatest Art, 2020")).toBeTruthy()
  })

  describe("Notable artwork metadata", () => {
    it("renders artwork price", async () => {
      const { getByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artist: () => artistMockData,
      })

      expect(getByText("€2,500 - 5,000")).toBeTruthy()
    })

    it("renders 'Bidding closed' when artwork is in closed auction state", async () => {
      const { getByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artist: () => artistMockData,
      })

      expect(getByText("Bidding closed")).toBeTruthy()
    })

    it("renders current bid value and bids count", async () => {
      const { queryByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artist: () => artistMockData,
      })

      expect(queryByText("$4,500 (2 bids)")).toBeTruthy()
    })
  })
})

const artistMockData: ArtistNotableWorksRailTestsQuery["rawResponse"]["artist"] = {
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
