import React from "react"

import { OrderUpdateTestsQuery } from "__generated__/OrderUpdateTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Icon } from "palette"
import "react-native"
import { QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { graphql } from "relay-runtime"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { OrderUpdateFragmentContainer as OrderUpdate } from "../OrderUpdate"

jest.unmock("react-relay")

jest.mock("@react-native-community/netinfo", () => {
  return {
    addEventListener: jest.fn(),
    isConnected: {
      fetch: () => {
        return new Promise((accept) => {
          accept(false)
        })
      },
      addEventListener: jest.fn(),
    },
  }
})

let env: ReturnType<typeof createMockEnvironment>

beforeEach(() => {
  env = createMockEnvironment()
})

const TestRenderer = () => (
  <QueryRenderer<OrderUpdateTestsQuery>
    environment={env}
    query={graphql`
      query OrderUpdateTestsQuery($conversationID: String!) @relay_test_operation {
        me {
          conversation(id: $conversationID) {
            orderConnection(first: 10, participantType: BUYER) {
              edges {
                node {
                  orderHistory {
                    __typename
                    ...OrderUpdate_event
                  }
                }
              }
            }
          }
        }
      }
    `}
    variables={{ conversationID: "conversation-id" }}
    render={({ props, error }) => {
      if (Boolean(props?.me)) {
        const event = props!.me!.conversation!.orderConnection!.edges![0]!.node!.orderHistory[0]
        return <OrderUpdate event={event} />
      } else if (Boolean(error)) {
        console.log(error)
      }
    }}
  />
)

const getWrapper = (event = {}) => {
  const mockConversation = {
    orderConnection: {
      edges: [
        {
          node: {
            orderHistory: [event],
          },
        },
      ],
    },
  }
  const tree = renderWithWrappers(<TestRenderer />)
  const finalResolvers = { Conversation: () => mockConversation }
  act(() => {
    env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, finalResolvers))
  })
  return tree
}

it("renders without throwing an error", () => {
  getWrapper({ __typename: "CommerceOrderStateChangedEvent", state: "APPROVED" })
})

describe("OrderUpdate with order updates", () => {
  it("displays the offer approved event", () => {
    const tree = getWrapper({ __typename: "CommerceOrderStateChangedEvent", state: "APPROVED" })

    expect(extractText(tree.root)).toMatch("Offer Accepted")
  })

  it("displays the seller declined event", () => {
    const tree = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      state: "CANCELED",
      stateReason: "seller_rejected",
    })

    expect(extractText(tree.root)).toMatch("Offer Declined")
  })

  it.skip("displays the buyer declined event", () => {
    const tree = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      state: "CANCELED",
      stateReason: "buyer_rejected",
    })

    expect(extractText(tree.root)).toMatch("Offer Declined")
  })

  it("displays the offer expired event", () => {
    const tree = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      state: "CANCELED",
      stateReason: "someone_lapsed",
    })

    expect(extractText(tree.root)).toMatch("Offer Expired")
  })

  it("shows an offer submitted event", () => {
    const tree = getWrapper({ __typename: "CommerceOfferSubmittedEvent", offer: { respondsTo: null } })

    expect(extractText(tree.root)).toMatch("You sent an offer")
  })

  it("shows a counteroffer offer from the user", () => {
    const tree = getWrapper({ __typename: "CommerceOfferSubmittedEvent", offer: { respondsTo: {} } })

    expect(extractText(tree.root)).toMatch("You sent a counteroffer")
  })

  it("shows a counteroffer from the partner", () => {
    const tree = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: {
        respondsTo: {},
        fromParticipant: "SELLER",
      },
    })

    expect(extractText(tree.root)).toMatch("You received a counteroffer")
  })
})
