import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { requestPhotos } from "app/utils/requestPhotos"
import { Platform } from "react-native"
import { openPicker } from "react-native-image-crop-picker"

jest.mock("react-native-image-crop-picker", () => ({
  openPicker: jest.fn(),
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

    it("uses the crop-capable picker (not the native module) when cropping is requested", async () => {
      Platform.OS = "ios"
      Object.defineProperty(Platform, "Version", {
        get: () => 15,
      })
      const mockRequestPhotos = jest.fn()
      LegacyNativeModules.ARPHPhotoPickerModule.requestPhotos = mockRequestPhotos
      ;(openPicker as jest.Mock).mockResolvedValue({ path: "file:///cropped.jpg" })

      const result = await requestPhotos(false, { cropping: true })

      expect(mockRequestPhotos).not.toHaveBeenCalled()
      expect(openPicker).toHaveBeenCalledWith({
        mediaType: "photo",
        multiple: false,
        cropping: true,
        freeStyleCropEnabled: true,
      })
      expect(result).toEqual([{ path: "file:///cropped.jpg" }])
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

    it("passes cropping options to the picker when cropping is requested", async () => {
      Platform.OS = "android"
      Object.defineProperty(Platform, "Version", {
        get: () => 23,
      })
      ;(openPicker as jest.Mock).mockResolvedValue({ path: "file:///a.jpg" })

      await requestPhotos(false, { cropping: true })

      expect(openPicker).toHaveBeenCalledWith({
        mediaType: "photo",
        multiple: false,
        cropping: true,
        freeStyleCropEnabled: true,
      })
    })
  })
})
