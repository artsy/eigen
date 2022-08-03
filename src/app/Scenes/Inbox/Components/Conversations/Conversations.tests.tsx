import { ConversationsTestsQuery } from "__generated__/ConversationsTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"

import { ConversationsContainer } from "./Conversations"

describe("messaging inbox", () => {
  const TestRenderer = () => (
    <QueryRenderer<ConversationsTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query ConversationsTestsQuery @relay_test_operation {
          me {
            ...Conversations_me
          }
        }
      `}
      variables={{}}
      render={({ error, props }) => {
        if (props?.me) {
          return <ConversationsContainer isActiveTab me={props.me} />
        } else if (error) {
          console.error(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation(mockResolvers)
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ConversationsContainer)).toHaveLength(1)
  })

  it("renders the no messages notice when there are no messages", () => {
    const wrapper = getWrapper({
      Me: () => ({
        conversations: {
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
          edges: [],
        },
      }),
    })

    expect(extractText(wrapper.root)).toContain("Keep track of your conversations with galleries")
  })
})
