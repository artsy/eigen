import { fireEvent, screen } from "@testing-library/react-native"
import { SalesScreen, SUPPORT_ARTICLE_URL } from "app/Scenes/Sales/Sales"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("Sales", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <SalesScreen />,
  })

  it("renders without Errors", () => {
    renderWithRelay()

    expect(screen.getByTestId("Sales-Screen-ScrollView")).toBeOnTheScreen()
  })

  it("tracks article tap with the correct event data", () => {
    renderWithRelay()

    const learnMoreLink = screen.getByText("Learn more about bidding on Artsy.")
    fireEvent.press(learnMoreLink)

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedLink",
      context_module: "header",
      context_screen_owner_type: "auctions",
      destination_path: SUPPORT_ARTICLE_URL,
    })

    expect(navigate).toHaveBeenCalledWith(SUPPORT_ARTICLE_URL)
  })
})
