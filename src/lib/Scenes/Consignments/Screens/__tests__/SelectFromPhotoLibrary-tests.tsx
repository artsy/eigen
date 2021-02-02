import CameraRoll from "@react-native-community/cameraroll"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { triggerCamera } from "lib/NativeModules/triggerCamera"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Alert, Linking } from "react-native"
import SelectFromPhotoLibrary from "../SelectFromPhotoLibrary"

jest.mock("@react-native-community/cameraroll", () => ({ getPhotos: jest.fn() }))

const realAlert = Alert.alert
const realLinking = Linking.openURL

jest.mock("lib/NativeModules/triggerCamera", () => ({ triggerCamera: jest.fn() }))
const triggerMock = triggerCamera as jest.Mock<any>

const nav = {} as any
const route = {} as any
const emptyProps = {
  navigator: nav,
  route,
  setup: { photos: [] },
  updateWithPhotos: () => "",
}

beforeAll(() => {
  Alert.alert = jest.fn()
  Linking.openURL = jest.fn()
})

afterAll(() => {
  Alert.alert = realAlert
  Linking.openURL = realLinking
})

it("renders without throwing a error", () => {
  renderWithWrappers(<SelectFromPhotoLibrary {...emptyProps} />)
})

it("adds new photo to the list, and selects it", () => {
  triggerMock.mockImplementationOnce(() => Promise.resolve(true))

  const select = new SelectFromPhotoLibrary(emptyProps)

  select.setState = jest.fn()
  ;(CameraRoll.getPhotos as jest.Mock).mockResolvedValue({
    edges: [{ node: { image: { url: "https://image.com" } } }],
  } as any)

  expect.hasAssertions()
  return select.onPressNewPhoto().then(() => {
    // Expect state to be updated
    expect(select.setState).toBeCalledWith({
      cameraImages: [{ image: { url: "https://image.com" } }],
      selection: expect.anything(),
    })
  })
})

describe("concerning camera errors", () => {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  let alert: jest.Mock<typeof Alert.alert> = null
  const { ARTakeCameraPhotoModule } = LegacyNativeModules

  beforeEach(() => {
    alert = Alert.alert as any
    alert.mockReset()
  })

  it("shows an alert when no camera is available", async () => {
    triggerMock.mockImplementationOnce(() =>
      Promise.reject({
        code: ARTakeCameraPhotoModule.errorCodes.cameraNotAvailable,
        message: "Camera not available",
      })
    )
    const select = new SelectFromPhotoLibrary(emptyProps)
    await select.onPressNewPhoto()
    expect(alert).toHaveBeenCalledWith("Camera not available")
  })

  it("shows an alert when the camera cannot produce media of type image", async () => {
    triggerMock.mockImplementationOnce(() =>
      Promise.reject({
        code: ARTakeCameraPhotoModule.errorCodes.imageMediaNotAvailable,
        message: "Camera can’t take photos",
      })
    )
    const select = new SelectFromPhotoLibrary(emptyProps)
    await select.onPressNewPhoto()
    expect(alert).toHaveBeenCalledWith("Camera can’t take photos")
  })

  it("shows an alert that links to Settings.app when the user has denied access to the camera", async () => {
    triggerMock.mockImplementationOnce(() =>
      Promise.reject({
        code: ARTakeCameraPhotoModule.errorCodes.cameraAccessDenied,
        message: "Camera access denied",
      })
    )
    const select = new SelectFromPhotoLibrary(emptyProps)
    await select.onPressNewPhoto()

    const call = alert.mock.calls[0]
    expect(call[0]).toEqual("Camera access denied")
    expect(call[1]).toMatch(/enable/i)

    const settingsButton = call[2][1]
    settingsButton.onPress()
    expect(Linking.openURL).toHaveBeenCalledWith(
      LegacyNativeModules.ARCocoaConstantsModule.UIApplicationOpenSettingsURLString
    )
  })

  it("shows an alert when saving a photo fails", async () => {
    triggerMock.mockImplementationOnce(() =>
      Promise.reject({
        code: ARTakeCameraPhotoModule.errorCodes.saveFailed,
        message: "Failed to save",
        userInfo: {
          NSUnderlyingError: {
            code: 42,
            message: "You have no hard disk",
          },
        },
      })
    )
    const select = new SelectFromPhotoLibrary(emptyProps)
    await select.onPressNewPhoto()
    expect(alert).toHaveBeenCalledWith("Failed to save", "You have no hard disk (42)")
  })
})
