import { fireEvent, screen } from "@testing-library/react-native"
import { InfiniteDiscovery } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { InfiniteDiscoveryContext } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { action } from "easy-peasy"

jest.mock("app/system/navigation/navigate")

describe("InfiniteDiscovery", () => {
  const mockNavigate = navigate as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows the back button if the current artwork is not the first artwork", () => {
    renderWithWrappers(
      <InfiniteDiscoveryContext.Provider
        runtimeModel={{ artworks: ["1", "2", "3"], currentArtwork: "2" }}
      >
        <InfiniteDiscovery />
      </InfiniteDiscoveryContext.Provider>
    )
    expect(screen.getByText("Back")).toBeOnTheScreen()
  })

  it("hides the back button if the current artwork is on the first artwork", () => {
    renderWithWrappers(
      <InfiniteDiscoveryContext.Provider
        runtimeModel={{ artworks: ["1", "2", "3"], currentArtwork: "1" }}
      >
        <InfiniteDiscovery />
      </InfiniteDiscoveryContext.Provider>
    )
    expect(screen.queryByText("Back")).not.toBeOnTheScreen()
  })

  it("returns to the previous artwork when the back button is pressed", () => {
    const mockGoToPreviousArtwork = jest.fn().mockImplementation()
    renderWithWrappers(
      <InfiniteDiscoveryContext.Provider
        runtimeModel={{
          artworks: ["1", "2", "3"],
          currentArtwork: "2",
          goToPreviousArtwork: action(mockGoToPreviousArtwork),
        }}
      >
        <InfiniteDiscovery />
      </InfiniteDiscoveryContext.Provider>
    )
    fireEvent.press(screen.getByText("Back"))
    expect(mockGoToPreviousArtwork).toHaveBeenCalled()
  })

  it("navigates to home view when the exit button is pressed", () => {
    renderWithWrappers(
      <InfiniteDiscoveryContext.Provider>
        <InfiniteDiscovery />
      </InfiniteDiscoveryContext.Provider>
    )
    fireEvent.press(screen.getByText("Exit"))
    expect(mockNavigate).toHaveBeenCalledWith("/home-view")
  })
})
