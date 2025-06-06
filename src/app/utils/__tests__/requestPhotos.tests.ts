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
