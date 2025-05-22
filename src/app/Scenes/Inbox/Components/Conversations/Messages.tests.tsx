import { Text } from "@artsy/palette-mobile"
import { MessagesTestsQuery } from "__generated__/MessagesTestsQuery.graphql"
import { ToastComponent } from "app/Components/Toast/ToastComponent"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { RefreshControl } from "react-native"
import { QueryRenderer, graphql } from "react-relay"
import { act } from "react-test-renderer"
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils"
import Messages from "./Messages"

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
  jest.useFakeTimers({ legacyFakeTimers: true })
  env = createMockEnvironment()
})

afterEach(() => {
  jest.useRealTimers()
})

const onRefresh = jest.fn()

const TestRenderer = () => (
  <QueryRenderer<MessagesTestsQuery>
    environment={env}
    query={graphql`
      query MessagesTestsQuery($conversationID: String!) @relay_test_operation {
        me {
          conversation(id: $conversationID) {
            ...Messages_conversation
          }
        }
      }
    `}
    variables={{ conversationID: "conversation-id" }}
    render={({ props, error }) => {
      if (Boolean(props?.me)) {
        return <Messages conversation={props!.me!.conversation!} onRefresh={onRefresh} />
      } else if (Boolean(error)) {
        console.log(error)
      }
    }}
  />
)

const getWrapper = (mockResolvers = {}) => {
  const tree = renderWithWrappersLEGACY(<TestRenderer />)
  act(() => {
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )
  })
  return tree
}

it("renders without throwing an error", () => {
  getWrapper()
})

it("calls onRefresh prop when the messages are refreshed", () => {
  const wrapper = getWrapper()

  expect(onRefresh).not.toHaveBeenCalled()
  wrapper.root.findByType(RefreshControl).props.onRefresh()
  expect(onRefresh).toHaveBeenCalled()
})

/**
 * Helper to mock the messages and conversation.
 * Currently the conversation must start with a message so that is included in the defaults.
 */
const withConversationItems = (
  wrapperGetter: typeof getWrapper,
  {
    events = [],
    messages = [
      { createdAt: new Date("1970-12-25").toISOString(), body: "First message", attachments: [] },
    ],
  }: { events?: any; messages?: any }
) => {
  return wrapperGetter({
    CommerceOrderConnectionWithTotalCount() {
      return {
        edges: [
          {
            node: {
              orderHistory: events,
            },
          },
        ],
      }
    },
    MessageConnection() {
      return {
        edges: messages.map((message: any) => ({ node: message })),
      }
    },
  })
}

describe("messages with order updates", () => {
  it("shows a submitted offer", () => {
    const tree = withConversationItems(getWrapper, {
      events: [
        {
          __typename: "CommerceOfferSubmittedEvent",
          offer: {
            respondsTo: null,
          },
          createdAt: new Date().toISOString(),
        },
      ],
    })

    expect(extractText(tree.root)).toMatch("You sent an offer for")
  })

  it("shows a toast message", () => {
    const tree = withConversationItems(getWrapper, {
      events: [
        {
          __typename: "CommerceOfferSubmittedEvent",
          offer: {
            respondsTo: null,
          },
          createdAt: new Date().toISOString(),
        },
      ],
    })

    expect(extractText(tree.root)).toMatch(
      "To be covered by the Artsy Guarantee, always communicate and pay through the Artsy platform."
    )

    const toast = tree.root.findAllByType(ToastComponent)[0]
    expect(toast).toBeDefined()
  })

  it("sorts interleaved items by date", () => {
    const day1Time1 = "2020-03-18T02:58:37.699Z"
    const day1Time2 = "2020-03-18T02:59:37.699Z"
    const day2Time1 = "2020-03-19T01:58:37.699Z"
    const day2Time2 = "2020-03-19T01:59:37.699Z"

    const tree = withConversationItems(getWrapper, {
      messages: [
        { createdAt: day1Time1, body: "Day 1 message", attachments: [] },
        { createdAt: day2Time1, body: "Day 2 message", attachments: [] },
      ],
      events: [
        // this event should be omitted from the output because it is irrelevant
        {
          __typename: "CommerceOrderStateChangedEvent",
          state: "SUBMITTED",
          createdAt: day1Time2,
        },
        {
          __typename: "CommerceOfferSubmittedEvent",
          offer: {
            respondsTo: null,
          },
          createdAt: day1Time2,
        },
        {
          __typename: "CommerceOfferSubmittedEvent",
          offer: {
            respondsTo: {},
            fromParticipant: "SELLER",
            offerAmountChanged: true,
          },
          createdAt: day2Time2,
        },
      ],
    })
    // get all elements and remove timestamps
    const messagesAndUpdates = tree.root
      .findAllByType(Text)
      .filter((element) => element.props.color !== "mono60")
      .map((element) => extractText(element))

    // messages print in reverse order because FlatList is inverted
    expect(messagesAndUpdates[5]).toContain("Day 1 message")
    expect(messagesAndUpdates[3]).toContain("You sent an offer")
    expect(messagesAndUpdates[2]).toContain("Day 2 message")
    expect(messagesAndUpdates[1]).toContain("You received a counteroffer")
  })

  it("removes 'Offer accepted' events when payment fails", () => {
    const day1Time1 = "2020-03-18T02:58:37.699Z"
    const day1Time2 = "2020-03-18T02:59:37.699Z"

    const tree = withConversationItems(getWrapper, {
      events: [
        // this event should be omitted from the output because it is irrelevant
        {
          __typename: "CommerceOrderStateChangedEvent",
          state: "APPROVED",
          createdAt: day1Time1,
        },
        {
          __typename: "CommerceOrderStateChangedEvent",
          state: "SUBMITTED",
          createdAt: day1Time2,
        },
      ],
    })
    // get all elements and remove timestamps
    const messagesAndUpdates = tree.root
      .findAllByType(Text)
      .filter((element) => element.props.color !== "mono30")
      .map((element) => extractText(element))

    expect(messagesAndUpdates).not.toContain("Offer Accepted")
  })

  it("does not remove 'Offer accepted' events when payment succeeds", () => {
    const day1Time1 = "2020-03-18T02:58:37.699Z"
    const day1Time2 = "2020-03-18T02:59:37.699Z"
    const tree = withConversationItems(getWrapper, {
      events: [
        {
          __typename: "CommerceOrderStateChangedEvent",
          orderUpdateState: "offer_approved",
          state: "APPROVED",
          createdAt: day1Time1,
        },
        {
          __typename: "CommerceOfferSubmittedEvent",
          offer: {
            respondsTo: null,
          },
          createdAt: day1Time2,
        },
      ],
    })
    // get all elements and remove timestamps
    const messagesAndUpdates = tree.root
      .findAllByType(Text)
      .filter((element) => element.props.color !== "mono30")
      .map((element) => extractText(element))
    expect(messagesAndUpdates).toContain("Offer Accepted")
  })

  // We fetch all order updates but only paginated messages, so this is to avoid a smooshed list of updates at the top.
  it("shows order updates before the currently-available messages", () => {
    const beforeLastMessageTime = "2020-03-18T02:58:37.699Z"
    const beforeLastMessageTime2 = "2020-03-18T02:59:37.699Z"
    const lastMessageTime = "2020-03-19T01:58:37.699Z"
    const afterLastMessageTime = "2020-03-19T01:59:37.699Z"

    const tree = withConversationItems(getWrapper, {
      messages: [{ createdAt: lastMessageTime, body: "Last Message", attachments: [] }],
      events: [
        {
          __typename: "CommerceOfferSubmittedEvent",
          offer: {
            respondsTo: null,
            amount: 10,
          },
          createdAt: beforeLastMessageTime,
        },
        {
          __typename: "CommerceOfferSubmittedEvent",
          offer: {
            respondsTo: {},
            fromParticipant: "SELLER",
            offerAmountChanged: true,
            amount: 11,
          },
          createdAt: beforeLastMessageTime2,
        },
        {
          __typename: "CommerceOfferSubmittedEvent",
          offer: {
            respondsTo: {},
            fromParticipant: "BUYER",
            amount: 12,
          },
          createdAt: afterLastMessageTime,
        },
      ],
    })
    expect(extractText(tree.root)).toContain("You sent an offer for 10")
    expect(extractText(tree.root)).toContain("You received a counteroffer for 11")
    expect(extractText(tree.root)).toContain("You sent a counteroffer for 12")
  })
})
