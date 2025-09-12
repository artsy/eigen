import { act, fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionArtworkFormDeleteArtworkModal } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/MyCollectionArtworkFormDeleteArtworkModal"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

const mockHideModal = jest.fn()
const mockDeleteArtwork = jest.fn()

describe("MyCollectionArtworkFormDeleteArtworkModal", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    jest.clearAllMocks()
    mockEnvironment = createMockEnvironment()
  })

  it("deletes an artwork without deleting artist by default", async () => {
    renderWithHookWrappersTL(
      <MyCollectionArtworkFormDeleteArtworkModal
        visible
        hideModal={mockHideModal}
        deleteArtwork={mockDeleteArtwork}
        artistID="artist-id"
      />,
      mockEnvironment
    )

    await act(async () => {
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({
          name: "Amoako Boafo",
        }),
      })

      await flushPromiseQueue()
    })

    const deleteButton = screen.getByText("Delete Artwork")

    fireEvent.press(deleteButton)

    expect(mockDeleteArtwork).toHaveBeenCalledWith(false)
  })

  it("deletes the artwork then artist when artworks count is 1 and user checked artwork deletion box", async () => {
    renderWithHookWrappersTL(
      <MyCollectionArtworkFormDeleteArtworkModal
        visible
        hideModal={mockHideModal}
        deleteArtwork={mockDeleteArtwork}
        artistID="artist-id"
      />,
      mockEnvironment
    )

    await act(async () => {
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({
          name: "Amoako Boafo",
        }),
        Me: () => ({
          myCollectionConnection: {
            totalCount: 1,
          },
        }),
      })

      await flushPromiseQueue()
    })

    const deleteButton = screen.getByText("Delete Artwork")

    const deleteArtistCheckbox = screen.getByText(
      "Remove Amoako Boafo from the artists you collect"
    )

    fireEvent(deleteArtistCheckbox, "onPress")

    await flushPromiseQueue()

    fireEvent.press(deleteButton)

    expect(mockDeleteArtwork).toHaveBeenCalledWith(true)
  })

  it("can not delete artist when artworks count more than 1", async () => {
    renderWithHookWrappersTL(
      <MyCollectionArtworkFormDeleteArtworkModal
        visible
        hideModal={mockHideModal}
        deleteArtwork={mockDeleteArtwork}
        artistID="artist-id"
      />,
      mockEnvironment
    )

    await act(async () => {
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({
          name: "Amoako Boafo",
        }),
        Me: () => ({
          myCollectionConnection: {
            totalCount: 10,
          },
        }),
      })

      await flushPromiseQueue()
    })

    const deleteButton = screen.getByText("Delete Artwork")

    const deleteArtistCheckbox = screen.getByText(
      "Remove Amoako Boafo from the artists you collect"
    )

    fireEvent(deleteArtistCheckbox, "onPress")

    await flushPromiseQueue()

    fireEvent.press(deleteButton)

    expect(mockDeleteArtwork).toHaveBeenCalledWith(false)
  })

  it("Hides modal when the user clicks on delete", async () => {
    renderWithHookWrappersTL(
      <MyCollectionArtworkFormDeleteArtworkModal
        visible
        hideModal={mockHideModal}
        deleteArtwork={mockDeleteArtwork}
        artistID="artist-id"
      />,
      mockEnvironment
    )

    await act(async () => {
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({
          name: "Amoako Boafo",
        }),
      })

      await flushPromiseQueue()
    })

    const cancelButton = screen.getByText("Cancel")

    fireEvent.press(cancelButton)

    expect(mockHideModal).toHaveBeenCalled()
    expect(mockDeleteArtwork).not.toHaveBeenCalled()
  })
})
