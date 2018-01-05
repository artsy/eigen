import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import SelectFromPhotoLibrary from "../SelectFromPhotoLibrary"

jest.mock("lib/NativeModules/triggerCamera", () => ({ triggerCamera: jest.fn() }))
import { triggerCamera } from "lib/NativeModules/triggerCamera"
const triggerMock = triggerCamera as jest.Mock<any>

const nav = {} as any
const route = {} as any
const emptyProps = {
  navigator: nav,
  route,
  setup: { photos: [] },
  updateWithPhotos: () => "",
}

it("Sets up the right view hierarchy", () => {
  const tree = renderer.create(<SelectFromPhotoLibrary {...emptyProps} />).toJSON()
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
