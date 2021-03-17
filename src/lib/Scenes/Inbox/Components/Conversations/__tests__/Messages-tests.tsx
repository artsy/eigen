import { MessagesTestsQuery } from "__generated__/MessagesTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import "react-native"
import { QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { graphql } from "relay-runtime"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import Messages from "../Messages"

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
        return <Messages conversation={props!.me!.conversation!} />
      } else if (Boolean(error)) {
        console.log(error)
      }
    }}
  />
)

const getWrapper = (mockResolvers = {}) => {
  const tree = renderWithWrappers(<TestRenderer />)
  act(() => {
    env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
  })
  return tree
}

it("renders without throwing an error", () => {
  getWrapper()
})

const withMessages = (wrapperGetter: typeof getWrapper, { events, messages }: { events: any; messages: any }) => {
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
    const tree = getWrapper({
      CommerceOrderConnectionWithTotalCount: () => {
        return {
          edges: [
            {
              node: {
                orderHistory: [
                  {
                    __typename: "CommerceOfferSubmittedEvent",
                    offer: {
                      respondsTo: null,
                    },
                  },
                ],
              },
            },
          ],
        }
      },
    })

    expect(extractText(tree.root)).toMatch("You sent an offer for")
  })

  fit("sorts interleaved items by date", () => {
    const day1Time1 = "2020-03-18T02:58:37.699Z"
    const day1Time2 = "2020-03-18T02:59:37.699Z"
    const day2Time1 = "2020-03-19T01:58:37.699Z"
    const day2Time2 = "2020-03-19T01:59:37.699Z"

    const tree = withMessages(getWrapper, {
      messages: [
        { createdAt: day1Time1, body: "Day 1 first message", attachments: [] },
        { createdAt: day2Time1, body: "Day 2 first message", attachments: [] },
      ],
      events: [
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
          },
          createdAt: day2Time2,
        },
      ],
    })
    // get all elements and remove timestamps - messages print in reverse order
    const messagesAndUpdates = tree.root
      .findAllByType(Text)
      .filter((element) => element.props.color !== "black30")
      .map((element) => extractText(element))
    console.log("MESSAGES AND UPDATES", messagesAndUpdates.length)

    messagesAndUpdates.forEach((element) => {
      const text = extractText(element)
    })

    const text0 = extractText(messagesAndUpdates[0])
    console.log("TEXT 0", text0)
    console.log("TEXT 1", extractText(messagesAndUpdates[1]))
    console.log("TEXT 2", extractText(messagesAndUpdates[2]))
    console.log("TEXT 3", extractText(messagesAndUpdates[3]))

    expect(messagesAndUpdates[0]).toContain("You sent an offer")
    expect(messagesAndUpdates[0]).toContain("Day 2 first message")
    expect(messagesAndUpdates[0]).toContain("You recieved a counteroffer")
    expect(messagesAndUpdates[0]).toContain("Day 1 first message")
  })
})
