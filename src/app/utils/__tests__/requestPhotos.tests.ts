import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { requestPhotos } from "app/utils/requestPhotos"
import { Platform } from "react-native"
import { openCropper, openPicker } from "react-native-image-crop-picker"

jest.mock("react-native-image-crop-picker", () => ({
  openPicker: jest.fn(),
  openCropper: jest.fn(),
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

    it("keeps the native grid picker and crops each image afterwards when cropping is requested", async () => {
      jest.useFakeTimers()
      Platform.OS = "ios"
      Object.defineProperty(Platform, "Version", {
        get: () => 15,
      })
      LegacyNativeModules.ARPHPhotoPickerModule.requestPhotos = jest
        .fn()
        .mockResolvedValue([{ path: "file:///original.jpg" }])
      ;(openCropper as jest.Mock).mockResolvedValue({ path: "file:///cropped.jpg" })

      const promise = requestPhotos(false, { cropping: true })
      await jest.advanceTimersByTimeAsync(600)
      const result = await promise

      expect(openCropper).toHaveBeenCalledWith({
        path: "file:///original.jpg",
        mediaType: "photo",
        freeStyleCropEnabled: true,
      })
      expect(result).toEqual([{ path: "file:///cropped.jpg" }])
      jest.useRealTimers()
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
