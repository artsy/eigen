import { OrderDetailsPaymentTestsQuery } from "__generated__/OrderDetailsPaymentTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { CreditCardSummaryItemFragmentContainer } from "./Components/OrderDetailsPayment"

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
          return <CreditCardSummaryItemFragmentContainer order={props.order} />
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

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  it("renders when credit card exists", () => {
    const tree = getWrapper({
      CommerceOrder: () => ({
        creditCard: {
          brand: "visa",
          lastDigits: "4242",
        },
      }),
    })

    expect(extractText(tree.root.findByProps({ testID: "credit-card-info" }))).toEqual(
      `visa ending in 4242`
    )
  })

  it("renders when credit card doesn't exist", () => {
    const tree = getWrapper({
      CommerceOrder: () => ({
        creditCard: null,
      }),
    })
    expect(extractText(tree.root.findByProps({ testID: "credit-card-null" }))).toBe("N/A")
  })
})
