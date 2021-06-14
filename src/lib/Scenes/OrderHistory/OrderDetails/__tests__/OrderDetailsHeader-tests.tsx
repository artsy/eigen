import { OrderDetailsHeaderTestsQuery } from "__generated__/OrderDetailsHeaderTestsQuery.graphql"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"
import { OrderDetailsHeaderFragmentContainer } from "../Components/OrderDetailsHeader"

jest.unmock("react-relay")
describe("OrderDetailsHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))
  const TestRenderer = () => (
    <QueryRenderer<OrderDetailsHeaderTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query OrderDetailsHeaderTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            ...OrderDetailsHeader_info
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <OrderDetailsHeaderFragmentContainer info={props.commerceOrder as any} />
        }
        return null
      }}
    />
  )

  it("renders createAt data code fields", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironmentPayload(mockEnvironment, {
      CommerceOrder: () => ({
        code: "075381384",
        createdAt: "2021-06-02T14:51:19+03:00",
        requestedFulfillment: { __typename: "CommerceShip" },
      }),
    })

    expect(tree.findByProps({ testID: "commerceShip" }).props.children).toBe("Delivery")
    expect(tree.findByProps({ testID: "code" }).props.children).toBe("075381384")
    expect(tree.findByProps({ testID: "date" }).props.children).toBe("Jun 2, 2021")
  })
})
