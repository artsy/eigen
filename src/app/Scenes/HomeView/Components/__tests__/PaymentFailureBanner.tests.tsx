import { screen } from "@testing-library/react-native"
import { PaymentFailureBanner } from "app/Scenes/HomeView/Components/PaymentFailureBanner"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("PaymentFailureBanner", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: PaymentFailureBanner,
    query: graphql`
      query PaymentFailureBannerTestsQuery {
        commerceMyOrders(first: 10, filters: [PAYMENT_FAILED]) {
          edges {
            node {
              code
              internalID
            }
          }
        }
      }
    `,
    variables: {},
  })

  it("renders the error banner when a single payment has failed", async () => {
    renderWithRelay({
      CommerceMyOrders: () => ({
        edges: [
          {
            node: {
              code: "order-1",
              internalID: "1",
            },
          },
        ],
      }),
    })

    expect(
      screen.getByText("Payment failed for your recent order. Update payment method.")
    ).toBeTruthy()
  })

  it("renders the error banner when multiple payments have failed", async () => {
    renderWithRelay({
      CommerceMyOrders: () => ({
        edges: [
          {
            node: {
              code: "order-1",
              internalID: "1",
            },
          },
          {
            node: {
              code: "order-2",
              internalID: "2",
            },
          },
        ],
      }),
    })

    expect(
      screen.getByText(
        "Payment failed for your recent orders. Update payment method for each order."
      )
    ).toBeTruthy()
  })

  it("does not render the banner when there are no payment failures", async () => {
    renderWithRelay({
      CommerceMyOrders: () => ({
        edges: [],
      }),
    })

    expect(screen.queryByText("Payment failed for your recent orders.")).toBeNull()
  })
})
