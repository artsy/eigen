import { fireEvent, screen } from "@testing-library/react-native"
import { InfiniteDiscoveryContext } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"
import { InfiniteDiscoveryHeader } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryHeader"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { action } from "easy-peasy"

jest.mock("app/system/navigation/navigate")

describe("InfiniteDiscoveryHeader", () => {
  const mockNavigate = navigate as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows the back button if the current artwork is not the first artwork", () => {
    renderWithWrappers(
      <InfiniteDiscoveryContext.Provider
        runtimeModel={{ artworkIds: ["1", "2", "3"], currentArtworkId: "2" }}
      >
        <InfiniteDiscoveryHeader />
      </InfiniteDiscoveryContext.Provider>
    )
    expect(screen.getByText("Back")).toBeOnTheScreen()
  })

  it("hides the back button if the current artwork is on the first artwork", () => {
    renderWithWrappers(
      <InfiniteDiscoveryContext.Provider
        runtimeModel={{ artworkIds: ["1", "2", "3"], currentArtworkId: "1" }}
      >
        <InfiniteDiscoveryHeader />
      </InfiniteDiscoveryContext.Provider>
    )
    expect(screen.queryByText("Back")).not.toBeOnTheScreen()
  })

  it("returns to the previous artwork when the back button is pressed", () => {
    const mockGoBack = jest.fn().mockImplementation()
    renderWithWrappers(
      <InfiniteDiscoveryContext.Provider
        runtimeModel={{
          artworkIds: ["1", "2", "3"],
          currentArtworkId: "2",
          goBack: action(mockGoBack),
        }}
      >
        <InfiniteDiscoveryHeader />
      </InfiniteDiscoveryContext.Provider>
    )
    fireEvent.press(screen.getByText("Back"))
    expect(mockGoBack).toHaveBeenCalled()
  })

  it("navigates to home view when the exit button is pressed", () => {
    renderWithWrappers(
      <InfiniteDiscoveryContext.Provider>
        <InfiniteDiscoveryHeader />
      </InfiniteDiscoveryContext.Provider>
    )
    fireEvent.press(screen.getByText("Exit"))
    expect(mockNavigate).toHaveBeenCalledWith("/home-view")
  })
})
