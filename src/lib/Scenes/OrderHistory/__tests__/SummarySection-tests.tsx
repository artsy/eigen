import { SummarySectionTestsQuery } from "__generated__/SummarySectionTestsQuery.graphql"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { SummarySectionFragmentContainer } from "../OrderDetails/Components/SummarySection"

jest.unmock("react-relay")

describe("SummarySection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<SummarySectionTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SummarySectionTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            internalID
            ...SummarySection_section
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <SummarySectionFragmentContainer section={props.commerceOrder} />
        }
        return null
      }}
    />
  )
  it("Render Order Summary Section ", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironmentPayload(mockEnvironment, {
      CommerceOrder: () => ({
        buyerTotal: "€11,200",
        taxTotal: "€0",
        shippingTotal: "€200",
        totalListPrice: "€11,000",
      }),
    })

    expect(tree.findByProps({ testID: "buyerTotal" }).props.children).toBe("€11,200")
    expect(tree.findByProps({ testID: "taxTotal" }).props.children).toBe("€0")
    expect(tree.findByProps({ testID: "shippingTotal" }).props.children).toBe("€200")
    expect(tree.findByProps({ testID: "totalListPrice" }).props.children).toBe("€11,000")
  })
})
