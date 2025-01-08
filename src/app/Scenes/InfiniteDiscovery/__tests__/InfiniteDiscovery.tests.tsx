import { fireEvent, screen } from "@testing-library/react-native"
import {
  infiniteDiscoveryQuery,
  InfiniteDiscoveryQueryRenderer,
} from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

jest.mock("app/system/navigation/navigate")

describe("InfiniteDiscovery", () => {
  const mockNavigate = navigate as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("hides the back button if the current artwork is on the first artwork", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: InfiniteDiscoveryQueryRenderer,
      query: infiniteDiscoveryQuery,
    })
    renderWithRelay(marketingCollection)
    expect(screen.queryByText("Back")).not.toBeOnTheScreen()
  })

  it("shows the back button if the current artwork is not the first artwork", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: InfiniteDiscoveryQueryRenderer,
      query: infiniteDiscoveryQuery,
    })
    renderWithRelay(marketingCollection)
    swipeLeft()
    await screen.findByText("Back")
  })

  it("returns to the previous artwork when the back button is pressed", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: InfiniteDiscoveryQueryRenderer,
      query: infiniteDiscoveryQuery,
    })
    renderWithRelay(marketingCollection)
    expect(screen.queryByText("Back")).not.toBeOnTheScreen()
    swipeLeft()
    await screen.findByText("Back")
    fireEvent.press(screen.getByText("Back"))
    expect(screen.queryByText("Back")).not.toBeOnTheScreen()
  })

  it("navigates to home view when the exit button is pressed", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: InfiniteDiscoveryQueryRenderer,
      query: infiniteDiscoveryQuery,
    })
    renderWithRelay(marketingCollection)
    fireEvent.press(screen.getByText("Exit"))
    expect(mockNavigate).toHaveBeenCalledWith("/home-view")
  })
})

const marketingCollection = {
  MarketingCollection: () => ({
    artworksConnection: {
      edges: [
        {
          node: {
            internalID: "artwork-1",
          },
        },
        {
          node: {
            internalID: "artwork-2",
          },
        },
      ],
    },
  }),
}

const swipeLeft = () => {
  const topCard = screen.getByTestId("top-fancy-swiper-card")

  const startX = 0
  const startY = 0
  const startTimeStamp = Date.now()

  // Simulate the start of the pan gesture
  fireEvent(topCard, "responderStart", {
    touchHistory: {
      indexOfSingleActiveTouch: 1,
      mostRecentTimeStamp: startTimeStamp,
      numberActiveTouches: 1,
      touchBank: [
        undefined,
        {
          currentPageX: startX,
          currentPageY: startY,
          currentTimeStamp: startTimeStamp,
          previousPageX: startX,
          previousPageY: startY,
          previousTimeStamp: startTimeStamp,
          startPageX: startX,
          startPageY: startY,
          startTimeStamp: startTimeStamp,
          touchActive: true,
        },
      ],
    },
  })

  const moveX = -300
  const moveTimeStamp = Date.now()

  // Simulate the move during the pan gesture
  fireEvent(topCard, "responderMove", {
    touchHistory: {
      indexOfSingleActiveTouch: 1,
      mostRecentTimeStamp: moveTimeStamp,
      numberActiveTouches: 1,
      touchBank: [
        undefined,
        {
          currentPageX: moveX,
          currentPageY: startY,
          currentTimeStamp: moveTimeStamp,
          previousPageX: startX,
          previousPageY: startY,
          previousTimeStamp: startTimeStamp,
          startPageX: startX,
          startPageY: startY,
          startTimeStamp: startTimeStamp,
          touchActive: true,
        },
      ],
    },
  })

  const releaseTimeStamp = Date.now()

  // Simulate the end of the pan gesture
  fireEvent(topCard, "responderRelease", {
    touchHistory: {
      indexOfSingleActiveTouch: 1,
      mostRecentTimeStamp: releaseTimeStamp,
      numberActiveTouches: 0,
      touchBank: [
        undefined,
        {
          currentPageX: moveX,
          currentPageY: startY,
          currentTimeStamp: releaseTimeStamp,
          previousPageX: moveX,
          previousPageY: startY,
          previousTimeStamp: moveTimeStamp,
          startPageX: startX,
          startPageY: startY,
          startTimeStamp: startTimeStamp,
          touchActive: false,
        },
      ],
    },
  })
}
