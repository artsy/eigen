import { PaymentMethod_Test_Query } from "__generated__/PaymentMethod_Test_Query.graphql"
import { PaymentMethodFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/PaymentMethod"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("PaymentMethodFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapper<PaymentMethod_Test_Query>({
    Component: ({ me }) => {
      return (
        <PaymentMethodFragmentContainer
          order={me!.conversation!.orderConnection!.edges![0]!.node!}
        />
      )
    },
    query: graphql`
      query PaymentMethod_Test_Query {
        me {
          conversation(id: "test-id") {
            orderConnection(first: 10) {
              edges {
                node {
                  ...PaymentMethod_order
                }
              }
            }
          }
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
              creditCard: {
                lastDigits: "1234",
                expirationMonth: "2",
                expirationYear: "2022",
              },
            },
          },
        ],
      }),
    })

    expect(getByText("Payment Method")).toBeDefined()
    expect(getByText("•••• 1234 Exp 02/22")).toBeDefined()
  })
})
