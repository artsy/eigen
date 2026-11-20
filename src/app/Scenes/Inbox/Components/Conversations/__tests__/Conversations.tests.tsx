import { act, screen } from "@testing-library/react-native"
import { ConversationsTestsQuery } from "__generated__/ConversationsTestsQuery.graphql"
import { ConversationsContainer } from "app/Scenes/Inbox/Components/Conversations/Conversations"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
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

  const renderAndResolve = async (mockResolvers = {}) => {
    await renderWithWrappers(<TestRenderer />)
    await act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
  }

  it("renders without throwing an error", async () => {
    await renderAndResolve()
    // The inbox header is the first thing ConversationsContainer renders.
    expect(screen.getByText(/^Inbox/)).toBeOnTheScreen()
  })

  it("renders the no messages notice when there are no messages", async () => {
    await renderAndResolve({
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

    expect(screen.getByText(/Keep track of your conversations with galleries/)).toBeOnTheScreen()
  })
})
