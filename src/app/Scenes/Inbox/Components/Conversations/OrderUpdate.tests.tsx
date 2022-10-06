import { OrderUpdateTestsQuery } from "__generated__/OrderUpdateTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
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
    const { getByText } = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_approved",
      state: "APPROVED",
    })
    expect(getByText("Offer Accepted")).toBeTruthy()
    // expect(extractText(tree.root)).not.toMatch("See details")
  })

  it("displays the seller declined event", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_rejected",
    })

    expect(getByText("Offer Declined")).toBeTruthy()
    // expect(extractText(tree.root)).not.toMatch("See details")
  })

  it("displays the offer expired event", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_lapsed",
      state: "CANCELED",
      stateReason: ["_lapsed"],
    })
    expect(getByText("Offer Expired")).toBeTruthy()
    // expect(extractText(tree.root)).not.toMatch("See details")
  })

  it("shows an offer submitted event", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: { respondsTo: null },
    })
    expect(getByText("You sent an offer")).toBeTruthy()
    // expect(extractText(tree.root)).toMatch("See details")

    // tree.root.findByType(LinkText).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/conversation/12345/details")
  })

  it("shows a counteroffer offer from the user", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: { respondsTo: {} },
    })
    expect(getByText("You sent a counteroffer")).toBeTruthy()
    // expect(extractText(tree.root)).not.toMatch("See details")
  })

  it("shows a counteroffer from the partner", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: {
        respondsTo: {},
        fromParticipant: "SELLER",
        offerAmountChanged: true,
      },
    })
    expect(getByText("You received a counteroffer")).toBeTruthy()
    // expect(extractText(tree.root)).not.toMatch("See details")
  })

  it("shows an accepted offer from the partner with pending action", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: {
        respondsTo: {},
        fromParticipant: "SELLER",
        offerAmountChanged: false,
      },
    })
    expect(getByText("Offer Accepted - Pending Action")).toBeTruthy()
    // expect(extractText(tree.root)).not.toMatch("See details")
  })

  it("shows buy order processing approval", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "buy_processing_approval",
    })
    expect(getByText("Order approved. Payment Processing")).toBeTruthy()
  })

  it("shows offer order processing approval", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_processing_approval",
    })
    expect(getByText("Offer accepted. Payment Processing")).toBeTruthy()
  })

  it("shows a submitted buy order", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "buy_submitted",
    })
    expect(getByText("You purchased this artwork")).toBeTruthy()
    // expect(extractText(tree.root)).toMatch("See details")
  })

  it("shows an expired buy order", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "buy_lapsed",
      state: "CANCELED",
      stateReason: ["_lapsed"],
    })
    expect(getByText("Purchase Expired")).toBeTruthy()
    // expect(extractText(tree.root)).toMatch("See details")
  })
  it("shows an approved buy order", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "buy_approved",
      state: "APPROVED",
    })
    expect(getByText("Purchase Accepted")).toBeTruthy()
  })
})
