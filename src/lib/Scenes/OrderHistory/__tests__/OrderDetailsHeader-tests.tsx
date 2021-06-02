import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { graphql } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"
import { OrderDetailsHeader, OrderDetailsHeaderFragmentContainer } from "../OrderDetails/OrderDetailsHeader"

jest.unmock("react-relay")
describe("ArtworkTileRailCard", () => {
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
          return <OrderDetailsHeaderFragmentContainer info={props.commerceOrder} />
        }
        return null
      }}
    />
  )

  it("renders auction result when auction results are available", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironmentPayload(mockEnvironment, {
      CommerceOrder: () => ({
        requestedFulfillment: {
          addressLine1: "myadress",
          city: "mycity",
          country: "mycountry",
          postalCode: "11238",
          phoneNumber: "7777",
          region: "myregion",
        },
      }),
    })

    // expect(tree.findByProps({ testID: "addressLine1" }).props.children).toBe("myadress")
    // expect(tree.findByProps({ testID: "city" }).props.children).toBe("mycity")
    // expect(tree.findByProps({ testID: "region" }).props.children).toBe("myregion")
  })
})
