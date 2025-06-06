import { OrderInformation_Test_Query } from "__generated__/OrderInformation_Test_Query.graphql"
import { OrderInformationFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/OrderInformation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("PaymentMethodFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapper<OrderInformation_Test_Query>({
    Component: ({ me, artwork }) => {
      return (
        <OrderInformationFragmentContainer
          artwork={artwork!}
          order={me!.conversation!.orderConnection!.edges![0]!.node!}
        />
      )
    },
    query: graphql`
      query OrderInformation_Test_Query {
        me {
          conversation(id: "test-id") {
            orderConnection(first: 10) {
              edges {
                node {
                  ...OrderInformation_order
                }
              }
            }
          }
        }
        artwork(id: "test-artwork") {
          ...OrderInformation_artwork
        }
      }
    `,
  })

  it("render", () => {
    const { getByText } = renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              __typename: "CommerceOfferOrder",
              code: "1234",
              shippingTotal: "$100.00",
              taxTotal: "$0.00",
              buyerTotal: "$1,100.00",
              lastOffer: {
                amount: "$900.00",
                fromParticipant: "BUYER",
              },
            },
          },
        ],
      }),
      Artwork: () => ({
        listPrice: {
          __typename: "Money",
          display: "$1,000.00",
        },
      }),
    })

    expect(getByText("Order No. 1234")).toBeDefined()
    expect(getByText("Your offer")).toBeDefined()
    expect(getByText("$900.00")).toBeDefined()
    expect(getByText("List price")).toBeDefined()
    expect(getByText("$1,000.00")).toBeDefined()
    expect(getByText("Shipping")).toBeDefined()
    expect(getByText("$100.00")).toBeDefined()
    expect(getByText("Tax")).toBeDefined()
    expect(getByText("$0.00")).toBeDefined()
    expect(getByText("Total")).toBeDefined()
    expect(getByText("$1,100.00")).toBeDefined()
  })

  it("render given last offer from seller", () => {
    const { getByText } = renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              __typename: "CommerceOfferOrder",
              lastOffer: {
                amount: "$200.00",
                fromParticipant: "SELLER",
              },
            },
          },
        ],
      }),
    })

    expect(getByText("Seller's offer")).toBeDefined()
    expect(getByText("$200.00")).toBeDefined()
  })
})
