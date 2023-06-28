import { fireEvent } from "@testing-library/react-native"
import { MyCollectionArtworkFormDeleteArtworkModal } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/MyCollectionArtworkFormDeleteArtworkModal"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const mockHideModal = jest.fn()
const mockDeleteArtwork = jest.fn()

describe("MyCollectionArtworkFormDeleteArtworkModal", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("deletes an artwork without deleting artwork by default", () => {
    const { getByText } = renderWithWrappers(
      <MyCollectionArtworkFormDeleteArtworkModal
        visible={true}
        hideModal={mockHideModal}
        deleteArtwork={mockDeleteArtwork}
      />
    )

    const deleteButton = getByText("Delete Artwork")
    fireEvent.press(deleteButton)

    expect(mockDeleteArtwork).toHaveBeenCalledWith(false)
  })

  it("deletes the artwork and the artist when delete artist is checked", () => {
    const { getByText } = renderWithWrappers(
      <MyCollectionArtworkFormDeleteArtworkModal
        visible={true}
        hideModal={mockHideModal}
        deleteArtwork={mockDeleteArtwork}
      />
    )

    const deleteButton = getByText("Delete Artwork")
    const deleteArtistCheckbox = getByText("Remove Amoako Boafo from the artists you collect")

    fireEvent(deleteArtistCheckbox, "onPress")

    fireEvent.press(deleteButton)

    expect(mockDeleteArtwork).toHaveBeenCalledWith(true)
  })

  it("Hides modal when the user clicks on delete", () => {
    const { getByText } = renderWithWrappers(
      <MyCollectionArtworkFormDeleteArtworkModal
        visible={true}
        hideModal={mockHideModal}
        deleteArtwork={mockDeleteArtwork}
      />
    )

    const cancelButton = getByText("Cancel")

    fireEvent.press(cancelButton)

    expect(mockHideModal).toHaveBeenCalled()
    expect(mockDeleteArtwork).not.toHaveBeenCalled()
  })
})
