import { Route } from "@react-navigation/native"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { __globalStoreTestUtils__, GlobalStore } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React, { ReactElement } from "react"
import { Image, TouchableOpacity } from "react-native"
import { MyCollectionAddPhotos, tests } from "../MyCollectionArtworkFormAddPhotos"

jest.mock("formik")

describe("MyCollectionAddPhotos", () => {
  let mockAddPhotos: ReactElement

  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({
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

    const mockNav = jest.fn()
    const mockRoute: Route<"AddPhotos", undefined> = {
      key: "AddPhotos",
      name: "AddPhotos",
      params: undefined,
    }
    mockAddPhotos = <MyCollectionAddPhotos navigation={mockNav as any} route={mockRoute} />
  })

  it("updates header with correct label based on number of photos selected", () => {
    const wrapper = renderWithWrappers(mockAddPhotos)
    expect(wrapper.root.findByType(FancyModalHeader).props.children).toStrictEqual(["Photos ", "(2)"])
  })

  it("displays the correct number of photos", () => {
    const wrapper = renderWithWrappers(mockAddPhotos)
    expect(wrapper.root.findAllByType(Image).length).toBe(2)
    expect(wrapper.root.findAllByType(tests.DeletePhotoButton).length).toBe(2)
  })

  it("renders add photo button", () => {
    const wrapper = renderWithWrappers(mockAddPhotos)
    expect(wrapper.root.findByType(tests.AddPhotosButton)).toBeDefined()
  })

  it("triggers action on add photo button click", () => {
    const spy = jest.fn()
    GlobalStore.actions.myCollection.artwork.takeOrPickPhotos = spy as any
    const wrapper = renderWithWrappers(mockAddPhotos)
    wrapper.root.findByType(tests.AddPhotosButton).findByType(TouchableOpacity).props.onPress()
    expect(spy).toHaveBeenCalled()
  })

  it("triggers action on add photo button click", () => {
    const spy = jest.fn()
    GlobalStore.actions.myCollection.artwork.takeOrPickPhotos = spy as any
    const mockNav = jest.fn()
    const mockRoute: Route<"AddPhotos", undefined> = {
      key: "AddPhotos",
      name: "AddPhotos",
      params: undefined,
    }
    const wrapper = renderWithWrappers(<MyCollectionAddPhotos navigation={mockNav as any} route={mockRoute} />)
    wrapper.root.findByType(tests.AddPhotosButton).findByType(TouchableOpacity).props.onPress()
    expect(spy).toHaveBeenCalled()
  })

  it("triggers action on delete photo button click", () => {
    const spy = jest.fn()
    GlobalStore.actions.myCollection.artwork.removePhoto = spy as any
    const mockNav = jest.fn()
    const mockRoute: Route<"AddPhotos", undefined> = {
      key: "AddPhotos",
      name: "AddPhotos",
      params: undefined,
    }
    const wrapper = renderWithWrappers(<MyCollectionAddPhotos navigation={mockNav as any} route={mockRoute} />)
    wrapper.root.findAllByType(tests.DeletePhotoButton)[0].findByType(TouchableOpacity).props.onPress()
    expect(spy).toHaveBeenCalledWith({ path: "photo/1" })
  })
})
