import { screen } from "@testing-library/react-native"
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
    renderWithRelay()

    expect(screen.getByText(/Order No/)).toBeDefined()
    expect(screen.getByText("Ship to")).toBeDefined()
    expect(screen.getByText("Payment Method")).toBeDefined()
    expect(screen.getByText("Attachments")).toBeDefined()
    expect(screen.getByText("Support")).toBeDefined()
    expect(screen.getByText("Inquiries FAQ")).toBeDefined()
  })

  it("does not render order information given no order/offer present", () => {
    renderWithRelay({
      Conversation: () => ({
        orderConnection: {
          edges: [{ node: null }],
        },
      }),
    })

    expect(screen.queryByText(/Order No/)).toBeNull()
    expect(screen.queryByText("Ship to")).toBeNull()
    expect(screen.queryByText("Payment Method")).toBeNull()
  })
})
