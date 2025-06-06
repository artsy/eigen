import { screen } from "@testing-library/react-native"
import { BuyNowArtworksRailContainer } from "app/Scenes/Sale/Components/BuyNowArtworksRail"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

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
    renderWithRelay(mockProps)
    expect(screen.getByText("Artworks Available to Inquire")).toBeDefined()
  })

  it("renders nothing if there are no artworks", () => {
    const noArtworksProps = {
      Sale: () => ({
        saleArtworksConnection: {
          edges: [],
        },
      }),
    }
    renderWithRelay(noArtworksProps)
    expect(screen.queryAllByTestId("bnmo-rail-wrapper")).toHaveLength(0)
  })
})

const saleArtworksConnectionEdges = new Array(10).fill({
  node: {
    artwork: {
      id: "artwork-id",
      title: "Best artwork ever",
      date: "2019",
      saleMessage: "Price on request",
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
