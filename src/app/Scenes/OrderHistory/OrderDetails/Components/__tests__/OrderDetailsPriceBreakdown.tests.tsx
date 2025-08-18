import { fireEvent, screen } from "@testing-library/react-native"
import { OrderDetailsPriceBreakdown } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsPriceBreakdown"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("OrderDetailsPriceBreakdown", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => <OrderDetailsPriceBreakdown order={props.me.order} />,
    query: graphql`
      query OrderDetailsPriceBreakdownTestsQuery @relay_test_operation {
        me {
          order(id: "test-order") {
            ...OrderDetailsPriceBreakdown_order
          }
        }
      }
    `,
  })

  it("renders pricing breakdown lines", () => {
    renderWithRelay({
      Order: () => ({
        pricingBreakdownLines: [
          {
            __typename: "SubtotalLine",
            displayName: "Price",
            amount: { amount: "1000", currencySymbol: "$" },
          },
          {
            __typename: "ShippingLine",
            displayName: "Standard Shipping",
            amount: { amount: "42.99", currencySymbol: "$" },
          },
          {
            __typename: "TaxLine",
            displayName: "Tax",
            amount: { amount: "99.58", currencySymbol: "$" },
          },
          {
            __typename: "TotalLine",
            displayName: "Total",
            amount: { display: "US$1052.57" },
          },
        ],
      }),
    })

    // Subtotal
    expect(screen.getByText("Price")).toBeOnTheScreen()
    expect(screen.getByText("$1000")).toBeOnTheScreen()

    // Shipping
    expect(screen.getByText("Standard Shipping")).toBeOnTheScreen()
    expect(screen.getByText("$42.99")).toBeOnTheScreen()

    // Tax
    expect(screen.getByText("Tax*")).toBeOnTheScreen()
    expect(screen.getByText("$99.58")).toBeOnTheScreen()

    // Total
    expect(screen.getByText("Total")).toBeOnTheScreen()
    expect(screen.getByText("US$1052.57")).toBeOnTheScreen()
  })

  it("renders import tax disclaimer with link", () => {
    renderWithRelay({
      Order: () => ({ mode: "OFFER", internalID: "order-id" }),
    })

    expect(screen.getByText("*Additional duties and taxes may apply at import.")).toBeOnTheScreen()
    expect(screen.getByText("may apply at import")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("may apply at import"))

    expect(navigate).toHaveBeenCalledWith(
      "https://support.artsy.net/s/article/How-are-taxes-and-customs-fees-calculated"
    )

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedImportFees",
          "context_module": "ordersDetail",
          "context_screen_owner_id": "order-id",
          "context_screen_owner_type": "orders-detail",
          "destination_screen_owner_slug": "How-are-taxes-and-customs-fees-calculated",
          "destination_screen_owner_type": "articles",
          "flow": "Make offer",
        },
      ]
    `)
  })
})
