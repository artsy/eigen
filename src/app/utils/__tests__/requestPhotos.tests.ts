import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { requestPhotos, showPhotoActionSheet } from "app/utils/requestPhotos"
import { Platform } from "react-native"
import { openCamera, openPicker } from "react-native-image-crop-picker"

jest.mock("react-native-image-crop-picker", () => ({
  openPicker: jest.fn(),
  openCamera: jest.fn(),
}))

describe("requestPhotos", () => {
  describe("on iOS", () => {
    it("calls the native module on iOS 14 and above", () => {
      Platform.OS = "ios"
      Object.defineProperty(Platform, "Version", {
        get: () => 15,
      })
      const mockRequestPhotos = jest.fn()
      LegacyNativeModules.ARPHPhotoPickerModule.requestPhotos = mockRequestPhotos
      requestPhotos()
      expect(mockRequestPhotos).toHaveBeenCalled()
    })
  })

  describe("on Android", () => {
    it("shows the react native photo picker", () => {
      Platform.OS = "android"
      Object.defineProperty(Platform, "Version", {
        get: () => 23,
      })
      requestPhotos()
      expect(openPicker).toHaveBeenCalled()
    })
  })
})

describe("showPhotoActionSheet", () => {
  const pickerCancelled = Object.assign(new Error("User cancelled image selection"), {
    code: "E_PICKER_CANCELLED",
  })

  const pressButton =
    (buttonIndex?: number) => (_options: unknown, callback: (i?: number) => void) =>
      callback(buttonIndex)

  beforeEach(() => {
    Platform.OS = "android"
    jest.mocked(openPicker).mockReset()
    jest.mocked(openCamera).mockReset()
  })

  it("resolves with the picked photos", async () => {
    const photo = { path: "file:///photo.jpg" }
    jest.mocked(openPicker).mockResolvedValue([photo] as any)

    await expect(showPhotoActionSheet(pressButton(0))).resolves.toEqual([photo])
  })

  it("resolves with the camera photo", async () => {
    const photo = { path: "file:///camera.jpg" }
    jest.mocked(openCamera).mockResolvedValue(photo as any)

    await expect(showPhotoActionSheet(pressButton(1))).resolves.toEqual([photo])
  })

  it("resolves with no photos when the user backs out of the picker", async () => {
    jest.mocked(openPicker).mockRejectedValue(pickerCancelled)

    await expect(showPhotoActionSheet(pressButton(0))).resolves.toEqual([])
  })

  it("resolves with no photos when the user backs out of the camera", async () => {
    jest.mocked(openCamera).mockRejectedValue(pickerCancelled)

    await expect(showPhotoActionSheet(pressButton(1))).resolves.toEqual([])
  })

  it("resolves with no photos when the action sheet is cancelled or dismissed", async () => {
    await expect(showPhotoActionSheet(pressButton(2))).resolves.toEqual([])
    await expect(showPhotoActionSheet(pressButton(undefined))).resolves.toEqual([])
  })

  it("still rejects on other picker errors", async () => {
    const permissionError = Object.assign(new Error("No permission"), {
      code: "E_NO_LIBRARY_PERMISSION",
    })
    jest.mocked(openPicker).mockRejectedValue(permissionError)

    await expect(showPhotoActionSheet(pressButton(0))).rejects.toBe(permissionError)
  })
})
