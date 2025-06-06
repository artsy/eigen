import { SellerReplyEstimate_Test_Query } from "__generated__/SellerReplyEstimate_Test_Query.graphql"
import { SellerReplyEstimateFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/SellerReplyEstimate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("SellerReplyEstimateFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapper<SellerReplyEstimate_Test_Query>({
    Component: ({ me }) => {
      return (
        <SellerReplyEstimateFragmentContainer
          order={me!.conversation!.orderConnection!.edges![0]!.node!}
        />
      )
    },
    query: graphql`
      query SellerReplyEstimate_Test_Query {
        me {
          conversation(id: "test-id") {
            orderConnection(first: 10) {
              edges {
                node {
                  ...SellerReplyEstimate_order
                }
              }
            }
          }
        }
      }
    `,
  })

  it("render given order state submitted", () => {
    const { getByText } = renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              displayState: "SUBMITTED",
              stateExpiresAt: "Dec 5",
            },
          },
        ],
      }),
    })

    expect(
      getByText(
        "The seller will respond to your offer by Dec 5. Keep in mind making an offer doesn’t guarantee you the work."
      )
    ).toBeDefined()
  })

  it("render given order state approved", () => {
    const { getByText } = renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              displayState: "APPROVED",
            },
          },
        ],
      }),
    })

    expect(
      getByText(
        "Thank you for your purchase. You will be notified when the work has shipped, typically within 5–7 business days."
      )
    ).toBeDefined()
  })

  it("render given order state processing and displayName Rush", () => {
    const { getByText } = renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              displayState: "PROCESSING",
              lineItems: {
                edges: [
                  {
                    node: {
                      selectedShippingQuote: {
                        displayName: "Rush",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      }),
    })

    expect(
      getByText(
        "Your order will be delivered in 1 business day once shipped, plus up to 7 days processing time."
      )
    ).toBeDefined()
  })

  it("render given order state processing and displayName Express", () => {
    const { getByText } = renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              displayState: "PROCESSING",
              lineItems: {
                edges: [
                  {
                    node: {
                      selectedShippingQuote: {
                        displayName: "Express",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      }),
    })

    expect(
      getByText(
        "Your order will be delivered in 2 business days once shipped, plus up to 7 days processing time."
      )
    ).toBeDefined()
  })

  it("render given order state processing and displayName Standard", () => {
    const { getByText } = renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              displayState: "PROCESSING",
              lineItems: {
                edges: [
                  {
                    node: {
                      selectedShippingQuote: {
                        displayName: "Standard",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      }),
    })

    expect(
      getByText(
        "Your order will be delivered in 3-5 business days once shipped, plus up to 7 days processing time."
      )
    ).toBeDefined()
  })

  it("does not render given unsupported order state", () => {
    const { queryAllByText } = renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              displayState: "UNSUPPORTED",
            },
          },
        ],
      }),
    })

    expect(queryAllByText(/./)).toHaveLength(0)
  })
})
