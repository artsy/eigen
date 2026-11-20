import { screen } from "@testing-library/react-native"
import { SaleActiveBidsTestsQuery } from "__generated__/SaleActiveBidsTestsQuery.graphql"
import { SaleActiveBidsContainer } from "app/Scenes/Sale/Components/SaleActiveBids"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
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

  it("renders no items if the user has no active lots standing", async () => {
    await renderWithWrappers(<TestRenderer />)

    const mockProps = {
      Me: () => ({
        lotStandings: [],
      }),
    }
    await resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(screen.queryByText("Your Active Bids")).not.toBeOnTheScreen()
    expect(screen.queryAllByRole("button")).toHaveLength(0)
  })

  it("renders list of lots if the user has active lots standing", async () => {
    await renderWithWrappers(<TestRenderer />)

    const mockProps = {
      Me: () => ({
        lotStandings,
      }),
    }
    await resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(screen.getByText("Your Active Bids")).toBeOnTheScreen()
    // Each SaleActiveBidItem renders a single pressable row
    expect(screen.getAllByRole("button")).toHaveLength(10)
  })
})

const lotStandings = new Array(10).fill({
  saleArtwork: {
    slug: "random-slug",
  },
})
