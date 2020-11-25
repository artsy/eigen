import { InboxTestsQuery } from "__generated__/InboxTestsQuery.graphql"
import { press } from "lib/Scenes/Artwork/Components/CommercialButtons/__tests__/helpers"
import { ConversationsContainer } from "lib/Scenes/Inbox/Components/Conversations/Conversations"
import { MyBidsContainer } from "lib/Scenes/MyBids/MyBids"
import { extractText } from "lib/tests/extractText"
import { RelayMockEnvironment } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { Environment } from "relay-runtime"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { Inbox as ActualInbox, InboxContainer } from "../Inbox/Inbox"

jest.unmock("react-relay")

jest.mock("lib/Scenes/Inbox/Components/Conversations/Conversations", () => {
  return {
    ConversationsContainer: () => "(The ConversationsContainer)",
  }
})

jest.mock("lib/Scenes/MyBids/MyBids", () => {
  return {
    MyBidsContainer: () => "(The MyBidsContainer)",
  }
})

let env: RelayMockEnvironment

const getWrapper = (mockResolvers: MockResolvers = {}) => {
  env = createMockEnvironment()

  const TestRenderer = () => (
    <QueryRenderer<InboxTestsQuery>
      environment={env}
      variables={{}}
      query={graphql`
        query InboxTestsQuery @relay_test_operation {
          me {
            ...Inbox_me
          }
        }
      `}
      render={({ props, error }) => {
        if (props) {
          return <InboxContainer me={props!.me!} isVisible={true} />
        } else if (error) {
          console.error(error)
        }
      }}
    />
  )

  const wrapper = renderWithWrappers(<TestRenderer />)

  env.mock.resolveMostRecentOperation((operation) => {
    return MockPayloadGenerator.generate(operation, mockResolvers)
  })

  return wrapper
}

const emptyMeProps = {
  lotStandingsExistenceCheck: { edges: [] },
  conversationsExistenceCheck: { edges: [] },
}

it("Shows a zero state when there are no bids/conversations", () => {
  const tree = getWrapper({
    Me: () => emptyMeProps,
  })
  expect(extractText(tree.root)).toContain("Buying art on Artsy is simple")
})

it("renders without throwing an error", () => {
  getWrapper({})
})

it("renders bids tab by default when bids are enabled", () => {
  const tree = getWrapper()

  expect(tree.root.findAllByType(MyBidsContainer).length).toEqual(1)
})

it("renders inquiries tab when inquiries tab is selected", async () => {
  const tree = getWrapper()

  await press(tree.root, { text: "Inquiries", componentType: Text })
  expect(tree.root.findAllByType(ConversationsContainer).length).toEqual(1)
})

it("requests a relay refetch when fetchData is called in ZeroState", () => {
  const relayEmptyProps = {
    me: emptyMeProps,
    isVisible: true,
    relay: {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      environment: null as Environment,
      refetch: jest.fn(),
    },
  }

  const inbox = new ActualInbox(relayEmptyProps as any)
  inbox.setState = jest.fn()

  inbox.fetchData()
  expect(relayEmptyProps.relay.refetch).toBeCalled()
})
