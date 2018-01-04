import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import SelectFromPhotoLibrary from "../SelectFromPhotoLibrary"

jest.mock("lib/NativeModules/triggerCamera", () => ({ triggerCamera: jest.fn() }))
import { triggerCamera } from "lib/NativeModules/triggerCamera"
const triggerMock = triggerCamera as jest.Mock<any>

const nav = {} as any
const route = {} as any

it("Sets up the right view hierarchy", () => {
  const tree = renderer
    .create(<SelectFromPhotoLibrary navigator={nav} route={route} setup={{}} updateWithPhotos={() => ""} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it("adds new photo to the list, and selects it", () => {
  const newPhoto = { image: { url: "https://image.com" } }
  triggerMock.mockImplementationOnce(() => Promise.resolve(newPhoto))

  const select = new SelectFromPhotoLibrary({
    navigator: nav,
    route,
    setup: { photos: [] },
    updateWithPhotos: () => "",
  })

  select.setState = jest.fn()

  expect.hasAssertions()
  return select.onPressNewPhoto().then(() => {
    expect(select.setState).toBeCalledWith({
      cameraImages: [{ image: { url: "https://image.com" } }],
      selection: expect.anything(),
    })
  })
})
