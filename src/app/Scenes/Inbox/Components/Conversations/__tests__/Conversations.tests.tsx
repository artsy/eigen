import { ConversationsTestsQuery } from "__generated__/ConversationsTestsQuery.graphql"
import { ConversationsContainer } from "app/Scenes/Inbox/Components/Conversations/Conversations"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("messaging inbox", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ConversationsTestsQuery>
      environment={env}
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
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
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
