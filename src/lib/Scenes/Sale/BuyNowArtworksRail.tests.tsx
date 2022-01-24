import { BuyNowArtworksRailTestsQuery } from "__generated__/BuyNowArtworksRailTestsQuery.graphql"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import {
  BuyNowArtworksRailContainer,
  INITIAL_NUMBER_TO_RENDER,
} from "./Components/BuyNowArtworksRail"

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
    mockEnvironmentPayload(mockEnvironment, mockProps)
    expect(getByText("Artworks Available to Buy Now")).toBeDefined()
  })
  it("renders initial amount of cards with proper text", () => {
    const { getAllByText } = renderWithWrappersTL(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, mockProps)
    expect(getAllByText("Banksy")).toHaveLength(INITIAL_NUMBER_TO_RENDER)
    expect(getAllByText("Best artwork ever, 2019")).toHaveLength(INITIAL_NUMBER_TO_RENDER)
    expect(getAllByText("Heritage Auctions")).toHaveLength(INITIAL_NUMBER_TO_RENDER)
    expect(getAllByText("Contact For Price")).toHaveLength(INITIAL_NUMBER_TO_RENDER)
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
    mockEnvironmentPayload(mockEnvironment, noArtworksProps)
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
