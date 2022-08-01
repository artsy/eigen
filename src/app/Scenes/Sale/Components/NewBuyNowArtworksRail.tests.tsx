import { NewBuyNowArtworksRailTestsQuery } from "__generated__/NewBuyNowArtworksRailTestsQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { NewBuyNowArtworksRailContainer } from "./NewBuyNowArtworksRail"

jest.unmock("react-relay")

describe("NewBuyNowArtworksRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<NewBuyNowArtworksRailTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query NewBuyNowArtworksRailTestsQuery($id: String!) @relay_test_operation {
          sale(id: $id) {
            ...NewBuyNowArtworksRail_sale
          }
        }
      `}
      variables={{ id: "sale-id" }}
      render={({ props }) => {
        if (props?.sale) {
          return <NewBuyNowArtworksRailContainer sale={props.sale} />
        }
        return null
      }}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })
  it(`renders "Buy now" rail and artworks`, () => {
    const { getByText, queryByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(getByText("Artworks Available to Buy Now")).toBeDefined()
    expect(queryByText("Best artwork ever")).toBeDefined()
  })

  it("renders nothing if there are no artworks", () => {
    const { queryAllByTestId } = renderWithWrappers(<TestRenderer />)
    const noArtworksProps = {
      Sale: () => ({
        artworksConnection: {
          edges: [],
        },
      }),
    }
    resolveMostRecentRelayOperation(mockEnvironment, noArtworksProps)
    expect(queryAllByTestId("bnmo-rail-wrapper")).toHaveLength(0)
  })
})

const artworksConnectionEdges = new Array(10).fill({
  node: {
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
})

const mockProps = {
  Sale: () => ({
    artworksConnection: {
      edges: artworksConnectionEdges,
    },
  }),
}
