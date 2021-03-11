import React from "react"

import { MessagesTestsQuery } from "__generated__/MessagesTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
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
