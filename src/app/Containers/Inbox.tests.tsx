import { InboxTestsQuery } from "__generated__/InboxTestsQuery.graphql"
import { ConversationsContainer } from "app/Scenes/Inbox/Components/Conversations/Conversations"
import { MyBidsContainer } from "app/Scenes/MyBids/MyBids"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"

import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { InboxContainer } from "./Inbox"

jest.unmock("react-native-scrollable-tab-view")

jest.mock("app/Scenes/Inbox/Components/Conversations/Conversations", () => {
  return {
    ConversationsContainer: () => "(The ConversationsContainer)",
  }
})

jest.mock("app/Scenes/MyBids/MyBids", () => {
  return {
    MyBidsContainer: () => "(The MyBidsContainer)",
  }
})

const getWrapper = (mockResolvers: MockResolvers = {}) => {
  const TestRenderer = () => (
    <QueryRenderer<InboxTestsQuery>
      environment={getMockRelayEnvironment()}
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
          return <InboxContainer me={props!.me!} isVisible />
        } else if (error) {
          console.error(error)
        }
      }}
    />
  )

  const wrapper = renderWithWrappersLEGACY(<TestRenderer />)

  resolveMostRecentRelayOperation(mockResolvers)
  return wrapper
}

it("renders without throwing an error", () => {
  getWrapper()
})

it("renders bids tab by default when bids are enabled", () => {
  const tree = getWrapper()
  expect(tree.root.findAllByType(MyBidsContainer).length).toEqual(1)
  expect(tree.root.findAllByType(ConversationsContainer).length).toEqual(0)
})
