import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import React, { ReactElement } from "react"
import { Image, TouchableOpacity } from "react-native"
import { MyCollectionAddPhotos, tests } from "./MyCollectionArtworkFormAddPhotos"

jest.mock("app/utils/requestPhotos", () => ({
  showPhotoActionSheet: jest.fn(() => Promise.resolve({ photos: [] })),
}))

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
    mockAddPhotos = <MyCollectionAddPhotos navigation={mockNav as any} route={{} as any} />
  })

  it("updates header with correct label based on number of photos selected", () => {
    const wrapper = renderWithWrappers(mockAddPhotos)
    expect(wrapper.root.findByType(FancyModalHeader).props.children).toStrictEqual([
      "Photos ",
      "(2)",
    ])
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
    const wrapper = renderWithWrappers(mockAddPhotos)
    wrapper.root.findByType(tests.AddPhotosButton).findByType(TouchableOpacity).props.onPress()
    expect(showPhotoActionSheet).toHaveBeenCalled()
  })

  it("triggers action on add photo button click", () => {
    const mockNav = jest.fn()
    const wrapper = renderWithWrappers(
      <MyCollectionAddPhotos navigation={mockNav as any} route={{} as any} />
    )
    wrapper.root.findByType(tests.AddPhotosButton).findByType(TouchableOpacity).props.onPress()
    expect(showPhotoActionSheet).toHaveBeenCalled()
  })

  it("triggers action on delete photo button click", () => {
    const spy = jest.fn()
    GlobalStore.actions.myCollection.artwork.removePhoto = spy as any
    const mockNav = jest.fn()
    const wrapper = renderWithWrappers(
      <MyCollectionAddPhotos navigation={mockNav as any} route={{} as any} />
    )
    wrapper.root
      .findAllByType(tests.DeletePhotoButton)[0]
      .findByType(TouchableOpacity)
      .props.onPress()
    expect(spy).toHaveBeenCalledWith({ path: "photo/1" })
  })
})
