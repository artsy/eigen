import { captureException } from "@sentry/react-native"
import { act, renderHook } from "@testing-library/react-native"
import {
  ART_ASSISTANT_IMAGE_UPLOAD_ERROR,
  useArtAssistantImageAttachment,
} from "app/Scenes/ArtAssistant/hooks/useArtAssistantImageAttachment"
import { prepareImageForUpload } from "app/Scenes/ArtAssistant/utils/prepareImageForUpload"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { uploadImageToS3 } from "app/utils/uploadImageToS3"
import { Image } from "react-native-image-crop-picker"

const mockShowToast = jest.fn()

jest.mock("@expo/react-native-action-sheet", () => ({
  useActionSheet: () => ({ showActionSheetWithOptions: jest.fn() }),
}))
jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => ({ show: mockShowToast }),
}))
jest.mock("app/utils/requestPhotos", () => ({
  showPhotoActionSheet: jest.fn(),
}))
jest.mock("app/Scenes/ArtAssistant/utils/prepareImageForUpload", () => ({
  prepareImageForUpload: jest.fn(),
}))
jest.mock("app/utils/uploadImageToS3", () => ({
  uploadImageToS3: jest.fn(),
}))

const photo = { path: "file:///picked.heic" } as Image

describe("useArtAssistantImageAttachment", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(showPhotoActionSheet).mockResolvedValue([photo])
    jest.mocked(prepareImageForUpload).mockResolvedValue("file:///prepared.jpg")
  })

  it("shows the picked photo while it uploads, then exposes the uploaded image", async () => {
    let resolveUpload: (value: { bucket: string; key: string }) => void = () => {}
    jest.mocked(uploadImageToS3).mockReturnValue(
      new Promise((resolve) => {
        resolveUpload = resolve
      })
    )
    const { result } = renderHook(() => useArtAssistantImageAttachment())

    let pending: Promise<void> = Promise.resolve()
    await act(async () => {
      pending = result.current.pick()
    })

    expect(result.current.attachment).toEqual({ status: "uploading", uri: photo.path })

    await act(async () => {
      resolveUpload({ bucket: "bucket", key: "key" })
      await pending
    })

    expect(prepareImageForUpload).toHaveBeenCalledWith(photo.path)
    expect(uploadImageToS3).toHaveBeenCalledWith("file:///prepared.jpg")
    expect(result.current.attachment).toEqual({
      status: "ready",
      uri: "file:///prepared.jpg",
      image: { s3Bucket: "bucket", s3Key: "key", uri: "file:///prepared.jpg" },
    })
  })

  it("does nothing when the picker is cancelled", async () => {
    jest.mocked(showPhotoActionSheet).mockRejectedValue(new Error("User cancelled image selection"))
    const { result } = renderHook(() => useArtAssistantImageAttachment())

    await act(() => result.current.pick())

    expect(result.current.attachment).toBeNull()
    expect(mockShowToast).not.toHaveBeenCalled()
    expect(captureException).not.toHaveBeenCalled()
  })

  it("clears the attachment and explains when the upload fails", async () => {
    jest.mocked(uploadImageToS3).mockRejectedValue(new Error("S3 upload failed"))
    const { result } = renderHook(() => useArtAssistantImageAttachment())

    await act(() => result.current.pick())

    expect(result.current.attachment).toBeNull()
    expect(captureException).toHaveBeenCalled()
    expect(mockShowToast).toHaveBeenCalledWith(ART_ASSISTANT_IMAGE_UPLOAD_ERROR, "bottom", {
      backgroundColor: "red100",
    })
  })

  it("ignores an upload that finishes after the image was removed", async () => {
    let resolveUpload: (value: { bucket: string; key: string }) => void = () => {}
    jest.mocked(uploadImageToS3).mockReturnValue(
      new Promise((resolve) => {
        resolveUpload = resolve
      })
    )
    const { result } = renderHook(() => useArtAssistantImageAttachment())

    let pending: Promise<void> = Promise.resolve()
    await act(async () => {
      pending = result.current.pick()
    })
    act(() => result.current.remove())
    await act(async () => {
      resolveUpload({ bucket: "bucket", key: "key" })
      await pending
    })

    expect(result.current.attachment).toBeNull()
    expect(mockShowToast).not.toHaveBeenCalled()
  })
})
