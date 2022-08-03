import { SoldBySectionTestsQuery } from "__generated__/SoldBySectionTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { SoldBySectionFragmentContainer } from "./Components/SoldBySection"

describe("SoldBySection", () => {
  const TestRenderer = () => (
    <QueryRenderer<SoldBySectionTestsQuery>
      environment={getRelayEnvironment()}
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
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation({
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
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation({
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
