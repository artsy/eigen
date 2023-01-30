import { WirePaymentSectionTestsQuery } from "__generated__/WirePaymentSectionTestsQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { WirePaymentSectionFragmentContainer } from "./Components/WirePaymentSection"

const order = {
  code: "111111111",
}

describe("WirePaymentSection", () => {
  const { renderWithRelay } = setupTestWrapper<WirePaymentSectionTestsQuery>({
    Component: (props) => {
      if (props?.commerceOrder) {
        return <WirePaymentSectionFragmentContainer order={props.commerceOrder} />
      }
      return null
    },
    query: graphql`
      query WirePaymentSectionTestsQuery @relay_test_operation {
        commerceOrder(id: "some-id") {
          ...WirePaymentSection_order
        }
      }
    `,
  })

  it("renders section", async () => {
    const { getByText } = renderWithRelay({ CommerceOrder: () => order })

    expect(getByText("Proceed with the wire transfer to complete your purchase")).toBeTruthy()
    expect(getByText("Send wire transfer to")).toBeTruthy()
    expect(getByText("Bank address")).toBeTruthy()
    expect(getByText(order.code)).toBeTruthy()
  })
})
