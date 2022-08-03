import { OrderDetailsPaymentTestsQuery } from "__generated__/OrderDetailsPaymentTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"

import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { CreditCardSummaryItemFragmentContainer } from "./Components/OrderDetailsPayment"

describe("PaymentSection", () => {
  const TestRenderer = ({}) => (
    <QueryRenderer<OrderDetailsPaymentTestsQuery>
      environment={getRelayEnvironment()}
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

  it("renders when credit card exists", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
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
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      CommerceOrder: () => ({
        creditCard: null,
      }),
    })
    expect(extractText(tree.root.findByProps({ testID: "credit-card-null" }))).toBe("N/A")
  })
})
