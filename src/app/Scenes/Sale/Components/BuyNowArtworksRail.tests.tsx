import { screen } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { BuyNowArtworksRailContainer } from "./BuyNowArtworksRail"

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

  it(`renders "Buy now" rail and artworks`, () => {
    renderWithRelay(mockProps)

    expect(screen.getByText("Artworks Available to Inquire")).toBeOnTheScreen()
    expect(screen.queryAllByText("Best artwork ever, 2019")).toHaveLength(10)
  })

  it("renders nothing if there are no artworks", () => {
    const noArtworksProps = {
      Sale: () => ({
        artworksConnection: {
          edges: [],
        },
      }),
    }

    renderWithRelay(noArtworksProps)
    expect(screen.queryAllByTestId("bnmo-rail-wrapper")).toHaveLength(0)
  })
})

const artworksConnectionEdges = new Array(10).fill({
  node: {
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
})

const mockProps = {
  Sale: () => ({
    artworksConnection: {
      edges: artworksConnectionEdges,
    },
  }),
}
