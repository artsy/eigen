import { OrderDetailsPaymentTestsQuery } from "__generated__/OrderDetailsPaymentTestsQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { PaymentMethodSummaryItemFragmentContainer } from "./Components/OrderDetailsPayment"

jest.unmock("react-relay")

describe("PaymentSection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = ({}) => (
    <QueryRenderer<OrderDetailsPaymentTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query OrderDetailsPaymentTestsQuery($orderID: ID!) @relay_test_operation {
          order: commerceOrder(id: $orderID) {
            ...OrderDetailsPayment_order
          }
        }
      `}
      variables={{ orderID: "uhi" }}
      render={({ props }) => {
        if (props?.order) {
          return <PaymentMethodSummaryItemFragmentContainer order={props.order} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders when payment method is credit card", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
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
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      CommerceOrder: () => ({
        paymentMethodDetails: {
          __typename: "WireTransfer",
        },
      }),
    })

    expect(getByText("Wire transfer")).toBeTruthy()
  })

  it("renders when payment method is bank transfer", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
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
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      CommerceOrder: () => ({
        paymentMethodDetails: null,
      }),
    })

    expect(getByText("N/A")).toBeTruthy()
  })
})
