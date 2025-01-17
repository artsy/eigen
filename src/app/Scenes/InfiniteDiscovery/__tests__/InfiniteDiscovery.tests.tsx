import { fireEvent, screen } from "@testing-library/react-native"
import { swipeLeft } from "app/Components/FancySwiper/__tests__/utils"
import {
  infiniteDiscoveryQuery,
  InfiniteDiscoveryQueryRenderer,
} from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { goBack } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

jest.mock("app/system/navigation/navigate")
jest.mock("app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet", () => ({
  InfiniteDiscoveryBottomSheet: () => null,
}))

describe("InfiniteDiscovery", () => {
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
    expect(goBack).toHaveBeenCalledTimes(1)
  })
})

const marketingCollection = {
  ArtworkConnection: () => ({
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
      {
        node: {
          internalID: "artwork-3",
        },
      },
    ],
  }),
}
