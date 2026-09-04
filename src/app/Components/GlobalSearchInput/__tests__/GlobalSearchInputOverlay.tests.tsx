import { OwnerType } from "@artsy/cohesion"
import { PortalHost } from "@gorhom/portal"
import { fireEvent, screen } from "@testing-library/react-native"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/system/flags/hooks/useExperimentFlag", () => ({
  useExperimentFlag: jest.fn(),
}))

jest.mock("app/utils/hooks/useSelectedTab", () => ({
  useSelectedTab: jest.fn().mockReturnValue("home"),
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

const renderOverlay = (props: { hideModal?: () => void } = {}) =>
  renderWithWrappers(
    <>
      <PortalHost name={`${OwnerType.home}-SearchOverlay`} />
      <GlobalSearchInputOverlay
        ownerType={OwnerType.home}
        visible
        hideModal={props.hideModal ?? jest.fn()}
      />
    </>,
    { includeNavigation: true }
  )

describe("GlobalSearchInputOverlay — Search by Photo entry point", () => {
  const mockUseExperimentFlag = useExperimentFlag as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtsyLens: true })
  })

  it("hides the Search by Photo button when AREnableArtsyLens is off", () => {
    mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtsyLens: false })

    renderOverlay()

    expect(screen.queryByTestId("search-by-photo-button")).not.toBeOnTheScreen()
  })

  it("renders the Search by Photo button when onyx_artsy-lens is on", () => {
    mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")

    renderOverlay()

    expect(screen.getByTestId("search-by-photo-button")).toBeOnTheScreen()
  })

  it("hides the Search by Photo button when onyx_artsy-lens is off", () => {
    mockUseExperimentFlag.mockReturnValue(false)

    renderOverlay()

    expect(screen.queryByTestId("search-by-photo-button")).not.toBeOnTheScreen()
  })

  it("dismisses the overlay and navigates to /lens on press", () => {
    mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")
    const hideModal = jest.fn()

    renderOverlay({ hideModal })

    fireEvent.press(screen.getByTestId("search-by-photo-button"))

    expect(hideModal).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("/lens")
  })

  it("reports the button tap as the overlay button entry point", () => {
    mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")

    renderOverlay()

    fireEvent.press(screen.getByTestId("search-by-photo-button"))

    expect(mockTrackEvent).toHaveBeenCalledExactlyOnceWith({
      action: "tappedSearchByImage",
      context_module: "searchOverlay",
      context_screen_owner_type: "home",
      destination_screen_owner_type: "searchByImage",
      type: "search_overlay_button",
    })
  })

  describe("the camera icon inside the input", () => {
    it("carries the icon over from the collapsed search bar", () => {
      mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")

      renderOverlay()

      expect(screen.getByTestId("search-overlay-camera-icon")).toBeOnTheScreen()
    })

    it("hides the icon when onyx_artsy-lens is off", () => {
      mockUseExperimentFlag.mockReturnValue(false)

      renderOverlay()

      expect(screen.queryByTestId("search-overlay-camera-icon")).not.toBeOnTheScreen()
    })

    // iOS draws its own clear button in this exact spot once there's text.
    it("yields the slot once there is a query for the clear button to clear", () => {
      mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")

      renderOverlay()

      fireEvent.changeText(
        screen.getByLabelText("Search artists, artworks, galleries etc."),
        "banksy"
      )

      expect(screen.queryByTestId("search-overlay-camera-icon")).not.toBeOnTheScreen()
      expect(screen.getByTestId("search-by-photo-button")).toBeOnTheScreen()
    })

    it("dismisses the overlay and navigates to /lens on press", () => {
      mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")
      const hideModal = jest.fn()

      renderOverlay({ hideModal })

      fireEvent.press(screen.getByTestId("search-overlay-camera-icon"))

      expect(hideModal).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith("/lens")
    })

    it("reports the tap against the overlay, not the search bar", () => {
      mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")

      renderOverlay()

      fireEvent.press(screen.getByTestId("search-overlay-camera-icon"))

      expect(mockTrackEvent).toHaveBeenCalledExactlyOnceWith({
        action: "tappedSearchByImage",
        context_module: "searchOverlay",
        context_screen_owner_type: "home",
        destination_screen_owner_type: "searchByImage",
        type: "search_input_icon",
      })
    })
  })
})
