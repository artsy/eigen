import { ConversationDetailsFragmentContainer } from "app/Scenes/Inbox/Screens/ConversationDetails"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ConversationDetailsFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ({ me }: any) => <ConversationDetailsFragmentContainer me={me} />,
    query: graphql`
      query ConversationDetails_Test_Query($conversationID: String!) {
        me {
          ...ConversationDetails_me
        }
      }
    `,
    variables: {
      conversationID: "test-conversation",
    },
  })

  it("render all elements", () => {
    const { getByText } = renderWithRelay()

    expect(getByText(/Order No/)).toBeDefined()
    expect(getByText("Ship to")).toBeDefined()
    expect(getByText("Payment Method")).toBeDefined()
    expect(getByText("Attachments")).toBeDefined()
    expect(getByText("Support")).toBeDefined()
    expect(getByText("Inquiries FAQ")).toBeDefined()
  })

  it("does not render order information given no order/offer present", () => {
    const { queryByText } = renderWithRelay({
      Conversation: () => ({
        orderConnection: {
          edges: [{ node: null }],
        },
      }),
    })

    expect(queryByText(/Order No/)).toBeNull()
    expect(queryByText("Ship to")).toBeNull()
    expect(queryByText("Payment Method")).toBeNull()
  })
})
