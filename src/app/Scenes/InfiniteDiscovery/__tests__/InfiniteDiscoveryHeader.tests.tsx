import { fireEvent, screen } from "@testing-library/react-native"
import InfiniteDiscoveryHeader from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryHeader"
import useInfiniteDiscovery from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscovery"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscovery")
jest.mock("app/system/navigation/navigate")

describe("InfiniteDiscoveryHeader", () => {
  const mockUseInfiniteDiscovery = useInfiniteDiscovery as jest.Mock
  const mockNavigate = navigate as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows the back button if the current artwork is not the first artwork", () => {
    mockUseInfiniteDiscovery.mockReturnValue({
      artworkIds: ["1", "2", "3"],
      currentArtworkId: "2",
    })
    renderWithWrappers(<InfiniteDiscoveryHeader />)
    expect(screen.getByText("Back")).toBeOnTheScreen()
  })

  it("hides the back button if the current artwork is on the first artwork", () => {
    mockUseInfiniteDiscovery.mockReturnValue({
      artworkIds: ["1", "2", "3"],
      currentArtworkId: "1",
    })
    renderWithWrappers(<InfiniteDiscoveryHeader />)
    expect(screen.queryByText("Back")).not.toBeOnTheScreen()
  })

  it("returns to the previous artwork when the back button is pressed", () => {
    const mockGoBack = jest.fn()
    mockUseInfiniteDiscovery.mockReturnValue({
      artworkIds: ["1", "2", "3"],
      currentArtworkId: "2",
      goBack: mockGoBack,
    })
    renderWithWrappers(<InfiniteDiscoveryHeader />)
    fireEvent.press(screen.getByText("Back"))
    expect(mockGoBack).toHaveBeenCalled()
  })

  it("navigates to home view when the exit button is pressed", () => {
    renderWithWrappers(<InfiniteDiscoveryHeader />)
    fireEvent.press(screen.getByText("Exit"))
    expect(mockNavigate).toHaveBeenCalledWith("/home-view")
  })
})
