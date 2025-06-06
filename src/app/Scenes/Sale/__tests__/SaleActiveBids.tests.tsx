import { SaleActiveBidsTestsQuery } from "__generated__/SaleActiveBidsTestsQuery.graphql"
import { SaleActiveBidItemContainer } from "app/Scenes/Sale/Components/SaleActiveBidItem"
import { SaleActiveBidsContainer } from "app/Scenes/Sale/Components/SaleActiveBids"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("SaleActiveBids", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<SaleActiveBidsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleActiveBidsTestsQuery($saleID: String!) @relay_test_operation {
          me {
            ...SaleActiveBids_me @arguments(saleID: $saleID)
          }
        }
      `}
      variables={{ saleID: "sale-id" }}
      render={({ props }) => {
        if (props?.me) {
          return <SaleActiveBidsContainer me={props.me} saleID="sale-id" />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders no items if the user has no active lots standing", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    const mockProps = {
      Me: () => ({
        lotStandings: [],
      }),
    }
    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(FlatList)).toHaveLength(0)
  })

  it("renders list of lots if the user has active lots standing", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    const mockProps = {
      Me: () => ({
        lotStandings,
      }),
    }
    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(FlatList)).toHaveLength(1)
    expect(tree.root.findAllByType(SaleActiveBidItemContainer)).toHaveLength(10)
  })
})

const lotStandings = new Array(10).fill({
  saleArtwork: {
    slug: "random-slug",
  },
})
