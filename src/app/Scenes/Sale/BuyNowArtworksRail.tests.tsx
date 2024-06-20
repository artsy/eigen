import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { BuyNowArtworksRailContainer } from "./Components/BuyNowArtworksRail"

describe("BuyNowArtworksRail", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: BuyNowArtworksRailContainer,
    query: graphql`
      query BuyNowArtworksRailTestsQuery($id: String!) @relay_test_operation {
        sale(id: $id) {
          ...BuyNowArtworksRail_sale
        }
      }
    `,
    variables: { id: "sale-id" },
  })

  it(`renders title "Buy now"`, () => {
    const { getByText } = renderWithRelay(mockProps)
    expect(getByText("Artworks Available to Buy Now")).toBeDefined()
  })

  it("renders nothing if there are no artworks", () => {
    const noArtworksProps = {
      Sale: () => ({
        saleArtworksConnection: {
          edges: [],
        },
      }),
    }
    const { queryAllByTestId } = renderWithRelay(noArtworksProps)
    expect(queryAllByTestId("bnmo-rail-wrapper")).toHaveLength(0)
  })
})

const saleArtworksConnectionEdges = new Array(10).fill({
  node: {
    artwork: {
      id: "artwork-id",
      title: "Best artwork ever",
      date: "2019",
      saleMessage: "Contact for price",
      artistNames: "Banksy",
      href: "/artwork/artwroks-href",
      image: {
        url: "artworkImageUrl",
      },
      partner: {
        name: "Heritage Auctions",
      },
    },
  },
})

const mockProps = {
  Sale: () => ({
    saleArtworksConnection: {
      edges: saleArtworksConnectionEdges,
    },
  }),
}
