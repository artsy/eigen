import { Text } from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryEditSheetTestsQuery$data } from "__generated__/ItineraryEditSheetTestsQuery.graphql"
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

const mockShowPhotoActionSheet = jest.fn()

jest.mock("app/utils/requestPhotos", () => ({
  showPhotoActionSheet: (...args: unknown[]) => mockShowPhotoActionSheet(...args),
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
    id: "itinerary-id-1",
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
        itinerary(id: "itinerary-1") {
          id
          title
          description
          heroImage {
            url(version: "large")
            smallUrl: url(version: "small")
            width
            height
            aspectRatio
            blurhash
          }
        }
      }
    `,
  })

  // The record the sheet's save updates in the store, as the itinerary screen would hold it.
  const Query = () => ({
    itinerary: {
      id: "itinerary-id-1",
      title: "London Oct 2026",
      description: "If time, check out Borough Market",
      heroImage: {
        url: "https://example.com/current-cover.jpg",
        smallUrl: "https://example.com/current-cover-small.jpg",
        width: 400,
        height: 800,
        aspectRatio: 0.5,
        blurhash: "old-blurhash",
      },
    },
  })

  const heroImageInStore = (env: ReturnType<typeof createMockEnvironment>) => {
    const source = env.getStore().getSource()
    const ref = source.get("itinerary-id-1")?.heroImage as { __ref: string } | null | undefined

    return ref ? source.get(ref.__ref) : ref
  }

  const localHeroImage = {
    'url(version:"large")': "localCoverPath",
    'url(version:"small")': "localCoverPath",
    width: 1200,
    height: 800,
    aspectRatio: 1.5,
    blurhash: null,
  }

  const pickAndSave = async () => {
    fireEvent.press(screen.getByTestId("itinerary-edit-cover-change"))
    await waitFor(() =>
      expect(screen.getByTestId("itinerary-edit-cover-image")).toHaveProp("src", "localCoverPath")
    )
    fireEvent.press(screen.getByTestId("itinerary-edit-save"))
  }

  const updateMutations = (env: ReturnType<typeof createMockEnvironment>) =>
    env.mock
      .getAllOperations()
      .filter(
        (operation) => operation.request.node.operation.name === "saveItineraryUpdateMutation"
      )

  /** Each call to the upload returns a promise the test settles itself. */
  const controlUploads = () => {
    const uploads: { resolve: (url: string) => void; reject: (error: Error) => void }[] = []
    const spy = jest.spyOn(imageUtils, "getConvertedImageUrlFromS3").mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          uploads.push({ resolve, reject })
        })
    )

    return { uploads, spy }
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    mockShowPhotoActionSheet.mockImplementation(() => Promise.resolve(photos))
    await AsyncStorage.clear()
    itinerary = {
      id: "itinerary-id-1",
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

  it("sends the edited title and notes when saved, and closes right away", () => {
    const { env } = renderWithRelay({ Query })

    fireEvent.changeText(screen.getByTestId("itinerary-edit-name"), "London November")
    fireEvent.press(screen.getByTestId("itinerary-edit-save"))

    expect(onClose).toHaveBeenCalled()
    expect(env.getStore().getSource().get("itinerary-id-1")?.title).toEqual("London November")
    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
      id: itinerary.internalID,
      title: "London November",
      description: "If time, check out Borough Market",
    })
  })

  it("puts the old title back and tells the user when the update fails", async () => {
    const { env, mockRejectLastOperation } = renderWithRelay({ Query })

    fireEvent.changeText(screen.getByTestId("itinerary-edit-name"), "London November")
    fireEvent.press(screen.getByTestId("itinerary-edit-save"))
    mockRejectLastOperation(new Error("Gravity down"))

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith("Could not save your changes", "bottom")
    )
    expect(env.getStore().getSource().get("itinerary-id-1")?.title).toEqual("London Oct 2026")
  })

  it("treats an ItineraryMutationFailure response as a failure", async () => {
    const { env, mockResolveLastOperation } = renderWithRelay({ Query })

    fireEvent.changeText(screen.getByTestId("itinerary-edit-name"), "London November")
    fireEvent.press(screen.getByTestId("itinerary-edit-save"))
    mockResolveLastOperation({
      updateItineraryPayload: () => ({
        responseOrError: {
          __typename: "ItineraryMutationFailure",
          mutationError: { message: "Nope" },
        },
      }),
    })

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith("Could not save your changes", "bottom")
    )
    expect(env.getStore().getSource().get("itinerary-id-1")?.title).toEqual("London Oct 2026")
  })

  it("deletes by id, then tells the caller", () => {
    const { env } = renderWithRelay({})

    fireEvent.press(screen.getByTestId("itinerary-edit-delete"))

    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
      id: itinerary.internalID,
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

  describe("saving a new cover", () => {
    it("closes the sheet and shows the local photo before the upload finishes", async () => {
      const { spy } = controlUploads()

      const { env } = renderWithRelay({ Query })
      await pickAndSave()

      expect(onClose).toHaveBeenCalled()
      expect(heroImageInStore(env)).toMatchObject(localHeroImage)
      await waitFor(() => expect(spy).toHaveBeenCalledWith("localCoverPath"))
      expect(updateMutations(env)).toHaveLength(0)
    })

    it("sends the title, notes and uploaded URL in one mutation after the upload", async () => {
      const { uploads, spy } = controlUploads()

      const { env } = renderWithRelay({ Query })
      fireEvent.changeText(screen.getByTestId("itinerary-edit-name"), "London November")
      await pickAndSave()

      await waitFor(() => expect(spy).toHaveBeenCalledWith("localCoverPath"))
      uploads[0].resolve("https://s3.example.com/new-cover.jpg")

      await waitFor(() => expect(updateMutations(env)).toHaveLength(1))
      expect(updateMutations(env)[0].request.variables.input).toEqual({
        id: itinerary.internalID,
        title: "London November",
        description: "If time, check out Borough Market",
        imageURL: "https://s3.example.com/new-cover.jpg",
      })
    })

    it("puts the old cover back and tells the user when the upload fails", async () => {
      const { uploads, spy } = controlUploads()

      const { env } = renderWithRelay({ Query })
      await pickAndSave()

      await waitFor(() => expect(spy).toHaveBeenCalled())
      act(() => uploads[0].reject(new Error("S3 down")))

      await waitFor(() =>
        expect(mockShowToast).toHaveBeenCalledWith("Could not save your changes", "bottom")
      )
      expect(heroImageInStore(env)).toMatchObject({
        'url(version:"large")': "https://example.com/current-cover.jpg",
        blurhash: "old-blurhash",
      })
      expect(await AsyncStorage.getItem("IMAGES_itinerary-cover-itinerary-1")).toBeNull()
      expect(updateMutations(env)).toHaveLength(0)
    })
  })

  describe("removing the cover", () => {
    it("sends a null imageURL and clears the cover in the store", async () => {
      const { env } = renderWithRelay({ Query })

      fireEvent.press(screen.getByTestId("itinerary-edit-cover-remove"))
      fireEvent.press(screen.getByTestId("itinerary-edit-save"))

      expect(onClose).toHaveBeenCalled()
      expect(heroImageInStore(env)).toBeNull()
      await waitFor(() => expect(updateMutations(env)).toHaveLength(1))
      expect(updateMutations(env)[0].request.variables.input).toEqual({
        id: itinerary.internalID,
        title: "London Oct 2026",
        description: "If time, check out Borough Market",
        imageURL: null,
      })
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
