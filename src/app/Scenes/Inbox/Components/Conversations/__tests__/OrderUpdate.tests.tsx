import { fireEvent } from "@testing-library/react-native"
import { OrderUpdateTestsQuery } from "__generated__/OrderUpdateTestsQuery.graphql"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import "react-native"
import { QueryRenderer, graphql } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { OrderUpdateFragmentContainer as OrderUpdate } from "app/Scenes/Inbox/Components/Conversations/OrderUpdate"

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
  })

  it("displays the seller declined event", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_rejected",
    })

    expect(getByText("Offer Declined")).toBeTruthy()
  })

  it("displays the offer expired event", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_lapsed",
      state: "CANCELED",
      stateReason: ["_lapsed"],
    })
    expect(getByText("Offer Expired")).toBeTruthy()
  })

  it("shows an offer submitted event", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: { respondsTo: null, amount: "$100" },
    })

    expect(getByText("You sent an offer for $100. See details.")).toBeTruthy()
    fireEvent.press(getByText("See details."))
    expect(navigate).toHaveBeenCalledWith("/conversation/12345/details")
  })

  it("shows a counteroffer offer from the user", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: { respondsTo: {}, amount: "$150" },
    })
    expect(getByText("You sent a counteroffer for $150")).toBeTruthy()
  })

  it("shows a counteroffer from the partner", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: {
        amount: "$200",
        respondsTo: {},
        fromParticipant: "SELLER",
        offerAmountChanged: true,
      },
    })
    expect(getByText("You received a counteroffer for $200")).toBeTruthy()
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

    expect(getByText("You purchased this artwork. See details.")).toBeTruthy()
  })

  it("shows an expired buy order", () => {
    const { getByText } = getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "buy_lapsed",
      state: "CANCELED",
      stateReason: ["_lapsed"],
    })
    expect(getByText("Purchase Expired")).toBeTruthy()
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
