import { Text } from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryEditSheetTestsQuery$data } from "__generated__/ItineraryEditSheetTestsQuery.graphql"
import { ItineraryEditSheet } from "app/Scenes/CityGuide/Components/ItineraryEditSheet"
import { extractNodes } from "app/utils/extractNodes"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockShowToast = jest.fn()

jest.mock("app/Components/Toast/toastHook", () => ({
  ...jest.requireActual("app/Components/Toast/toastHook"),
  useToast: () => ({ show: mockShowToast }),
}))

jest.mock("app/utils/requestPhotos", () => ({ showPhotoActionSheet: jest.fn() }))
jest.mock("app/utils/getConvertedImageUrlFromS3", () => ({ getConvertedImageUrlFromS3: jest.fn() }))

// The real Image passes `src` to FastImage as `source.uri`, so swap in RN's Image to assert on it.
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("ItineraryEditSheet", () => {
  const onClose = jest.fn()
  const onDeleted = jest.fn()
  const onCoverSaved = jest.fn()

  const itinerary = {
    internalID: "itinerary-1",
    name: "London Oct 2026",
    description: "If time, check out Borough Market",
    coverImageUrl: "https://example.com/cover.jpg",
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
          onCoverSaved={onCoverSaved}
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

  beforeEach(async () => {
    jest.clearAllMocks()
    await AsyncStorage.clear()
  })

  it("prefills the name and notes", () => {
    renderWithRelay({})

    expect(screen.getByTestId("itinerary-edit-name")).toHaveProp("defaultValue", "London Oct 2026")
    expect(screen.getByTestId("itinerary-edit-notes")).toHaveProp(
      "defaultValue",
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

  // The list pages by offset: without a reload, its next page would start one itinerary late.
  it("reloads the itineraries list's first page after a delete", () => {
    const { env, mockResolveLastOperation } = renderWithRelay({
      Me: () => ({
        itinerariesConnection: {
          edges: [{ node: { id: "itinerary-id-1", internalID: "itinerary-1" } }],
        },
      }),
    })

    fireEvent.press(screen.getByTestId("itinerary-edit-delete"))

    mockResolveLastOperation({
      deleteItineraryPayload: () => ({
        responseOrError: {
          __typename: "ItineraryMutationSuccess",
          itinerary: { id: "itinerary-id-1" },
        },
      }),
    })

    const listQuery = env.mock
      .getAllOperations()
      .find((operation) => operation.request.node.params.name === "CityItinerariesQuery")
    expect(listQuery?.request.variables).toEqual({ citySlug: "london" })
  })

  // Deleting the only itinerary used to leave the city guide's "Your Itineraries" rail showing it.
  it("refetches the itineraries rail after a delete", () => {
    const { env, mockResolveLastOperation } = renderWithRelay({})

    fireEvent.press(screen.getByTestId("itinerary-edit-delete"))

    mockResolveLastOperation({
      deleteItineraryPayload: () => ({
        responseOrError: {
          __typename: "ItineraryMutationSuccess",
          itinerary: { id: "itinerary-id-1" },
        },
      }),
    })

    const railQuery = env.mock
      .getAllOperations()
      .find((operation) => operation.request.node.params.name === "CityGuideItinerariesRailQuery")
    expect(railQuery?.request.variables).toEqual({ citySlug: "london", first: 10 })
  })

  describe("cover photo", () => {
    const photo = { path: "file:///photo.jpg", width: 1200, height: 800 }

    const pickPhoto = async () => {
      jest.mocked(showPhotoActionSheet).mockResolvedValue([photo] as any)
      fireEvent.press(screen.getByTestId("itinerary-edit-cover"))
      await waitFor(() =>
        expect(screen.getByTestId("itinerary-edit-cover-image")).toHaveProp("src", photo.path)
      )
    }

    it("shows the current cover", () => {
      renderWithRelay({})

      expect(screen.getByTestId("itinerary-edit-cover-image")).toHaveProp(
        "src",
        "https://example.com/cover.jpg"
      )
      expect(screen.getByText("Change cover photo")).toBeOnTheScreen()
    })

    it("uploads a picked photo, sends its URL, then keeps it on the device", async () => {
      jest.mocked(getConvertedImageUrlFromS3).mockResolvedValue("https://s3.example.com/new.jpg")
      const { env, mockResolveLastOperation } = renderWithRelay({})

      await pickPhoto()
      fireEvent.press(screen.getByTestId("itinerary-edit-save"))

      await waitFor(() =>
        expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
          id: "itinerary-1",
          title: "London Oct 2026",
          description: "If time, check out Borough Market",
          imageURL: "https://s3.example.com/new.jpg",
        })
      )
      expect(getConvertedImageUrlFromS3).toHaveBeenCalledWith(photo.path)

      mockResolveLastOperation({})

      await waitFor(() => expect(onCoverSaved).toHaveBeenCalled())
      expect(onClose).toHaveBeenCalled()
      const stored = await AsyncStorage.getItem("IMAGES_itinerary-cover-itinerary-1")
      expect(JSON.parse(stored!)).toMatchObject({ path: photo.path, width: 1200, height: 800 })
    })

    it("sends nothing and says so when the upload fails", async () => {
      jest.mocked(getConvertedImageUrlFromS3).mockRejectedValue(new Error("S3 is down"))
      const { env } = renderWithRelay({})

      await pickPhoto()
      fireEvent.press(screen.getByTestId("itinerary-edit-save"))

      await waitFor(() =>
        expect(mockShowToast).toHaveBeenCalledWith("Could not save your changes", "bottom")
      )
      expect(env.mock.getAllOperations()).toHaveLength(0)
      expect(onClose).not.toHaveBeenCalled()
    })
  })
})
