import { screen, waitFor } from "@testing-library/react-native"
import { LensAnalyzing } from "app/Scenes/Lens/Screens/LensAnalyzing"
import { cropToViewfinder } from "app/Scenes/Lens/utils/cropToViewfinder"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { uploadImageToS3 } from "app/utils/uploadImageToS3"

jest.mock("app/Scenes/Lens/utils/cropToViewfinder", () => ({
  cropToViewfinder: jest.fn(),
}))

jest.mock("app/utils/uploadImageToS3", () => ({
  uploadImageToS3: jest.fn(),
}))

const mockReplace = jest.fn()

const photo = { uri: "file:///tmp/photo.jpg", width: 400, height: 300 }

const navigationProps = {
  navigation: { replace: mockReplace } as any,
  route: { key: "LensAnalyzing", name: "LensAnalyzing", params: { photo } } as any,
}

describe("LensAnalyzing", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(cropToViewfinder).mockResolvedValue("file:///tmp/cropped.jpg")
  })

  it("crops the photo, uploads the cropped file, and replaces with LensResults on success", async () => {
    jest.mocked(uploadImageToS3).mockResolvedValue({ bucket: "my-bucket", key: "my-key" })

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    expect(cropToViewfinder).toHaveBeenCalledWith(photo.uri, expect.any(Number), expect.any(Number))

    await waitFor(() => expect(uploadImageToS3).toHaveBeenCalledWith("file:///tmp/cropped.jpg"))

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("LensResults", {
        s3Bucket: "my-bucket",
        s3Key: "my-key",
        photo,
      })
    )
  })

  it("displays the cropped image, never the original uncropped photo, once cropping resolves", async () => {
    // A bracket overlay on the original photo always leaves image content visible outside the
    // brackets, however accurate the crop math -- see LensAnalyzing.tsx.
    jest.mocked(uploadImageToS3).mockImplementation(() => new Promise(() => {}))

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    const image = await screen.findByTestId("lensAnalyzingCroppedImage")
    expect(image.props.source).toEqual({ uri: "file:///tmp/cropped.jpg" })
  })

  it("crops against a different container for a library-picked photo than a camera-captured one", async () => {
    // Library-picked photos were never shown with brackets at full screen (only in this screen's
    // own preview card), so the crop must invert against that card, not the window -- see
    // LensAnalyzing's docstring. This doesn't assert exact pixel values (that's
    // computePhotoCropRect's/viewfinderGeometry's job); it just proves the branch fires.
    jest.mocked(uploadImageToS3).mockResolvedValue({ bucket: "my-bucket", key: "my-key" })

    renderWithWrappers(
      <LensAnalyzing {...navigationProps} route={{ ...navigationProps.route, params: { photo } } as any} />
    )
    const [, cameraContainerWidth] = jest.mocked(cropToViewfinder).mock.calls[0]

    jest.clearAllMocks()
    jest.mocked(cropToViewfinder).mockResolvedValue("file:///tmp/cropped.jpg")
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

    await screen.findByText("Something went wrong finding matches for that photo. Please close and try again.")

    expect(uploadImageToS3).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it("shows an error message and does not navigate when the upload fails", async () => {
    jest.mocked(uploadImageToS3).mockRejectedValue(new Error("upload failed"))

    renderWithWrappers(<LensAnalyzing {...navigationProps} />)

    await screen.findByText("Something went wrong finding matches for that photo. Please close and try again.")

    expect(mockReplace).not.toHaveBeenCalled()
  })
})
