import { SoldBySectionTestsQuery } from "__generated__/SoldBySectionTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { SoldBySectionFragmentContainer } from "./Components/SoldBySection"

jest.unmock("react-relay")

describe("SoldBySection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<SoldBySectionTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SoldBySectionTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            ...SoldBySection_soldBy
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <SoldBySectionFragmentContainer soldBy={props.commerceOrder} />
        }
        return null
      }}
    />
  )
  it("renders correctly for shipping fulfillment", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment, {
      CommerceOrder: () => ({
        requestedFulfillment: {
          __typename: "CommerceShip",
        },
        lineItems: {
          edges: [
            {
              node: {
                artwork: {
                  shippingOrigin: "Minsk, Belarus",
                },
                fulfillments: {
                  edges: [
                    {
                      node: {
                        estimatedDelivery: "2021-08-10T03:00:00+03:00",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      }),
    })

    expect(tree.findByProps({ testID: "delivery" }).props.children).toBe("Aug 10, 2021")
    expect(extractText(tree.findByProps({ testID: "soldByInfo" }))).toBe(
      "Ships from Minsk, Belarus"
    )
  })

  it("renders correctly for pick up fulfillment", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment, {
      CommerceOrder: () => ({
        requestedFulfillment: {
          __typename: "CommercePickup",
        },
        lineItems: {
          edges: [
            {
              node: {
                artwork: {
                  shippingOrigin: "Minsk, Belarus",
                },
                fulfillments: {
                  edges: [
                    {
                      node: {
                        estimatedDelivery: "2021-08-10T03:00:00+03:00",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      }),
    })

    expect(tree.findByProps({ testID: "delivery" }).props.children).toBe("Aug 10, 2021")
    expect(extractText(tree.findByProps({ testID: "soldByInfo" }))).toBe("Pick up (Minsk, Belarus)")
  })
})
