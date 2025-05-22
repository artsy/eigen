import { screen } from "@testing-library/react-native"
import { OrderDetailsPaymentTestsQuery } from "__generated__/OrderDetailsPaymentTestsQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { PaymentMethodSummaryItemFragmentContainer } from "./Components/OrderDetailsPayment"

describe("PaymentSection", () => {
  const { renderWithRelay } = setupTestWrapper<OrderDetailsPaymentTestsQuery>({
    Component: (props) => <PaymentMethodSummaryItemFragmentContainer order={props.order} />,
    query: graphql`
      query OrderDetailsPaymentTestsQuery($orderID: ID!) @relay_test_operation {
        order: commerceOrder(id: $orderID) {
          ...OrderDetailsPayment_order
        }
      }
    `,
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders when payment method is credit card", () => {
    renderWithRelay({
      CommerceOrder: () => ({
        paymentMethodDetails: { __typename: "CreditCard", brand: "visa", lastDigits: "4242" },
      }),
    })

    expect(screen.getByText("visa ending in 4242")).toBeOnTheScreen()
  })

  it("renders when payment method is apple pay", () => {
    renderWithRelay({
      CommerceOrder: () => ({
        paymentMethodDetails: { __typename: "CreditCard", brand: "visa", lastDigits: "4242" },
        creditCardWalletType: "apple_pay",
      }),
    })

    expect(screen.getByText("Apple Pay")).toBeOnTheScreen()
  })

  it("renders when payment method is google pay", () => {
    renderWithRelay({
      CommerceOrder: () => ({
        paymentMethodDetails: { __typename: "CreditCard", brand: "visa", lastDigits: "4242" },
        creditCardWalletType: "google_pay",
      }),
    })

    expect(screen.getByText("Google Pay")).toBeOnTheScreen()
  })

  it("renders when payment method is wire transfer", () => {
    renderWithRelay({
      CommerceOrder: () => ({ paymentMethodDetails: { __typename: "WireTransfer" } }),
    })

    expect(screen.getByText("Wire transfer")).toBeOnTheScreen()
  })

  it("renders when payment method is bank transfer", () => {
    renderWithRelay({
      CommerceOrder: () => ({ paymentMethodDetails: { __typename: "BankAccount", last4: "4242" } }),
    })

    expect(screen.getByText("Bank transfer •••• 4242")).toBeOnTheScreen()
  })

  it("renders when payment method doesn't exist", () => {
    renderWithRelay({ CommerceOrder: () => ({ paymentMethodDetails: null }) })

    expect(screen.getByText("N/A")).toBeOnTheScreen()
  })
})
