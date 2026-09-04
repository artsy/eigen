import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { LensAnalyzing } from "app/Scenes/Lens/Screens/LensAnalyzing"
import { LENS_VIEWFINDER_ASPECT_RATIO } from "app/Scenes/Lens/constants"
import { cropToViewfinder } from "app/Scenes/Lens/utils/cropToViewfinder"
import { discardTempPhotos } from "app/Scenes/Lens/utils/discardTempPhotos"
import { goBack } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { uploadImageToS3 } from "app/utils/uploadImageToS3"

jest.mock("app/Scenes/Lens/utils/cropToViewfinder", () => ({
  cropToViewfinder: jest.fn(),
}))

jest.mock("app/utils/uploadImageToS3", () => ({
  uploadImageToS3: jest.fn(),
}))

jest.mock("app/Scenes/Lens/utils/discardTempPhotos", () => ({
  discardTempPhotos: jest.fn(),
}))

const mockReplace = jest.fn()
const mockNavigate = jest.fn()

const photo = { uri: "file:///tmp/photo.jpg", width: 400, height: 300 }

// 5:6 -- a capture framed with the phone upright.
const portraitCrop = { uri: "file:///tmp/cropped.jpg", width: 1454, height: 1744 }
// 6:5 -- a capture framed with the phone sideways. See PhotoPresentation.
const landscapeCrop = { uri: "file:///tmp/cropped.jpg", width: 1744, height: 1454 }

const navigationProps = {
  navigation: { replace: mockReplace, navigate: mockNavigate } as any,
  route: { key: "LensAnalyzing", name: "LensAnalyzing", params: { photo } } as any,
}

describe("LensAnalyzing", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(cropToViewfinder).mockResolvedValue(portraitCrop)
  })

  it("crops the photo, uploads the cropped file, and replaces with LensResults on success", async () => {
    jest.mocked(uploadImageToS3).mockResolvedValue({ bucket: "my-bucket", key: "my-key" })

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    expect(cropToViewfinder).toHaveBeenCalledWith(
      photo.uri,
      expect.any(Number),
      expect.any(Number),
      expect.any(String)
    )

    await waitFor(() => expect(uploadImageToS3).toHaveBeenCalledWith("file:///tmp/cropped.jpg"))

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("LensResults", {
        s3Bucket: "my-bucket",
        s3Key: "my-key",
        photoUri: portraitCrop.uri,
        fromLibrary: false,
      })
    )
  })

  it("returns to the previous screen when closed", () => {
    jest.mocked(uploadImageToS3).mockImplementation(() => new Promise(() => {}))

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    fireEvent.press(screen.getByLabelText("Close"))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it("displays the cropped image, never the original uncropped photo, once cropping resolves", async () => {
    jest.mocked(uploadImageToS3).mockImplementation(() => new Promise(() => {}))

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    const image = await screen.findByTestId("lensAnalyzingCroppedImage")
    expect(image.props.source).toEqual({ uri: "file:///tmp/cropped.jpg" })
  })

  // A landscape crop pinned to a portrait card hides part of the searched region or letterboxes it.
  it("shapes the preview card to a portrait crop", async () => {
    jest.mocked(cropToViewfinder).mockResolvedValue(portraitCrop)
    jest.mocked(uploadImageToS3).mockImplementation(() => new Promise(() => {}))

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    const image = await screen.findByTestId("lensAnalyzingCroppedImage")
    const { width, height } = image.props.style

    expect(width / height).toBeCloseTo(portraitCrop.width / portraitCrop.height, 2)
    expect(height).toBeGreaterThan(width)
  })

  it("shapes the preview card to a landscape crop, so nothing is hidden or letterboxed", async () => {
    jest.mocked(cropToViewfinder).mockResolvedValue(landscapeCrop)
    jest.mocked(uploadImageToS3).mockImplementation(() => new Promise(() => {}))

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    const image = await screen.findByTestId("lensAnalyzingCroppedImage")
    const { width, height } = image.props.style

    expect(width / height).toBeCloseTo(landscapeCrop.width / landscapeCrop.height, 2)
    expect(width).toBeGreaterThan(height)
  })

  it("falls back to the viewfinder ratio when the crop reports no usable dimensions", async () => {
    jest
      .mocked(cropToViewfinder)
      .mockResolvedValue({ uri: "file:///tmp/cropped.jpg", width: 0, height: 0 })
    jest.mocked(uploadImageToS3).mockImplementation(() => new Promise(() => {}))

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    const image = await screen.findByTestId("lensAnalyzingCroppedImage")
    const { width, height } = image.props.style

    expect(width / height).toBeCloseTo(LENS_VIEWFINDER_ASPECT_RATIO, 2)
  })

  it("crops against a different container for a library-picked photo than a camera-captured one", async () => {
    // Only proves the branch fires; the pixel values are viewfinderGeometry's tests to check.
    jest.mocked(uploadImageToS3).mockResolvedValue({ bucket: "my-bucket", key: "my-key" })

    renderWithWrappers(
      <LensAnalyzing
        {...navigationProps}
        route={{ ...navigationProps.route, params: { photo } } as any}
      />
    )
    const [, cameraContainerWidth] = jest.mocked(cropToViewfinder).mock.calls[0]

    jest.clearAllMocks()
    jest.mocked(cropToViewfinder).mockResolvedValue(portraitCrop)
    jest.mocked(uploadImageToS3).mockResolvedValue({ bucket: "my-bucket", key: "my-key" })

    const libraryPhoto = { ...photo, fromLibrary: true }
    renderWithWrappers(
      <LensAnalyzing
        {...navigationProps}
        route={{ ...navigationProps.route, params: { photo: libraryPhoto } } as any}
      />
    )
    const [, libraryContainerWidth] = jest.mocked(cropToViewfinder).mock.calls[0]

    expect(libraryContainerWidth).not.toBe(cameraContainerWidth)
  })

  it("shows an error message and does not navigate when the crop fails", async () => {
    jest.mocked(cropToViewfinder).mockRejectedValue(new Error("crop failed"))

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    await screen.findByText(
      "Something went wrong finding matches for that photo. Please try again."
    )

    expect(uploadImageToS3).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it("shows an error message and does not navigate when the upload fails", async () => {
    jest.mocked(uploadImageToS3).mockRejectedValue(new Error("upload failed"))

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    await screen.findByText(
      "Something went wrong finding matches for that photo. Please try again."
    )

    expect(mockReplace).not.toHaveBeenCalled()
  })

  it("offers a way back to the camera when the crop fails, instead of asking the user to close", async () => {
    jest.mocked(cropToViewfinder).mockRejectedValue(new Error("crop failed"))

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    fireEvent.press(await screen.findByTestId("lensAnalyzingSearchByPhotoButton"))

    expect(mockNavigate).toHaveBeenCalledWith("LensCamera")
  })

  // Nothing else in the app prunes these, so leaving them behind piled up full-size photos.
  describe("temp file cleanup", () => {
    it("deletes the capture but hands the cropped file to LensResults", async () => {
      jest.mocked(uploadImageToS3).mockResolvedValue({ bucket: "my-bucket", key: "my-key" })

      const { unmount } = renderWithWrappers(<LensAnalyzing {...navigationProps} />)

      await waitFor(() => expect(mockReplace).toHaveBeenCalled())
      // Not while the cropped image is still on screen, and not before the upload has read it.
      expect(discardTempPhotos).not.toHaveBeenCalled()

      unmount()

      expect(discardTempPhotos).toHaveBeenCalledWith([photo.uri])
    })

    it("still deletes the cropped file when the upload fails", async () => {
      jest.mocked(uploadImageToS3).mockRejectedValue(new Error("upload failed"))

      const { unmount } = renderWithWrappers(<LensAnalyzing {...navigationProps} />)

      await screen.findByText(
        "Something went wrong finding matches for that photo. Please try again."
      )
      unmount()

      expect(discardTempPhotos).toHaveBeenCalledWith([photo.uri, portraitCrop.uri])
    })

    // Deleting one can cost the user their actual photo -- see `discardTempPhotos`.
    it("leaves a library-picked photo's own file alone", async () => {
      jest.mocked(uploadImageToS3).mockResolvedValue({ bucket: "my-bucket", key: "my-key" })
      const libraryPhoto = { ...photo, fromLibrary: true }

      const { unmount } = renderWithWrappers(
        <LensAnalyzing
          {...navigationProps}
          route={{ ...navigationProps.route, params: { photo: libraryPhoto } } as any}
        />
      )

      await waitFor(() => expect(mockReplace).toHaveBeenCalled())
      unmount()

      expect(discardTempPhotos).toHaveBeenCalledWith([])
    })

    it("still deletes the capture when the crop never lands", async () => {
      jest.mocked(cropToViewfinder).mockRejectedValue(new Error("crop failed"))

      const { unmount } = renderWithWrappers(<LensAnalyzing {...navigationProps} />)

      await screen.findByText(
        "Something went wrong finding matches for that photo. Please try again."
      )
      unmount()

      expect(discardTempPhotos).toHaveBeenCalledWith([photo.uri])
    })
  })

  // Getting these two backwards silently searches the wrong region of the photo.
  it("asks for the rotation-aware mapping for a camera capture", () => {
    jest.mocked(uploadImageToS3).mockImplementation(() => new Promise(() => {}))

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    expect(cropToViewfinder).toHaveBeenCalledWith(
      photo.uri,
      expect.any(Number),
      expect.any(Number),
      "coverRotatedToContainer"
    )
  })

  it("asks for the plain cover mapping for a library-picked photo", () => {
    jest.mocked(uploadImageToS3).mockImplementation(() => new Promise(() => {}))

    const libraryPhoto = { ...photo, fromLibrary: true }

    renderWithWrappers(
      <LensAnalyzing
        navigation={{ replace: mockReplace, navigate: mockNavigate } as any}
        route={
          {
            key: "LensAnalyzing",
            name: "LensAnalyzing",
            params: { photo: libraryPhoto },
          } as any
        }
      />
    )

    expect(cropToViewfinder).toHaveBeenCalledWith(
      libraryPhoto.uri,
      expect.any(Number),
      expect.any(Number),
      "cover"
    )
  })
})
