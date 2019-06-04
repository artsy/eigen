import React from "react"
import { Alert, Linking, NativeModules } from "react-native"
import * as renderer from "react-test-renderer"

jest.mock("@react-native-community/cameraroll", () => jest.fn())

import SelectFromPhotoLibrary from "../SelectFromPhotoLibrary"

jest.mock("lib/NativeModules/triggerCamera", () => ({ triggerCamera: jest.fn() }))
import { Theme } from "@artsy/palette"
import { triggerCamera } from "lib/NativeModules/triggerCamera"
const triggerMock = triggerCamera as jest.Mock<any>

jest.mock("Alert", () => ({ alert: jest.fn() }))
jest.mock("Linking", () => ({ openURL: jest.fn() }))

const nav = {} as any
const route = {} as any
const emptyProps = {
  navigator: nav,
  route,
  setup: { photos: [] },
  updateWithPhotos: () => "",
}

it("Sets up the right view hierarchy", () => {
  const tree = renderer
    .create(
      <Theme>
        <SelectFromPhotoLibrary {...emptyProps} />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it("adds new photo to the list, and selects it", () => {
  triggerMock.mockImplementationOnce(() => Promise.resolve(true))

  const select = new SelectFromPhotoLibrary(emptyProps)

  select.setState = jest.fn()
  const newPhoto = { image: { url: "https://image.com" } }
  select.getCameraRollPhotos = () => Promise.resolve({ edges: [{ node: newPhoto }] }) as any

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
  let alert: jest.Mock<typeof Alert.alert> = null
  const { ARTakeCameraPhotoModule } = NativeModules

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
      NativeModules.ARCocoaConstantsModule.UIApplicationOpenSettingsURLString
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
