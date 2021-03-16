import { ConversationTestsQuery } from "__generated__/ConversationTestsQuery.graphql"
import ConnectivityBanner from "lib/Components/ConnectivityBanner"
import Composer from "lib/Scenes/Inbox/Components/Conversations/Composer"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Touchable } from "palette"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestInstance } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Conversation, ConversationFragmentContainer } from "../Conversation"
import { ConversationDetailsQueryRenderer } from "../ConversationDetails"

jest.unmock("react-tracking")
jest.unmock("react-relay")
const mockNavigator = { push: jest.fn() }

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
  <QueryRenderer<ConversationTestsQuery>
    environment={env}
    query={graphql`
      query ConversationTestsQuery($conversationID: String!) @relay_test_operation {
        me {
          ...Conversation_me
        }
      }
    `}
    variables={{ conversationID: "conversation-id" }}
    render={({ props, error }) => {
      if (Boolean(props?.me)) {
        return <ConversationFragmentContainer me={props!.me!} navigator={mockNavigator as any} />
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

it("looks correct when rendered", () => {
  const conversation = getWrapper()
  const componentInstance = (conversation.root.findByType(Conversation).children[0] as ReactTestInstance).instance
  componentInstance.handleConnectivityChange(true)
  expect(conversation.root.findByType(Composer).props.disabled).toBeFalsy()
  expect(conversation.root.findAllByType(ConnectivityBanner)).toHaveLength(0)
})

it("looks correct when rendered", () => {
  const conversation = getWrapper()
  const componentInstance = (conversation.root.findByType(Conversation).children[0] as ReactTestInstance).instance
  componentInstance.handleConnectivityChange(false)
  expect(conversation.root.findByType(Composer).props.disabled).toBeTruthy()
  expect(conversation.root.findAllByType(ConnectivityBanner)).toHaveLength(1)
})

it("clicking on detail link opens pushes detail screen into navigator", () => {
  const conversation = getWrapper({
    Conversation: () => ({
      internalID: "123",
    }),
  })
  // @ts-ignore
  conversation.root.findAllByType(Touchable)[0].props.onPress()
  expect(mockNavigator.push).toHaveBeenCalledWith({
    component: ConversationDetailsQueryRenderer,
    passProps: { conversationID: "123" },
    title: "",
  })
})