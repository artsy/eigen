import { ContextCardTestsQuery } from "__generated__/ContextCardTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { ContextCardFragmentContainer } from "./ContextCard"

describe("ContextCard", () => {
  const TestWrapper = () => {
    return (
      <QueryRenderer<ContextCardTestsQuery>
        environment={getRelayEnvironment()}
        query={graphql`
          query ContextCardTestsQuery @relay_test_operation {
            artwork(id: "artworkId") {
              ...ContextCard_artwork
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.artwork) {
            return <ContextCardFragmentContainer artwork={props.artwork} />
          }

          return null
        }}
      />
    )
  }

  describe("Fair context", () => {
    it("renders fair name correctly", () => {
      const { getByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artwork: () => fairContextArtwork,
      })

      expect(getByText("Market Art + Design 2019")).toBeTruthy()
    })

    it("renders fair image", () => {
      const { getByLabelText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artwork: () => fairContextArtwork,
      })

      expect(getByLabelText("Context Card Image")).toBeTruthy()
    })
  })

  describe("Show context", () => {
    it("renders show name correctly", () => {
      const { getByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artwork: () => showContextArtwork,
      })

      expect(getByText("Time Lapse")).toBeTruthy()
    })

    it("renders show image", () => {
      const { getByLabelText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artwork: () => showContextArtwork,
      })

      expect(getByLabelText("Context Card Image")).toBeTruthy()
    })

    it("renders show button text correctly", () => {
      const { queryByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artwork: () => showContextArtwork,
      })

      expect(queryByText("Follow")).toBeTruthy()
      expect(queryByText("Following")).toBeFalsy()
    })
  })

  describe("Sale context", () => {
    it("renders sale name correctly", () => {
      const { getByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artwork: () => auctionContextArtwork,
      })

      expect(getByText("Christie’s: Prints & Multiples")).toBeTruthy()
    })

    it("renders formatted sale start/end date correctly", () => {
      const { getByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artwork: () => auctionContextArtwork,
      })

      expect(getByText("Ended Oct 25, 2018")).toBeTruthy()
    })

    it("if auction is live display in progress", () => {
      const saleContextArtwork = {
        ...auctionContextArtwork,
        context: {
          ...auctionContextArtwork.context,
          formattedStartDateTime: "In progress",
        },
      }
      const { getByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artwork: () => saleContextArtwork,
      })

      expect(getByText("In progress")).toBeTruthy()
    })

    it("renders sale image", () => {
      const { getByLabelText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artwork: () => auctionContextArtwork,
      })

      expect(getByLabelText("Context Card Image")).toBeTruthy()
    })

    it("renders 'In Auction' if the sale is an auction", () => {
      const { getByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artwork: () => auctionContextArtwork,
      })

      expect(getByText("In auction")).toBeTruthy()
    })

    it("renders nothing if the sale is not an auction", () => {
      const saleContextArtwork = {
        ...auctionContextArtwork,
        context: {
          ...auctionContextArtwork.context,
          isAuction: false,
        },
      }
      const { toJSON } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artwork: () => saleContextArtwork,
      })

      expect(toJSON()).toBeNull()
    })
  })
})

const fairContextArtwork = {
  id: "QXJ0d29yazpjYW5kaWNlLWNtYy1zdXBlcm1hbi1kb251dHMtMQ==",
  gravityID: "candice-cmc-superman-donuts-1",
  internalID: "5d0a7485fc1f78001248b677",
  context: {
    __typename: "Fair",
    id: "QXJ0d29ya0NvbnRleHRGYWlyOm1hcmtldC1hcnQtcGx1cy1kZXNpZ24tMjAxOQ==",
    name: "Market Art + Design 2019",
    href: "/market-art-plus-design-2019",
    exhibition_period: "Jul 5 – 7",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/R5z4lkyH6DyGhEwAg44NSA/wide.jpg",
    },
  },
}

const auctionContextArtwork = {
  id: "QXJ0d29yazphbmR5LXdhcmhvbC1tYW8tb25lLXBsYXRlLTM=",
  gravityID: "andy-warhol-mao-one-plate-3",
  internalID: "5bc13101c8d4326cc288ecb8",
  context: {
    __typename: "Sale",
    isLiveOpen: false,
    id: "QXJ0d29ya0NvbnRleHRBdWN0aW9uOmNocmlzdGllcy1wcmludHMtYW5kLW11bHRpcGxlcy02",
    name: "Christie’s: Prints & Multiples",
    href: "/auction/christies-prints-and-multiples-6",
    isAuction: true,
    formattedStartDateTime: "Ended Oct 25, 2018",
    coverImage: {
      url: "https://d32dm0rphc51dk.cloudfront.net/bMu0vqXOVlpABBsWVxVIJA/large_rectangle.jpg",
    },
  },
  shows: [],
  fair: null,
}

const showContextArtwork = {
  id: "QXJ0d29yazphYmJhcy1raWFyb3N0YW1pLXVudGl0bGVkLTc=",
  gravityID: "abbas-kiarostami-untitled-7",
  internalID: "5b2b745e9c18db204fc32e11",
  context: {
    __typename: "Show",
    id: "U2hvdzpjYW1hLWdhbGxlcnktMS10aW1lLWxhcHNl",
    name: "Time Lapse",
    href: "/show/cama-gallery-1-time-lapse",
    gravityID: "cama-gallery-1-time-lapse",
    internalID: "5b335e329c18db4a5a5015cc",
    exhibition_period: "Jun 22 – Jul 3, 2018",
    is_followed: null,
    coverImage: {
      url: "https://d32dm0rphc51dk.cloudfront.net/MYRUdCdCDdpU9dLTcmDX0A/medium.jpg",
    },
  },
  fair: null,
}
