import { fireEvent, screen } from "@testing-library/react-native"
import {
  infiniteDiscoveryQuery,
  InfiniteDiscoveryWithSuspense,
} from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { InfiniteDiscoveryContext } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { action } from "easy-peasy"

jest.mock("app/system/navigation/navigate")

describe("InfiniteDiscovery", () => {
  const mockNavigate = navigate as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows the back button if the current artwork is not the first artwork", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <InfiniteDiscoveryContext.Provider
          runtimeModel={{
            count: 3,
            currentIndex: 1,
          }}
        >
          <InfiniteDiscoveryWithSuspense />
        </InfiniteDiscoveryContext.Provider>
      ),
      query: infiniteDiscoveryQuery,
    })
    renderWithRelay()
    expect(screen.getByText("Back")).toBeOnTheScreen()
  })

  it("hides the back button if the current artwork is on the first artwork", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <InfiniteDiscoveryContext.Provider
          runtimeModel={{
            count: 3,
            currentIndex: 0,
          }}
        >
          <InfiniteDiscoveryWithSuspense />
        </InfiniteDiscoveryContext.Provider>
      ),
      query: infiniteDiscoveryQuery,
    })
    renderWithRelay()
    expect(screen.queryByText("Back")).not.toBeOnTheScreen()
  })

  it("returns to the previous artwork when the back button is pressed", () => {
    const mockGoToPrevious = jest.fn().mockImplementation()
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <InfiniteDiscoveryContext.Provider
          runtimeModel={{
            count: 3,
            currentIndex: 1,
            goToPrevious: action(mockGoToPrevious),
          }}
        >
          <InfiniteDiscoveryWithSuspense />
        </InfiniteDiscoveryContext.Provider>
      ),
      query: infiniteDiscoveryQuery,
    })
    renderWithRelay()
    fireEvent.press(screen.getByText("Back"))
    expect(mockGoToPrevious).toHaveBeenCalled()
  })

  it("navigates to home view when the exit button is pressed", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <InfiniteDiscoveryContext.Provider
          runtimeModel={{
            count: 3,
            currentIndex: 1,
          }}
        >
          <InfiniteDiscoveryWithSuspense />
        </InfiniteDiscoveryContext.Provider>
      ),
      query: infiniteDiscoveryQuery,
    })
    renderWithRelay()
    fireEvent.press(screen.getByText("Exit"))
    expect(mockNavigate).toHaveBeenCalledWith("/home-view")
  })
})
