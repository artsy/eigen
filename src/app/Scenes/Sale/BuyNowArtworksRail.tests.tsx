import { BuyNowArtworksRailTestsQuery } from "__generated__/BuyNowArtworksRailTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { BuyNowArtworksRailContainer } from "./Components/BuyNowArtworksRail"

describe("BuyNowArtworksRail", () => {
  const TestRenderer = () => (
    <QueryRenderer<BuyNowArtworksRailTestsQuery>
      environment={getRelayEnvironment()}
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

  it(`renders title "Buy now"`, () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockProps)
    expect(getByText("Artworks Available to Buy Now")).toBeDefined()
  })

  it("renders nothing if there are no artworks", () => {
    const { queryAllByTestId } = renderWithWrappers(<TestRenderer />)
    const noArtworksProps = {
      Sale: () => ({
        saleArtworksConnection: {
          edges: [],
        },
      }),
    }
    resolveMostRecentRelayOperation(noArtworksProps)
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
