import { OwnerType } from "@artsy/cohesion"
import { PortalHost } from "@gorhom/portal"
import { fireEvent, screen } from "@testing-library/react-native"
import { GlobalSearchInput } from "app/Components/GlobalSearchInput/GlobalSearchInput"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import { requestPhotos } from "app/utils/requestPhotos"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import ImagePicker from "react-native-image-crop-picker"

jest.mock("app/utils/requestPhotos", () => ({
  requestPhotos: jest.fn(),
}))

jest.mock("app/utils/hooks/useSelectedTab", () => ({
  useSelectedTab: jest.fn(),
}))

jest.mock("app/Components/GlobalSearchInput/utils/useDismissSearchOverlayOnTabBarPress", () => ({
  useDismissSearchOverlayOnTabBarPress: jest.fn(),
}))

describe("GlobalSearchInput", () => {
  const mockUseledTab = useSelectedTab as jest.Mock

  beforeEach(() => {
    mockUseledTab.mockReturnValue("home")
  })

  it("renders the search label properly", () => {
    renderWithWrappers(<GlobalSearchInput ownerType={OwnerType.home} />)

    expect(/Search Artsy/).toBeTruthy()
  })

  it("renders the camera icon on the resting search bar", () => {
    renderWithWrappers(<GlobalSearchInput ownerType={OwnerType.home} />)

    expect(screen.getByTestId("global-search-camera-icon")).toBeTruthy()
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

  describe("when the search overlay is active", () => {
    const renderOverlay = () =>
      renderWithWrappers(
        <>
          <GlobalSearchInputOverlay ownerType={OwnerType.search} visible hideModal={jest.fn()} />
          <PortalHost name={`${OwnerType.search}-SearchOverlay`} />
        </>
      )

    it("renders the take a photo and add an image buttons", async () => {
      renderOverlay()

      await screen.findByText("Take a photo")
      expect(screen.getByText("Add an image")).toBeTruthy()
    })

    it("opens the camera when tapping take a photo", async () => {
      renderOverlay()

      fireEvent.press(await screen.findByText("Take a photo"))

      expect(ImagePicker.openCamera).toHaveBeenCalledWith({ mediaType: "photo" })
    })

    it("opens the photo library when tapping add an image", async () => {
      renderOverlay()

      fireEvent.press(await screen.findByText("Add an image"))

      expect(requestPhotos).toHaveBeenCalledWith(false)
    })

    it("keeps the buttons visible after a query is entered", async () => {
      renderOverlay()

      await screen.findByText("Take a photo")
      fireEvent.changeText(
        screen.getByLabelText("Search artists, artworks, galleries etc."),
        "banksy"
      )

      expect(screen.getByText("Take a photo")).toBeTruthy()
      expect(screen.getByText("Add an image")).toBeTruthy()
    })

    it("collapses to the title only and expands again when toggling the chevron", async () => {
      renderOverlay()

      // starts expanded: buttons + description visible
      await screen.findByText("Take a photo")
      expect(
        screen.getByText("Take a photo or upload an image to find the piece that matches the mood.")
      ).toBeTruthy()

      // collapse: only the title remains
      fireEvent.press(screen.getByLabelText("Collapse"))

      expect(screen.getByText("See it? Search it.")).toBeTruthy()
      expect(screen.queryByText("Take a photo")).toBeNull()
      expect(screen.queryByText("Add an image")).toBeNull()

      // expand again via the chevron
      fireEvent.press(screen.getByLabelText("Expand"))

      expect(screen.getByText("Take a photo")).toBeTruthy()
      expect(screen.getByText("Add an image")).toBeTruthy()
    })
  })
})
