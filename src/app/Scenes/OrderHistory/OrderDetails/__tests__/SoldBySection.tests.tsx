import { SoldBySectionTestsQuery } from "__generated__/SoldBySectionTestsQuery.graphql"
import { SoldBySectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/SoldBySection"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("SoldBySection", () => {
  const { renderWithRelay } = setupTestWrapper<SoldBySectionTestsQuery>({
    Component: (props) => {
      if (props?.commerceOrder) {
        return <SoldBySectionFragmentContainer soldBy={props.commerceOrder} />
      }
      return null
    },
    query: graphql`
      query SoldBySectionTestsQuery @relay_test_operation {
        commerceOrder(id: "some-id") {
          ...SoldBySection_soldBy
        }
      }
    `,
  })

  it("renders correctly for shipping fulfillment", () => {
    const tree = renderWithRelay({
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

    expect(tree.UNSAFE_getByProps({ testID: "delivery" }).props.children).toBe("Aug 10, 2021")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "soldByInfo" }))).toBe(
      "Ships from Minsk, Belarus"
    )
  })

  it("renders correctly for pick up fulfillment", () => {
    const tree = renderWithRelay({
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

    expect(tree.UNSAFE_getByProps({ testID: "delivery" }).props.children).toBe("Aug 10, 2021")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "soldByInfo" }))).toBe(
      "Pick up (Minsk, Belarus)"
    )
  })
})
