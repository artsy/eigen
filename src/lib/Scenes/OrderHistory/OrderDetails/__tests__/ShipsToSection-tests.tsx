import { ShipsToSectionTestsQuery } from "__generated__/ShipsToSectionTestsQuery.graphql"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ShipsToSectionFragmentContainer } from "../Components/ShipsToSection"

jest.unmock("react-relay")

describe("ShipsToSection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<ShipsToSectionTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ShipsToSectionTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            internalID
            ...ShipsToSection_address
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <ShipsToSectionFragmentContainer address={props.commerceOrder} />
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

    expect(tree.findByProps({ testID: "addressLine1" }).props.children).toBe("myadress")
    expect(tree.findByProps({ testID: "city" }).props.children).toBe("mycity")
    expect(tree.findByProps({ testID: "region" }).props.children).toBe("myregion")
    expect(tree.findByProps({ testID: "phoneNumber" }).props.children).toBe("7777")
    expect(tree.findByProps({ testID: "country" }).props.children).toBe("mycountry")
    expect(tree.findByProps({ testID: "postalCode" }).props.children).toBe("11238")
  })
})
