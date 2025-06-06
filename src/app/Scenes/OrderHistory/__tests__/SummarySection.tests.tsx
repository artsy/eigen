import { SummarySectionTestsQuery } from "__generated__/SummarySectionTestsQuery.graphql"
import { SummarySectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/SummarySection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("SummarySection", () => {
  const { renderWithRelay } = setupTestWrapper<SummarySectionTestsQuery>({
    Component: (props) => {
      if (props?.commerceOrder) {
        return <SummarySectionFragmentContainer section={props.commerceOrder} />
      }
      return null
    },
    query: graphql`
      query SummarySectionTestsQuery @relay_test_operation {
        commerceOrder(id: "some-id") {
          internalID
          ...SummarySection_section
        }
      }
    `,
  })

  it("Render Order Summary Section ", () => {
    const tree = renderWithRelay({
      CommerceOrder: () => ({
        mode: "BUY",
        buyerTotal: "€11,200",
        taxTotal: "€0",
        shippingTotal: "€200",
        totalListPrice: "€11,000",
      }),
    })

    expect(tree.UNSAFE_getByProps({ testID: "buyerTotal" }).props.children).toBe("€11,200")
    expect(tree.UNSAFE_getByProps({ testID: "taxTotal" }).props.children).toBe("€0")
    expect(tree.UNSAFE_getByProps({ testID: "shippingTotal" }).props.children).toBe("€200")
    expect(tree.UNSAFE_getByProps({ testID: "totalListPrice" }).props.children).toBe("€11,000")
    expect(tree.UNSAFE_getByProps({ testID: "totalListPriceLabel" }).props.children).toBe("Price")
  })

  it("Render correct shipping name if shipping quote selected", () => {
    const tree = renderWithRelay({
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

    expect(tree.UNSAFE_getByProps({ testID: "shippingTotalLabel" }).props.children).toBe(
      "Second Day Air delivery"
    )
  })

  it("Render correct shipping name if shipping quote not selected", () => {
    const tree = renderWithRelay({
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

    expect(tree.UNSAFE_getByProps({ testID: "shippingTotalLabel" }).props.children).toBe("Shipping")
  })

  describe("if offer order", () => {
    it("Render correct price", () => {
      const tree = renderWithRelay({
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

      expect(tree.UNSAFE_getByProps({ testID: "offerLabel" }).props.children).toBe("Your offer")
      expect(tree.UNSAFE_getByProps({ testID: "lastOffer" }).props.children).toBe("€10,200")
    })

    it("Render counteroffer", () => {
      const tree = renderWithRelay({
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

      expect(tree.UNSAFE_getByProps({ testID: "offerLabel" }).props.children).toBe("Seller's offer")
      expect(tree.UNSAFE_getByProps({ testID: "lastOffer" }).props.children).toBe("€10,200")
    })
  })
})
