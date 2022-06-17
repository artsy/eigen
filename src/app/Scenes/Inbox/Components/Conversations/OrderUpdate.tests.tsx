import React from "react"

import { OrderUpdateTestsQuery } from "__generated__/OrderUpdateTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { AlertCircleFillIcon, LinkText, MoneyFillIcon } from "palette"
import "react-native"
import { QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { graphql } from "relay-runtime"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { OrderUpdateFragmentContainer as OrderUpdate } from "./OrderUpdate"

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
        return <OrderUpdate event={event} conversationId="12345" />
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
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, finalResolvers)
    )
  })
  return tree
}

it("renders without throwing an error", () => {
  getWrapper({ __typename: "CommerceOrderStateChangedEvent", state: "APPROVED" })
})

describe("OrderUpdate with order updates", () => {
  it("displays the offer approved event", () => {
    const tree = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_approved",
    })

    expect(extractText(tree.root)).toMatch("Offer Accepted")
    expect(extractText(tree.root)).not.toMatch("See details")
    tree.root.findByType(MoneyFillIcon)
  })

  it("displays the seller declined event", () => {
    const tree = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_rejected",
    })

    expect(extractText(tree.root)).toMatch("Offer Declined")
    expect(extractText(tree.root)).not.toMatch("See details")
    tree.root.findByType(MoneyFillIcon)
  })

  it("displays the buyer declined event", () => {
    const tree = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_rejected",
    })

    expect(extractText(tree.root)).toMatch("Offer Declined")
    expect(extractText(tree.root)).not.toMatch("See details")
    tree.root.findByType(MoneyFillIcon)
  })

  it("displays the offer expired event", () => {
    const tree = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_lapsed",
    })

    expect(extractText(tree.root)).toMatch("Offer Expired")
    expect(extractText(tree.root)).not.toMatch("See details")
    tree.root.findByType(MoneyFillIcon)
  })

  it("shows an offer submitted event", () => {
    const tree = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: { respondsTo: null },
    })

    expect(extractText(tree.root)).toMatch("You sent an offer")
    expect(extractText(tree.root)).toMatch("See details")
    tree.root.findByType(MoneyFillIcon)

    tree.root.findByType(LinkText).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/conversation/12345/details")
  })

  it("shows a counteroffer offer from the user", () => {
    const tree = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: { respondsTo: {} },
    })

    expect(extractText(tree.root)).toMatch("You sent a counteroffer")
    expect(extractText(tree.root)).not.toMatch("See details")
    tree.root.findByType(MoneyFillIcon)
  })

  it("shows a counteroffer from the partner", () => {
    const tree = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: {
        respondsTo: {},
        fromParticipant: "SELLER",
        offerAmountChanged: true,
      },
    })

    expect(extractText(tree.root)).toMatch("You received a counteroffer")
    expect(extractText(tree.root)).not.toMatch("See details")
    tree.root.findByType(AlertCircleFillIcon)
  })

  it("shows an accepted offer from the partner with pending action", () => {
    const tree = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: {
        respondsTo: {},
        fromParticipant: "SELLER",
        offerAmountChanged: false,
      },
    })

    expect(extractText(tree.root)).toMatch("Offer Accepted - Pending Action")
    expect(extractText(tree.root)).not.toMatch("See details")
    tree.root.findByType(AlertCircleFillIcon)
  })

  it("shows an approved buy order", () => {
    const tree = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "buy_submitted",
    })

    expect(extractText(tree.root)).toMatch("You purchased this artwork")
    expect(extractText(tree.root)).toMatch("See details")
    tree.root.findByType(MoneyFillIcon)
  })
})
