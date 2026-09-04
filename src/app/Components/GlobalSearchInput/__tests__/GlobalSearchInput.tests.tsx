import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { GlobalSearchInput } from "app/Components/GlobalSearchInput/GlobalSearchInput"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { navigate } from "app/system/navigation/navigate"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/hooks/useSelectedTab", () => ({
  useSelectedTab: jest.fn(),
}))

jest.mock("app/system/flags/hooks/useExperimentFlag", () => ({
  useExperimentFlag: jest.fn(),
}))

jest.mock("app/Components/GlobalSearchInput/utils/useDismissSearchOverlayOnTabBarPress", () => ({
  useDismissSearchOverlayOnTabBarPress: jest.fn(),
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

describe("GlobalSearchInput", () => {
  const mockUseledTab = useSelectedTab as jest.Mock
  const mockUseExperimentFlag = useExperimentFlag as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseledTab.mockReturnValue("home")
    mockUseExperimentFlag.mockReturnValue(false)
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtsyLens: true })
  })

  it("renders the search label properly", () => {
    renderWithWrappers(<GlobalSearchInput ownerType={OwnerType.home} />)

    expect(/Search Artsy/).toBeTruthy()
  })

  it("tracks the search bar tapped event", () => {
    renderWithWrappers(<GlobalSearchInput ownerType={OwnerType.home} />)

    fireEvent.press(screen.getByTestId("search-button"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedGlobalSearchBar",
        context_screen_owner_type: "home",
      })
    )
  })

  describe("Artsy Lens camera icon", () => {
    it("renders the camera icon when the onyx_artsy-lens experiment is on", () => {
      mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")

      renderWithWrappers(<GlobalSearchInput ownerType={OwnerType.home} />)

      expect(screen.getByTestId("search-input-camera-icon")).toBeOnTheScreen()
    })

    it("hides the camera icon when the onyx_artsy-lens experiment is off", () => {
      mockUseExperimentFlag.mockReturnValue(false)

      renderWithWrappers(<GlobalSearchInput ownerType={OwnerType.home} />)

      expect(screen.queryByTestId("search-input-camera-icon")).not.toBeOnTheScreen()
    })

    it("hides the camera icon when AREnableArtsyLens is off, even if the experiment is on", () => {
      mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtsyLens: false })

      renderWithWrappers(<GlobalSearchInput ownerType={OwnerType.home} />)

      expect(screen.queryByTestId("search-input-camera-icon")).not.toBeOnTheScreen()
    })

    // The icon used to sit inside the bar's `pointerEvents="none"` subtree, so tapping it opened
    // the text-search overlay like any other part of the bar.
    it("opens the camera directly, without the search overlay, when the icon is tapped", () => {
      mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")
      const onOverlayVisibilityChange = jest.fn()

      renderWithWrappers(
        <GlobalSearchInput
          ownerType={OwnerType.home}
          onOverlayVisibilityChange={onOverlayVisibilityChange}
        />
      )

      fireEvent.press(screen.getByTestId("search-input-camera-icon"))

      expect(navigate).toHaveBeenCalledWith("/lens")
      expect(onOverlayVisibilityChange).not.toHaveBeenCalledWith(true)
      expect(mockTrackEvent).not.toHaveBeenCalled()
    })
  })

  it("reports overlay visibility changes", () => {
    const onOverlayVisibilityChange = jest.fn()
    const { unmount } = renderWithWrappers(
      <GlobalSearchInput
        ownerType={OwnerType.home}
        onOverlayVisibilityChange={onOverlayVisibilityChange}
      />
    )

    expect(onOverlayVisibilityChange).toHaveBeenLastCalledWith(false)

    fireEvent.press(screen.getByTestId("search-button"))

    expect(onOverlayVisibilityChange).toHaveBeenLastCalledWith(true)

    unmount()

    expect(onOverlayVisibilityChange).toHaveBeenLastCalledWith(false)
  })
})
