import { screen } from "@testing-library/react-native"
import { MedianSalePriceAtAuction } from "app/Scenes/MyCollection/Screens/Insights/MedianSalePriceAtAuction"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("MedianSalePriceAtAuction", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props) => (
      <MedianSalePriceAtAuction artistID="artist-id" initialCategory="Painting" {...props} />
    ),
  })

  it("renders title", async () => {
    renderWithRelay()

    await flushPromiseQueue()

    expect(screen.getByTestId("Median_Auction_Price_title")).toBeTruthy()
  })
})
