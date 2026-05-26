import { screen } from "@testing-library/react-native"
import { Message } from "app/Scenes/Inbox/Components/Conversations/Message"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import moment from "moment"

describe("Message", () => {
  it("renders body text for a regular message", () => {
    renderWithWrappers(<Message message={mockMessage} conversationId="conversation-123" />)

    expect(
      screen.getByText(
        "Hi, I'm interested in purchasing this work. Could you please provide more information about the piece, including price?"
      )
    ).toBeOnTheScreen()
  })

  it("renders null when body is empty and isFirstMessage is false", () => {
    const { toJSON } = renderWithWrappers(
      <Message message={{ ...mockMessage, body: null }} conversationId="conversation-123" />
    )

    expect(toJSON()).toBeNull()
  })

  describe("first message with formattedFirstMessage", () => {
    it("renders formattedFirstMessage instead of body", () => {
      renderWithWrappers(
        <Message
          message={{ ...mockMessage, isFirstMessage: true }}
          conversationId="conversation-123"
          formattedFirstMessage="I'm interested in information regarding:
• Shipping quote"
        />
      )

      expect(screen.getByText(/I'm interested in information regarding:/)).toBeOnTheScreen()
      expect(
        screen.queryByText(
          "Hi, I'm interested in purchasing this work. Could you please provide more information about the piece, including price?"
        )
      ).not.toBeOnTheScreen()
    })

    it("falls back to body when formattedFirstMessage is not provided", () => {
      renderWithWrappers(
        <Message
          message={{ ...mockMessage, isFirstMessage: true }}
          conversationId="conversation-123"
        />
      )

      expect(
        screen.getByText(
          "Hi, I'm interested in purchasing this work. Could you please provide more information about the piece, including price?"
        )
      ).toBeOnTheScreen()
    })
  })
})

const mockMessage: any = {
  key: 0,
  internalID: "message-1",
  createdAt: moment().subtract(1, "year").toISOString(),
  body: "Hi, I'm interested in purchasing this work. Could you please provide more information about the piece, including price?",
  isFromUser: true,
  attachments: [],
  from: {
    name: "Percy",
    email: "percy@cat.com",
  },
  invoice: {
    state: "UNPAID",
    total: "$420",
    payment_url: "https://www.adopt-cats.org/pay-here",
  },
}
