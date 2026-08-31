import { fireEvent, screen } from "@testing-library/react-native"
import { SearchScreen } from "app/Scenes/Search/Search"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("lodash/throttle", () => (fn: any) => {
  fn.flush = jest.fn()
  return fn
})

jest.mock("app/system/flags/hooks/useExperimentFlag", () => ({
  useExperimentFlag: jest.fn().mockReturnValue(false),
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

describe("Search", () => {
  it("should render a text input with placeholder and no pills", async () => {
    renderWithWrappers(<SearchScreen route={{} as any} navigation={{} as any} />)

    await screen.findByPlaceholderText("Search Artsy")

    const searchInput = screen.getByPlaceholderText("Search Artsy")

    expect(searchInput).toBeOnTheScreen()

    // Pill should not be visible
    expect(screen.queryByText("Artists")).not.toBeOnTheScreen()

    // should show City Guide
    expect(screen.getByText("City Guide")).toBeOnTheScreen()

    fireEvent.changeText(searchInput, "Ba")
  })

  describe("the Search by photo button", () => {
    const mockUseExperimentFlag = useExperimentFlag as jest.Mock

    beforeEach(() => {
      jest.clearAllMocks()
      mockUseExperimentFlag.mockReturnValue(false)
    })

    it("opens the camera when the onyx_artsy-lens experiment is on", async () => {
      mockUseExperimentFlag.mockImplementation((key: string) => key === "onyx_artsy-lens")

      renderWithWrappers(<SearchScreen route={{} as any} navigation={{} as any} />)

      fireEvent.press(await screen.findByTestId("search-by-photo-button"))

      expect(navigate).toHaveBeenCalledWith("/lens")
    })

    it("is absent when the onyx_artsy-lens experiment is off", async () => {
      renderWithWrappers(<SearchScreen route={{} as any} navigation={{} as any} />)

      await screen.findByPlaceholderText("Search Artsy")

      expect(screen.queryByTestId("search-by-photo-button")).not.toBeOnTheScreen()
    })
  })
})
