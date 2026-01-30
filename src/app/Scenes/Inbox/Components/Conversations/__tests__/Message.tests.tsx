import Message from "app/Scenes/Inbox/Components/Conversations/Message"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { DateTime } from "luxon"
import "react-native"

it("renders without throwing an error", () => {
  const messageBody =
    "Hi, I'm interested in purchasing this work. Could you please provide more information about the piece, including price?"
  const props = {
    key: 0,
    createdAt: DateTime.now().minus({ years: 1 }).toISO(),
    body: messageBody,
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
  renderWithWrappersLEGACY(<Message conversationId="420" showTimeSince message={props as any} />)
})
