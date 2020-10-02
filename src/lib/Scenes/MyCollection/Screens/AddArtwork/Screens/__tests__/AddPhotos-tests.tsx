import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { __appStoreTestUtils__, AppStore } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { AddPhotos, tests } from "../AddPhotos"

jest.mock("formik")

describe("AddPhotos", () => {
  beforeEach(() => {
    __appStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            formValues: {
              photos: [{ path: "photo/1" }, { path: "photo/2" }],
            },
          },
        },
      },
    })
  })

  it("updates header with correct label based on number of photos selected", () => {
    const wrapper = renderWithWrappers(<AddPhotos />)
    expect(wrapper.root.findByType(FancyModalHeader).props.children).toStrictEqual(["Photos ", "(2)"])
  })

  it("displays the correct number of photos", () => {
    const wrapper = renderWithWrappers(<AddPhotos />)
    expect(wrapper.root.findAllByType(Image).length).toBe(2)
    expect(wrapper.root.findAllByType(tests.DeletePhotoButton).length).toBe(2)
  })

  it("renders add photo button", () => {
    const wrapper = renderWithWrappers(<AddPhotos />)
    expect(wrapper.root.findByType(tests.AddPhotosButton)).toBeDefined()
  })

  it("triggers action on add photo button click", () => {
    const spy = jest.fn()
    AppStore.actions.myCollection.artwork.takeOrPickPhotos = spy as any
    const wrapper = renderWithWrappers(<AddPhotos />)
    wrapper.root.findByType(tests.AddPhotosButton).findByType(TouchableOpacity).props.onPress()
    expect(spy).toHaveBeenCalled()
  })

  it("triggers action on add photo button click", () => {
    const spy = jest.fn()
    AppStore.actions.myCollection.artwork.takeOrPickPhotos = spy as any
    const wrapper = renderWithWrappers(<AddPhotos />)
    wrapper.root.findByType(tests.AddPhotosButton).findByType(TouchableOpacity).props.onPress()
    expect(spy).toHaveBeenCalled()
  })

  it("triggers action on delete photo button click", () => {
    const spy = jest.fn()
    AppStore.actions.myCollection.artwork.removePhoto = spy as any
    const wrapper = renderWithWrappers(<AddPhotos />)
    wrapper.root.findAllByType(tests.DeletePhotoButton)[0].findByType(TouchableOpacity).props.onPress()
    expect(spy).toHaveBeenCalledWith({ path: "photo/1" })
  })
})
