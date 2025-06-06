import { waitFor } from "@testing-library/react-native"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { MyCollectionArtworkStore } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkStore"
import {
  DELAY_TIME_MS,
  MyCollectionAddPhotos,
  tests,
} from "app/Scenes/MyCollection/Screens/ArtworkForm/Screens/MyCollectionArtworkFormAddPhotos"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { ReactElement } from "react"
import { Image, TouchableOpacity } from "react-native"

jest.mock("app/utils/requestPhotos", () => ({
  showPhotoActionSheet: jest.fn(() => Promise.resolve({ photos: [] })),
}))

jest.mock("formik")

const mockNav = jest.fn()

const Wrapper = () => (
  <MyCollectionArtworkStore.Provider>
    <MyCollectionAddPhotos navigation={mockNav as any} route={null as any} />
  </MyCollectionArtworkStore.Provider>
)

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

    mockAddPhotos = <Wrapper />
  })

  it("updates header with correct label based on number of photos selected", () => {
    const wrapper = renderWithWrappersLEGACY(mockAddPhotos)
    expect(wrapper.root.findByType(NavigationHeader).props.children).toStrictEqual([
      "Photos ",
      "(2)",
    ])
  })

  it("displays the correct number of photos", async () => {
    const wrapper = renderWithWrappersLEGACY(mockAddPhotos)
    await waitFor(
      () => {
        expect(wrapper.root.findAllByType(Image).length).toBe(2)
        expect(wrapper.root.findAllByType(tests.DeletePhotoButton).length).toBe(2)
      },
      // In MyCollectionAddPhotos We delay by DELAY_TIME_MS while showing a lighter placeholder before
      // loading the heavier images.
      { timeout: DELAY_TIME_MS + 1000 }
    )
  })

  it("renders add photo button", () => {
    const wrapper = renderWithWrappersLEGACY(mockAddPhotos)
    expect(wrapper.root.findByType(tests.AddPhotosButton)).toBeDefined()
  })

  it("triggers action on add photo button click", () => {
    const wrapper = renderWithWrappersLEGACY(mockAddPhotos)
    wrapper.root.findByType(tests.AddPhotosButton).findByType(TouchableOpacity).props.onPress()
    expect(showPhotoActionSheet).toHaveBeenCalled()
  })

  it("triggers action on add photo button click", () => {
    const wrapper = renderWithWrappersLEGACY(<Wrapper />)
    wrapper.root.findByType(tests.AddPhotosButton).findByType(TouchableOpacity).props.onPress()
    expect(showPhotoActionSheet).toHaveBeenCalled()
  })

  it("triggers action on delete photo button click", async () => {
    const spy = jest.fn()
    GlobalStore.actions.myCollection.artwork.removePhoto = spy as any

    const wrapper = renderWithWrappersLEGACY(<Wrapper />)
    await waitFor(
      () => {
        wrapper.root
          .findAllByType(tests.DeletePhotoButton)[0]
          .findByType(TouchableOpacity)
          .props.onPress()
        expect(spy).toHaveBeenCalledWith({ path: "photo/1" })
      },
      // In MyCollectionAddPhotos We delay by DELAY_TIME_MS while showing a lighter placeholder before
      // loading the heavier images.
      { timeout: DELAY_TIME_MS + 1000 }
    )
  })
})
