import { screen, fireEvent } from "@testing-library/react-native"
import { Support } from "app/Scenes/Inbox/Components/Conversations/Support"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Support", () => {
  it("render", () => {
    renderWithWrappers(<Support conversationID="test-conversation-id" />)

    expect(screen.getByText("Support")).toBeOnTheScreen()
    expect(screen.getByText("Inquiries FAQ")).toBeOnTheScreen()
  })

  it("tracks analytics event when Inquiries FAQ link is tapped", () => {
    renderWithWrappers(<Support conversationID="test-conversation-id" />)

    fireEvent.press(screen.getByText("Inquiries FAQ"))

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedVisitHelpCenter",
      context_module: "conversations",
      context_screen_owner_id: "test-conversation-id",
      context_screen_owner_type: "conversation",
      destination_screen_owner_type: "articles",
      destination_screen_owner_slug: "0TO3b000000UevEGAS/contacting-a-gallery",
      flow: "Inquiry",
    })
  })
})
