import { OwnerType } from "@artsy/cohesion"
import { PortalHost } from "@gorhom/portal"
import { fireEvent, screen } from "@testing-library/react-native"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { navigate } from "app/system/navigation/navigate"
import { useEnableArtAssistant } from "app/utils/hooks/useEnableArtAssistant"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/system/flags/hooks/useExperimentFlag", () => ({
  useExperimentFlag: jest.fn(),
}))

jest.mock("app/utils/hooks/useEnableArtAssistant", () => ({
  useEnableArtAssistant: jest.fn(),
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

describe("GlobalSearchInputOverlay", () => {
  const mockUseExperimentFlag = useExperimentFlag as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useEnableArtAssistant).mockReturnValue(false)
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtsyLens: true })
  })

  describe("the Art Assistant entry point", () => {
    it("is hidden when its experiment is off", async () => {
      mockUseExperimentFlag.mockReturnValue(false)

      await renderOverlay()

      expect(screen.queryByTestId("art-assistant-search-overlay-button")).not.toBeOnTheScreen()
    })

    it("dismisses the overlay and navigates to Art Assistant", async () => {
      jest.mocked(useEnableArtAssistant).mockReturnValue(true)
      const hideModal = jest.fn()

      await renderOverlay({ hideModal })

      await fireEvent.press(screen.getByTestId("art-assistant-search-overlay-button"))

      expect(hideModal).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith("/art-assistant")
    })

    it("stays available while the user types a search query", async () => {
      jest.mocked(useEnableArtAssistant).mockReturnValue(true)

      await renderOverlay()

      await fireEvent.changeText(
        screen.getByLabelText("Search artists, artworks, galleries etc."),
        "banksy"
      )

      expect(screen.getByTestId("art-assistant-search-overlay-button")).toBeOnTheScreen()
    })
  })

  describe("the camera icon inside the input", () => {
    it("carries the icon over from the collapsed search bar", async () => {
      mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")

      await renderOverlay()

      expect(screen.getByTestId("search-overlay-camera-icon")).toBeOnTheScreen()
    })

    it("hides the icon when onyx_artsy-lens is off", async () => {
      mockUseExperimentFlag.mockReturnValue(false)

      await renderOverlay()

      expect(screen.queryByTestId("search-overlay-camera-icon")).not.toBeOnTheScreen()
    })

    // iOS draws its own clear button in this exact spot once there's text.
    it("yields the slot once there is a query for the clear button to clear", async () => {
      mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")

      await renderOverlay()

      await fireEvent.changeText(
        screen.getByLabelText("Search artists, artworks, galleries etc."),
        "banksy"
      )

      expect(screen.queryByTestId("search-overlay-camera-icon")).not.toBeOnTheScreen()
    })

    it("dismisses the overlay and navigates to /lens on press", async () => {
      mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")
      const hideModal = jest.fn()

      await renderOverlay({ hideModal })

      await fireEvent.press(screen.getByTestId("search-overlay-camera-icon"))

      expect(hideModal).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith("/lens")
    })

    it("reports the tap against the overlay, not the search bar", async () => {
      mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")

      await renderOverlay()

      await fireEvent.press(screen.getByTestId("search-overlay-camera-icon"))

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

describe("GlobalSearchInputOverlay — Art Assistant entry point", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useExperimentFlag).mockReturnValue(false)
    jest.mocked(useEnableArtAssistant).mockReturnValue(true)
  })

  it("dismisses the overlay and navigates to the Art Assistant on press", async () => {
    const hideModal = jest.fn()

    await renderOverlay({ hideModal })

    await fireEvent.press(screen.getByTestId("art-assistant-search-overlay-button"))

    expect(hideModal).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("/art-assistant")
  })

  it("prefills Art Assistant with the search query", async () => {
    await renderOverlay()

    await fireEvent.changeText(
      screen.getByLabelText("Search artists, artworks, galleries etc."),
      " moody seascapes "
    )
    await fireEvent.press(screen.getByTestId("art-assistant-search-overlay-button"))

    expect(navigate).toHaveBeenCalledWith("/art-assistant", {
      passProps: { initialPrompt: "moody seascapes" },
    })
  })

  it("reports the tap against the overlay, not the search bar", async () => {
    await renderOverlay()

    await fireEvent.press(screen.getByTestId("art-assistant-search-overlay-button"))

    expect(mockTrackEvent).toHaveBeenCalledExactlyOnceWith({
      action: "tappedArtAssistant",
      context_module: "searchOverlay",
      context_screen_owner_type: "home",
      destination_screen_owner_type: "artAssistant",
      type: "icon",
    })
  })
})
