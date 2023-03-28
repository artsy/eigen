import { OrderDetailsPaymentTestsQuery } from "__generated__/OrderDetailsPaymentTestsQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { PaymentMethodSummaryItemFragmentContainer } from "./Components/OrderDetailsPayment"

describe("PaymentSection", () => {
  const { renderWithRelay } = setupTestWrapper<OrderDetailsPaymentTestsQuery>({
    Component: (props) => {
      if (props?.order) {
        return <PaymentMethodSummaryItemFragmentContainer order={props.order} />
      }
      return null
    },
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
    const { getByText } = renderWithRelay({
      CommerceOrder: () => ({
        paymentMethodDetails: {
          __typename: "CreditCard",
          brand: "visa",
          lastDigits: "4242",
        },
      }),
    })

    expect(getByText("visa ending in 4242")).toBeTruthy()
  })

  it("renders when payment method is wire transfer", () => {
    const { getByText } = renderWithRelay({
      CommerceOrder: () => ({
        paymentMethodDetails: {
          __typename: "WireTransfer",
        },
      }),
    })

    expect(getByText("Wire transfer")).toBeTruthy()
  })

  it("renders when payment method is bank transfer", () => {
    const { getByText } = renderWithRelay({
      CommerceOrder: () => ({
        paymentMethodDetails: {
          __typename: "BankAccount",
          last4: "4242",
        },
      }),
    })

    expect(getByText("Bank transfer •••• 4242")).toBeTruthy()
  })

  it("renders when payment method doesn't exist", () => {
    const { getByText } = renderWithRelay({
      CommerceOrder: () => ({
        paymentMethodDetails: null,
      }),
    })

    expect(getByText("N/A")).toBeTruthy()
  })
})
