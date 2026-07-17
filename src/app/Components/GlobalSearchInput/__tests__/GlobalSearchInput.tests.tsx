import { OwnerType } from "@artsy/cohesion"
import { PortalHost } from "@gorhom/portal"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { GlobalSearchInput } from "app/Components/GlobalSearchInput/GlobalSearchInput"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
import { navigate } from "app/system/navigation/navigate"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import { requestPhotos } from "app/utils/requestPhotos"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { uploadImageToS3 } from "app/utils/uploadImageToS3"
import ImagePicker from "react-native-image-crop-picker"

jest.mock("app/utils/requestPhotos", () => ({
  requestPhotos: jest.fn(),
}))

jest.mock("app/utils/uploadImageToS3", () => ({
  uploadImageToS3: jest.fn(),
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

    it("uploads the camera photo and opens the image-search results", async () => {
      ;(ImagePicker.openCamera as jest.Mock).mockResolvedValueOnce({ path: "file:///camera.jpg" })
      ;(uploadImageToS3 as jest.Mock).mockResolvedValueOnce({
        key: "some-key",
        bucket: "some-bucket",
      })
      renderOverlay()

      fireEvent.press(await screen.findByText("Take a photo"))

      expect(ImagePicker.openCamera).toHaveBeenCalledWith({
        mediaType: "photo",
        cropping: true,
        freeStyleCropEnabled: true,
      })
      await waitFor(() => expect(uploadImageToS3).toHaveBeenCalledWith("file:///camera.jpg"))
      expect(navigate).toHaveBeenCalledWith("/image-search-results", {
        passProps: { s3Key: "some-key", s3Bucket: "some-bucket" },
      })
    })

    it("uploads the selected (cropped) image and opens the image-search results", async () => {
      ;(requestPhotos as jest.Mock).mockResolvedValueOnce([{ path: "file:///library.jpg" }])
      ;(uploadImageToS3 as jest.Mock).mockResolvedValueOnce({
        key: "some-key",
        bucket: "some-bucket",
      })
      renderOverlay()

      fireEvent.press(await screen.findByText("Add an image"))

      expect(requestPhotos).toHaveBeenCalledWith(false, { cropping: true })
      await waitFor(() => expect(uploadImageToS3).toHaveBeenCalledWith("file:///library.jpg"))
      expect(navigate).toHaveBeenCalledWith("/image-search-results", {
        passProps: { s3Key: "some-key", s3Bucket: "some-bucket" },
      })
    })

    it("shows a loading state while uploading and only navigates once it finishes", async () => {
      ;(navigate as jest.Mock).mockClear()
      ;(ImagePicker.openCamera as jest.Mock).mockResolvedValueOnce({ path: "file:///camera.jpg" })
      let resolveUpload: (value: { key: string; bucket: string }) => void = () => {}
      ;(uploadImageToS3 as jest.Mock).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveUpload = resolve
        })
      )
      renderOverlay()

      fireEvent.press(await screen.findByText("Take a photo"))

      // upload is in flight — the button shows a loading state and we haven't navigated yet
      await waitFor(() => expect(uploadImageToS3).toHaveBeenCalledWith("file:///camera.jpg"))
      expect(navigate).not.toHaveBeenCalled()

      // once the upload resolves, we navigate to the results screen
      resolveUpload({ key: "some-key", bucket: "some-bucket" })

      await waitFor(() =>
        expect(navigate).toHaveBeenCalledWith("/image-search-results", {
          passProps: { s3Key: "some-key", s3Bucket: "some-bucket" },
        })
      )
    })

    it("collapses to the title (without hiding) once the user starts typing", async () => {
      renderOverlay()

      // expanded before typing: buttons visible
      await screen.findByText("Take a photo")

      fireEvent.changeText(
        screen.getByLabelText("Search artists, artworks, galleries etc."),
        "banksy"
      )

      // collapsed: buttons gone, but the title is still there (never fully hidden)
      expect(screen.queryByText("Take a photo")).toBeNull()
      expect(screen.queryByText("Add an image")).toBeNull()
      expect(screen.getByText("See it? Search it.")).toBeTruthy()
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
