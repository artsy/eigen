import { screen } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { NewBuyNowArtworksRailContainer } from "./NewBuyNowArtworksRail"

describe("NewBuyNowArtworksRail", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: NewBuyNowArtworksRailContainer,
    query: graphql`
      query NewBuyNowArtworksRailTestsQuery($id: String!) @relay_test_operation {
        sale(id: $id) {
          ...NewBuyNowArtworksRail_sale
        }
      }
    `,
    variables: { id: "sale-id" },
  })

  it(`renders "Buy now" rail and artworks`, () => {
    renderWithRelay(mockProps)
    expect(screen.queryByText("Artworks Available to Buy Now")).toBeDefined()
    expect(screen.queryAllByText("Best artwork ever, 2019")).toBeDefined()
  })

  it("renders nothing if there are no artworks", () => {
    const noArtworksProps = {
      Sale: () => ({
        artworksConnection: {
          edges: [],
        },
      }),
    }

    const { queryAllByTestId } = renderWithRelay(noArtworksProps)
    expect(queryAllByTestId("bnmo-rail-wrapper")).toHaveLength(0)
  })
})

const artworksConnectionEdges = new Array(10).fill({
  node: {
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
})

const mockProps = {
  Sale: () => ({
    artworksConnection: {
      edges: artworksConnectionEdges,
    },
  }),
}
