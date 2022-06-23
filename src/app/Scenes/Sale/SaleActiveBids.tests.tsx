import { SaleActiveBidsTestsQuery } from "__generated__/SaleActiveBidsTestsQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { SaleActiveBidItemContainer } from "./Components/SaleActiveBidItem"
import { SaleActiveBidsContainer } from "./Components/SaleActiveBids"

jest.unmock("react-relay")

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
    const tree = renderWithWrappers(<TestRenderer />)

    const mockProps = {
      Me: () => ({
        lotStandings: [],
      }),
    }
    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(FlatList)).toHaveLength(0)
  })

  it("renders list of lots if the user has active lots standing", () => {
    const tree = renderWithWrappers(<TestRenderer />)

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
