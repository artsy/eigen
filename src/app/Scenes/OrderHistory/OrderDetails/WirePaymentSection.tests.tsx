import { WirePaymentSectionTestsQuery } from "__generated__/WirePaymentSectionTestsQuery.graphql"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { WirePaymentSectionFragmentContainer } from "./Components/WirePaymentSection"


const order = {
  code: "111111111",
}

describe("WirePaymentSection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestWrapper = () => (
    <QueryRenderer<WirePaymentSectionTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query WirePaymentSectionTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            ...WirePaymentSection_order
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <WirePaymentSectionFragmentContainer order={props.commerceOrder} />
        }
        return null
      }}
    />
  )

  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  it("renders section", async () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, { CommerceOrder: () => order })

    expect(getByText("Proceed with the wire transfer to complete your purchase")).toBeTruthy()
    expect(getByText("Send wire transfer to")).toBeTruthy()
    expect(getByText("Bank address")).toBeTruthy()
    expect(getByText(order.code)).toBeTruthy()
  })
})
