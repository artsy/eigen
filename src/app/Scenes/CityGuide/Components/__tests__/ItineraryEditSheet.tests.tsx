import { Text } from "@artsy/palette-mobile"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryEditSheetTestsQuery$data } from "__generated__/ItineraryEditSheetTestsQuery.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { ItineraryEditSheet } from "app/Scenes/CityGuide/Components/ItineraryEditSheet"
import { extractNodes } from "app/utils/extractNodes"
import * as imageUtils from "app/utils/getConvertedImageUrlFromS3"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

const photos = [{ path: "localCoverPath", width: 1200, height: 800 }]

const mockShowToast = jest.fn()

jest.mock("app/Components/Toast/toastHook", () => ({
  ...jest.requireActual("app/Components/Toast/toastHook"),
  useToast: () => ({ show: mockShowToast }),
}))

jest.mock("app/utils/requestPhotos", () => ({
  showPhotoActionSheet: jest.fn(() => Promise.resolve(photos)),
}))

// The real Image reads `src` through FastImage's `source.uri`, dropping `src` itself from
// the tree — swap in plain RN Image so tests can assert on `src` directly.
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("ItineraryEditSheet", () => {
  const onClose = jest.fn()
  const onDeleted = jest.fn()

  // Mutated by the cover-image tests that need a different starting itinerary — reassigned
  // per test rather than a fresh `const`, since `Component` below closes over this binding.
  let itinerary = {
    internalID: "itinerary-1",
    name: "London Oct 2026",
    description: "If time, check out Borough Market",
    heroImage: { url: "https://example.com/current-cover.jpg" } as { url: string | null } | null,
  }

  // No fragment of its own: the sheet takes plain props, but it commits mutations, so it
  // needs a Relay environment around it.
  const { renderWithRelay } = setupTestWrapper({
    Component: ({ me }: ItineraryEditSheetTestsQuery$data) => (
      <>
        <ItineraryEditSheet
          visible
          onClose={onClose}
          itinerary={itinerary}
          citySlug="london"
          onDeleted={onDeleted}
        />

        {/* Surfaces the connection's contents so the delete updater's effect on it is
            observable, the same way the itineraries list would render it. */}
        <Text testID="remaining-itineraries">
          {extractNodes(me?.itinerariesConnection)
            .map((node) => node.internalID)
            .join(",")}
        </Text>
      </>
    ),
    // The `itinerariesConnection` selection shares its storage key with
    // `CityItineraries_itinerariesConnection`, so a delete's store updater can be exercised
    // against a real connection record, the same as the itineraries list would hold.
    query: graphql`
      query ItineraryEditSheetTestsQuery @relay_test_operation {
        me {
          internalID
          itinerariesConnection(citySlug: "london", first: 20)
            @connection(key: "CityItineraries_itinerariesConnection") {
            edges {
              node {
                id
                internalID
              }
            }
          }
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    itinerary = {
      internalID: "itinerary-1",
      name: "London Oct 2026",
      description: "If time, check out Borough Market",
      heroImage: { url: "https://example.com/current-cover.jpg" },
    }
  })

  it("prefills the name and notes", () => {
    renderWithRelay({})

    expect(screen.getByTestId("itinerary-edit-name")).toHaveProp("value", "London Oct 2026")
    expect(screen.getByTestId("itinerary-edit-notes")).toHaveProp(
      "value",
      "If time, check out Borough Market"
    )
  })

  it("counts the notes against the limit the designs specify", () => {
    renderWithRelay({})

    // "If time, check out Borough Market" is 33 characters.
    expect(screen.getByText("33 / 200")).toBeOnTheScreen()

    fireEvent.changeText(screen.getByTestId("itinerary-edit-notes"), "Short")

    expect(screen.getByText("5 / 200")).toBeOnTheScreen()
  })

  it("caps the notes field at the limit", () => {
    renderWithRelay({})

    expect(screen.getByTestId("itinerary-edit-notes")).toHaveProp("maxLength", 200)
  })

  // Saving an itinerary with no name would leave it unlabelled everywhere it is listed.
  it("will not save an empty name", () => {
    renderWithRelay({})

    fireEvent.changeText(screen.getByTestId("itinerary-edit-name"), "   ")

    expect(screen.getByTestId("itinerary-edit-save")).toBeDisabled()
  })

  it("sends the edited title and notes when saved", () => {
    const { env } = renderWithRelay({})

    fireEvent.changeText(screen.getByTestId("itinerary-edit-name"), "London November")
    fireEvent.press(screen.getByTestId("itinerary-edit-save"))

    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
      id: "itinerary-1",
      title: "London November",
      description: "If time, check out Borough Market",
    })
  })

  it("deletes by id, then tells the caller", () => {
    const { env } = renderWithRelay({})

    fireEvent.press(screen.getByTestId("itinerary-edit-delete"))

    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
      id: "itinerary-1",
    })
  })

  // A successful delete leaves this itinerary's own screen, but the itineraries list's Relay
  // connection is a separate record this component doesn't own — without evicting it there,
  // the list would keep showing an itinerary that no longer exists until pulled to refresh.
  it("evicts the deleted itinerary from the itineraries list's connection", () => {
    const { mockResolveLastOperation } = renderWithRelay({
      Me: () => ({
        itinerariesConnection: {
          edges: [
            { node: { id: "itinerary-id-1", internalID: "itinerary-1" } },
            { node: { id: "itinerary-id-2", internalID: "itinerary-2" } },
          ],
        },
      }),
    })

    expect(screen.getByTestId("remaining-itineraries")).toHaveTextContent("itinerary-1,itinerary-2")

    fireEvent.press(screen.getByTestId("itinerary-edit-delete"))

    // Matches the connection's first node by `id` — the delete mutation itself is keyed by
    // `internalID`, but the Relay store identifies (and so evicts) records by `id`.
    mockResolveLastOperation({
      deleteItineraryPayload: () => ({
        responseOrError: {
          __typename: "ItineraryMutationSuccess",
          itinerary: { id: "itinerary-id-1" },
        },
      }),
    })

    expect(screen.getByTestId("remaining-itineraries")).toHaveTextContent("itinerary-2")
    expect(onDeleted).toHaveBeenCalled()
  })

  it("shows the current cover image and a remove option", async () => {
    renderWithRelay({})

    expect(await screen.findByTestId("itinerary-edit-cover-image")).toHaveProp(
      "src",
      "https://example.com/current-cover.jpg"
    )
    expect(screen.getByTestId("itinerary-edit-cover-remove")).toBeOnTheScreen()
  })

  it("shows a placeholder and no remove option when there is no cover", () => {
    itinerary = { ...itinerary, heroImage: null }

    renderWithRelay({})

    expect(screen.queryByTestId("itinerary-edit-cover-image")).not.toBeOnTheScreen()
    expect(screen.getByText("No cover")).toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-edit-cover-remove")).not.toBeOnTheScreen()
  })

  it("uploads the picked photo and saves its URL when saving", async () => {
    const uploadSpy = jest
      .spyOn(imageUtils, "getConvertedImageUrlFromS3")
      .mockResolvedValue("https://s3.example.com/new-cover.jpg")

    const { env } = renderWithRelay({})

    fireEvent.press(screen.getByTestId("itinerary-edit-cover-change"))

    expect(await screen.findByTestId("itinerary-edit-cover-image")).toHaveProp(
      "src",
      "localCoverPath"
    )

    fireEvent.press(screen.getByTestId("itinerary-edit-save"))

    await waitFor(() => expect(uploadSpy).toHaveBeenCalledWith("localCoverPath"))
    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
        id: "itinerary-1",
        title: "London Oct 2026",
        description: "If time, check out Borough Market",
        imageURL: "https://s3.example.com/new-cover.jpg",
      })
    )
  })

  it("sends a null imageURL when removing the cover", () => {
    const { env } = renderWithRelay({})

    fireEvent.press(screen.getByTestId("itinerary-edit-cover-remove"))
    fireEvent.press(screen.getByTestId("itinerary-edit-save"))

    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
      id: "itinerary-1",
      title: "London Oct 2026",
      description: "If time, check out Borough Market",
      imageURL: null,
    })
  })

  describe("while the cover uploads", () => {
    const pickAndSave = async () => {
      fireEvent.press(screen.getByTestId("itinerary-edit-cover-change"))
      await screen.findByTestId("itinerary-edit-cover-image")
      fireEvent.press(screen.getByTestId("itinerary-edit-save"))
    }

    it("locks Delete and the cover controls", async () => {
      jest.spyOn(imageUtils, "getConvertedImageUrlFromS3").mockReturnValue(new Promise(() => {}))

      renderWithRelay({})
      await pickAndSave()

      await waitFor(() => expect(screen.getByTestId("itinerary-edit-delete")).toBeDisabled())
      expect(screen.getByTestId("itinerary-edit-cover-change")).toBeDisabled()
      expect(screen.getByTestId("itinerary-edit-cover-remove")).toBeDisabled()
    })

    it("can't be swiped or tapped away", async () => {
      jest.spyOn(imageUtils, "getConvertedImageUrlFromS3").mockReturnValue(new Promise(() => {}))

      renderWithRelay({})

      const sheetProps = () => screen.UNSAFE_getByType(AutomountedBottomSheetModal).props

      expect(sheetProps()).toMatchObject({ enablePanDownToClose: true, closeOnBackdropClick: true })

      await pickAndSave()

      await waitFor(() =>
        expect(sheetProps()).toMatchObject({
          enablePanDownToClose: false,
          closeOnBackdropClick: false,
        })
      )
    })

    it("tells the user when the upload fails, and saves nothing", async () => {
      jest.spyOn(imageUtils, "getConvertedImageUrlFromS3").mockRejectedValue(new Error("S3 down"))
      jest.spyOn(console, "error").mockImplementation(() => {})

      const { env } = renderWithRelay({})
      await pickAndSave()

      await waitFor(() =>
        expect(mockShowToast).toHaveBeenCalledWith("Could not upload your photo", "bottom")
      )
      expect(env.mock.getAllOperations()).toHaveLength(0)
      expect(onClose).not.toHaveBeenCalled()
    })

    // Android back still closes the sheet mid-upload; that cancels the save, so a later
    // sheet can't have its Delete race this update or be closed by it.
    it("saves nothing and doesn't call onClose once the sheet has closed", async () => {
      let finishUpload: (url: string) => void = () => {}
      jest
        .spyOn(imageUtils, "getConvertedImageUrlFromS3")
        .mockReturnValue(new Promise((resolve) => (finishUpload = resolve)))

      const { env, unmount } = renderWithRelay({})
      await pickAndSave()
      unmount()

      finishUpload("https://s3.example.com/new-cover.jpg")
      await new Promise(process.nextTick)

      expect(env.mock.getAllOperations()).toHaveLength(0)
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe("the store after saving a cover change", () => {
    const heroImageInStore = (env: ReturnType<typeof createMockEnvironment>) => {
      const source = env.getStore().getSource()
      const ref = source.get("itinerary-id-1")?.heroImage as { __ref: string } | null | undefined

      return ref ? source.get(ref.__ref) : ref
    }

    const resolveUpdate = (
      mockResolveLastOperation: (resolvers: Record<string, () => unknown>) => void
    ) =>
      mockResolveLastOperation({
        updateItineraryPayload: () => ({
          responseOrError: {
            __typename: "ItineraryMutationSuccess",
            // Gravity processes a new image in the background, so the response still has the
            // old one.
            itinerary: {
              id: "itinerary-id-1",
              heroImage: {
                url: "https://example.com/current-cover.jpg",
                smallUrl: "https://example.com/current-cover-small.jpg",
                width: 400,
                height: 800,
                aspectRatio: 0.5,
                blurhash: "old-blurhash",
              },
            },
          },
        }),
      })

    it("shows the picked photo, with its own shape and no stale blurhash", async () => {
      jest
        .spyOn(imageUtils, "getConvertedImageUrlFromS3")
        .mockResolvedValue("https://s3.example.com/new-cover.jpg")

      const { env, mockResolveLastOperation } = renderWithRelay({})

      fireEvent.press(screen.getByTestId("itinerary-edit-cover-change"))
      await screen.findByTestId("itinerary-edit-cover-image")
      fireEvent.press(screen.getByTestId("itinerary-edit-save"))

      await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(1))
      resolveUpdate(mockResolveLastOperation)

      expect(heroImageInStore(env)).toMatchObject({
        'url(version:"large")': "localCoverPath",
        'url(version:"small")': "localCoverPath",
        width: 1200,
        height: 800,
        aspectRatio: 1.5,
        blurhash: null,
      })
      expect(onClose).toHaveBeenCalled()
    })

    it("clears the cover when it was removed", () => {
      const { env, mockResolveLastOperation } = renderWithRelay({})

      fireEvent.press(screen.getByTestId("itinerary-edit-cover-remove"))
      fireEvent.press(screen.getByTestId("itinerary-edit-save"))
      resolveUpdate(mockResolveLastOperation)

      expect(heroImageInStore(env)).toBeNull()
    })
  })

  it("offers to add a cover when there is none", () => {
    itinerary = { ...itinerary, heroImage: null }

    renderWithRelay({})

    expect(screen.getByLabelText("Add cover photo")).toBeOnTheScreen()
    expect(screen.getByText("Add cover photo")).toBeOnTheScreen()
    expect(screen.queryByText("Change cover photo")).not.toBeOnTheScreen()
  })
})
