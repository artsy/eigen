import { SummarySectionTestsQuery } from "__generated__/SummarySectionTestsQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { SummarySectionFragmentContainer } from "./OrderDetails/Components/SummarySection"

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
    resolveMostRecentRelayOperation(mockEnvironment, {
      CommerceOrder: () => ({
        mode: "BUY",
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
    expect(tree.findByProps({ testID: "totalListPriceLabel" }).props.children).toBe("Price")
  })

  it("Render correct shipping name if shipping quote selected", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment, {
      CommerceOrder: () => ({
        lineItems: {
          edges: [
            {
              node: {
                selectedShippingQuote: {
                  displayName: "Second Day Air",
                },
              },
            },
          ],
        },
      }),
    })

    expect(tree.findByProps({ testID: "shippingTotalLabel" }).props.children).toBe(
      "Second Day Air delivery"
    )
  })

  it("Render correct shipping name if shipping quote not selected", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment, {
      CommerceOrder: () => ({
        lineItems: {
          edges: [
            {
              node: {
                selectedShippingQuote: {
                  displayName: null,
                },
              },
            },
          ],
        },
      }),
    })

    expect(tree.findByProps({ testID: "shippingTotalLabel" }).props.children).toBe("Shipping")
  })

  describe("if offer order", () => {
    it("Render correct price", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
        CommerceOrder: () => ({
          mode: "OFFER",
          buyerTotal: "€10,400",
          taxTotal: "€0",
          shippingTotal: "€200",
          totalListPrice: "€11,000",
          lastOffer: {
            amount: "€10,200",
            fromParticipant: "BUYER",
          },
        }),
      })

      expect(tree.findByProps({ testID: "offerLabel" }).props.children).toBe("Your offer")
      expect(tree.findByProps({ testID: "lastOffer" }).props.children).toBe("€10,200")
    })

    it("Render counteroffer", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
        CommerceOrder: () => ({
          mode: "OFFER",
          buyerTotal: "€10,400",
          taxTotal: "€0",
          shippingTotal: "€200",
          totalListPrice: "€11,000",
          lastOffer: {
            amount: "€10,200",
            fromParticipant: "SELLER",
          },
        }),
      })

      expect(tree.findByProps({ testID: "offerLabel" }).props.children).toBe("Seller's offer")
      expect(tree.findByProps({ testID: "lastOffer" }).props.children).toBe("€10,200")
    })
  })
})
