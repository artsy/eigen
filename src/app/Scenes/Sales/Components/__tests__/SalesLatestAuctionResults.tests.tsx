import { fireEvent, screen } from "@testing-library/react-native"
import { SalesLatestAuctionResultsQuery } from "__generated__/SalesLatestAuctionResultsQuery.graphql"
import {
  SalesLatestAuctionResultsQueryRenderer,
  SalesLatestAuctionResultsScreenQuery,
} from "app/Scenes/Sales/Components/SalesLatestAuctionResults"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SalesLatestAuctionResults", () => {
  const { renderWithRelay } = setupTestWrapper<SalesLatestAuctionResultsQuery>({
    Component: () => <SalesLatestAuctionResultsQueryRenderer />,
    query: SalesLatestAuctionResultsScreenQuery,
  })

  it("renders without throwing errors", () => {
    renderWithRelay()

    expect(screen.getByText("Auction Results for Artists You Follow")).toBeOnTheScreen()
  })

  it("navigates and tracks header tap with the correct event data", () => {
    renderWithRelay()

    const header = screen.getByText("Auction Results for Artists You Follow")

    fireEvent.press(header)

    expect(navigate).toHaveBeenCalledWith("/auction-results-for-artists-you-follow")
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedAuctionResultGroup",
      context_module: "auctionResultsForArtistsYouFollow",
      context_screen_owner_type: "sale",
      destination_screen_owner_type: "auctionResultsForArtistsYouFollow",
      type: "header",
    })
  })
})
