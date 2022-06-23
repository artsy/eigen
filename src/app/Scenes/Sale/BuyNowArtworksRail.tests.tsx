import { BuyNowArtworksRailTestsQuery } from "__generated__/BuyNowArtworksRailTestsQuery.graphql"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { BuyNowArtworksRailContainer } from "./Components/BuyNowArtworksRail"

jest.unmock("react-relay")

describe("BuyNowArtworksRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<BuyNowArtworksRailTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query BuyNowArtworksRailTestsQuery($id: String!) @relay_test_operation {
          sale(id: $id) {
            ...BuyNowArtworksRail_sale
          }
        }
      `}
      variables={{ id: "sale-id" }}
      render={({ props }) => {
        if (props?.sale) {
          return <BuyNowArtworksRailContainer sale={props.sale} />
        }
        return null
      }}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })
  it(`renders title "Buy now"`, () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, mockProps)
    expect(getByText("Artworks Available to Buy Now")).toBeDefined()
  })

  it("renders nothing if there are no artworks", () => {
    const { queryAllByTestId } = renderWithWrappersTL(<TestRenderer />)
    const noArtworksProps = {
      Sale: () => ({
        saleArtworksConnection: {
          edges: [],
        },
      }),
    }
    resolveMostRecentRelayOperation(mockEnvironment, noArtworksProps)
    expect(queryAllByTestId("bnmo-rail-wrapper")).toHaveLength(0)
  })
})

const saleArtworksConnectionEdges = new Array(10).fill({
  node: {
    artwork: {
      id: "artwork-id",
      title: "Best artwork ever",
      date: "2019",
      saleMessage: "Contact For Price",
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
