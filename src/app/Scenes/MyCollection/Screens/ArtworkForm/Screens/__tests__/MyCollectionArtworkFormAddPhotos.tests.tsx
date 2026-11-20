import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { MyCollectionArtworkStore } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkStore"
import {
  DELAY_TIME_MS,
  MyCollectionAddPhotos,
} from "app/Scenes/MyCollection/Screens/ArtworkForm/Screens/MyCollectionArtworkFormAddPhotos"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ReactElement } from "react"

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
    renderWithWrappers(mockAddPhotos)
    expect(screen.getByText("Photos (2)")).toBeOnTheScreen()
  })

  it("displays the correct number of photos", async () => {
    renderWithWrappers(mockAddPhotos)
    // In MyCollectionAddPhotos We delay by DELAY_TIME_MS while showing a lighter placeholder before
    // loading the heavier images.
    expect(
      await screen.findAllByTestId("artwork-form-photo", {}, { timeout: DELAY_TIME_MS + 1000 })
    ).toHaveLength(2)
    expect(screen.getAllByLabelText("Delete photo")).toHaveLength(2)
  })

  it("renders add photo button", () => {
    renderWithWrappers(mockAddPhotos)
    expect(screen.getByLabelText("Add photos")).toBeOnTheScreen()
  })

  it("triggers action on add photo button click", () => {
    renderWithWrappers(mockAddPhotos)
    fireEvent.press(screen.getByLabelText("Add photos"))
    expect(showPhotoActionSheet).toHaveBeenCalled()
  })

  it("triggers action on add photo button click", () => {
    renderWithWrappers(<Wrapper />)
    fireEvent.press(screen.getByLabelText("Add photos"))
    expect(showPhotoActionSheet).toHaveBeenCalled()
  })

  it("triggers action on delete photo button click", async () => {
    const spy = jest.fn()
    GlobalStore.actions.myCollection.artwork.removePhoto = spy as any

    renderWithWrappers(<Wrapper />)
    // In MyCollectionAddPhotos We delay by DELAY_TIME_MS while showing a lighter placeholder before
    // loading the heavier images.
    const deleteButtons = await screen.findAllByLabelText(
      "Delete photo",
      {},
      { timeout: DELAY_TIME_MS + 1000 }
    )
    fireEvent.press(deleteButtons[0])
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ path: "photo/1" }))
  })
})
