import { act, fireEvent, screen } from "@testing-library/react-native"
import { OrderUpdateTestsQuery } from "__generated__/OrderUpdateTestsQuery.graphql"
import { OrderUpdateFragmentContainer as OrderUpdate } from "app/Scenes/Inbox/Components/Conversations/OrderUpdate"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import "react-native"
import { QueryRenderer, graphql } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

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

const getWrapper = async (event = {}) => {
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
  const view = await renderWithWrappers(<TestRenderer />)
  const finalResolvers = { Conversation: () => mockConversation }
  await act(() => {
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, finalResolvers)
    )
  })
  return view
}

it("renders without throwing an error", async () => {
  await getWrapper({ __typename: "CommerceOrderStateChangedEvent", state: "APPROVED" })
})

describe("OrderUpdate with order updates", () => {
  it("displays the offer approved event", async () => {
    await getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_approved",
      state: "APPROVED",
    })
    expect(screen.getByText("Offer Accepted")).toBeTruthy()
  })

  it("displays the seller declined event", async () => {
    await getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_rejected",
    })

    expect(screen.getByText("Offer Declined")).toBeTruthy()
  })

  it("displays the offer expired event", async () => {
    await getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_lapsed",
      state: "CANCELED",
      stateReason: ["_lapsed"],
    })
    expect(screen.getByText("Offer Expired")).toBeTruthy()
  })

  it("shows an offer submitted event", async () => {
    await getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: { respondsTo: null, amount: "$100" },
    })

    expect(screen.getByText("You sent an offer for $100. See details.")).toBeTruthy()
    await fireEvent.press(screen.getByText("See details."))
    expect(navigate).toHaveBeenCalledWith("/conversation/12345/details")
  })

  it("shows a counteroffer offer from the user", async () => {
    await getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: { respondsTo: {}, amount: "$150" },
    })
    expect(screen.getByText("You sent a counteroffer for $150")).toBeTruthy()
  })

  it("shows a counteroffer from the partner", async () => {
    await getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: {
        amount: "$200",
        respondsTo: {},
        fromParticipant: "SELLER",
        offerAmountChanged: true,
      },
    })
    expect(screen.getByText("You received a counteroffer for $200")).toBeTruthy()
  })

  it("shows an accepted offer from the partner with pending action", async () => {
    await getWrapper({
      __typename: "CommerceOfferSubmittedEvent",
      offer: {
        respondsTo: {},
        fromParticipant: "SELLER",
        offerAmountChanged: false,
      },
    })
    expect(screen.getByText("Offer Accepted - Pending Action")).toBeTruthy()
  })

  it("shows buy order processing approval", async () => {
    await getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "buy_processing_approval",
    })
    expect(screen.getByText("Order approved. Payment Processing")).toBeTruthy()
  })

  it("shows offer order processing approval", async () => {
    await getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "offer_processing_approval",
    })
    expect(screen.getByText("Offer accepted. Payment Processing")).toBeTruthy()
  })

  it("shows a submitted buy order", async () => {
    await getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "buy_submitted",
    })

    expect(screen.getByText("You purchased this artwork. See details.")).toBeTruthy()
  })

  it("shows an expired buy order", async () => {
    await getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "buy_lapsed",
      state: "CANCELED",
      stateReason: ["_lapsed"],
    })
    expect(screen.getByText("Purchase Expired")).toBeTruthy()
  })
  it("shows an approved buy order", async () => {
    await getWrapper({
      __typename: "CommerceOrderStateChangedEvent",
      orderUpdateState: "buy_approved",
      state: "APPROVED",
    })
    expect(screen.getByText("Purchase Accepted")).toBeTruthy()
  })
})
