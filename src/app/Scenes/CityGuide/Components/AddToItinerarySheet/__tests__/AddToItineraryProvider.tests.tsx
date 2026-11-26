import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import {
  AddToItineraryProvider,
  useAddToItinerary,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
import { MockPayloadGenerator } from "relay-test-utils"

const mockShowToast = jest.fn()
jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => ({ show: mockShowToast }),
}))

jest.mock("app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItinerarySheet", () => ({
  AddToItinerarySheet: ({ target }: { target: unknown }) => {
    const { Text: RNText } = require("react-native")
    return target ? <RNText>sheet-open</RNText> : null
  },
  screenOwnerFields: () => ({}),
  stopOwnerFields: () => ({}),
}))

const Plus: React.FC<{ itemID?: string; isOnMyItineraries?: boolean }> = ({
  itemID = "show-1",
  isOnMyItineraries,
}) => {
  const addToItinerary = useAddToItinerary()

  return (
    <>
      <Text
        onPress={() => {
          // A block body: returning the promise would make `fireEvent` wait on the network.
          addToItinerary?.open({ itemType: "SHOW", itemID, isOnMyItineraries })
        }}
      >
        {`plus ${itemID}`}
      </Text>

      {!!addToItinerary?.isActive("SHOW", itemID) && <Text>{`active ${itemID}`}</Text>}
    </>
  )
}

describe("AddToItineraryProvider", () => {
  const renderIt = async (isOnMyItineraries?: boolean) =>
    await renderWithWrappers(
      <AddToItineraryProvider citySlug="london-united-kingdom" cityName="London">
        <Plus isOnMyItineraries={isOnMyItineraries} />
        <Plus itemID="show-2" />
      </AddToItineraryProvider>
    )

  const resolveNext = async (name: string, resolvers: object) => {
    const env = getMockRelayEnvironment()

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.params.name).toEqual(name)
    )
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, resolvers)
    )
  }

  beforeEach(() => jest.clearAllMocks())

  const noItineraries = { Me: () => ({ itinerariesConnection: { edges: [] } }) }

  /** Taps a plus, and gets as far as the "Add to New Itinerary" sheet. */
  const openNamingSheet = async (itemID = "show-1") => {
    await fireEvent.press(screen.getByText(`plus ${itemID}`))
    await resolveNext("AddToItineraryProviderLookupQuery", noItineraries)

    return await screen.findByText("Add to New Itinerary")
  }

  it("asks for a name, not the list, when the user has no itinerary for the city", async () => {
    await renderIt()

    await openNamingSheet()

    expect(screen.queryByText("sheet-open")).toBeNull()
    // The plus stays pressed for as long as the sheet is up, not only while the finger is down.
    expect(screen.getByText("active show-1")).toBeTruthy()
    expect(screen.queryByText("active show-2")).toBeNull()
    expect(screen.getByTestId("create-itinerary-name").props.value).toMatch(/^London /)
    // Nothing to go back to: there is no list.
    expect(screen.queryByTestId("create-itinerary-back")).toBeNull()
    // Nothing is made until Create is pressed.
    expect(mockShowToast).not.toHaveBeenCalled()
  })

  it("creates the itinerary under the typed name and adds the stop when Create is pressed", async () => {
    await renderIt()
    await openNamingSheet()

    await fireEvent.changeText(screen.getByTestId("create-itinerary-name"), "My Paris Trip")
    await fireEvent.press(screen.getByTestId("create-itinerary-submit"))

    // `addStop` looks again before creating anything.
    await resolveNext("useCityItineraryStopsLookupQuery", noItineraries)

    const create = getMockRelayEnvironment().mock.getMostRecentOperation()
    expect(create.request.node.params.name).toEqual("useCityItineraryStopsCreateItineraryMutation")
    expect(create.request.variables.input).toEqual(
      expect.objectContaining({ title: "My Paris Trip" })
    )

    await resolveNext("useCityItineraryStopsCreateItineraryMutation", {
      createItineraryPayload: () => ({
        responseOrError: {
          __typename: "ItineraryMutationSuccess",
          itinerary: { internalID: "itinerary-1" },
        },
      }),
    })
    await resolveNext("useCityItineraryStopsCreateSectionMutation", {
      createItinerarySectionPayload: () => ({
        responseOrError: {
          __typename: "ItinerarySectionMutationSuccess",
          itinerarySection: { internalID: "section-1" },
        },
      }),
    })
    await resolveNext("useCityItineraryStopsAddMutation", {
      createItineraryStopPayload: () => ({
        responseOrError: {
          __typename: "ItineraryStopMutationSuccess",
          itineraryStop: { internalID: "stop-1" },
        },
      }),
    })

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith(
        "Added to your Itinerary",
        "bottom",
        expect.objectContaining({ cta: "View Itinerary" })
      )
    )
    expect(screen.queryByText("sheet-open")).toBeNull()
  })

  it("opens the sheet when the user already has an itinerary for the city", async () => {
    await renderIt()

    await fireEvent.press(screen.getByText("plus show-1"))

    await resolveNext("AddToItineraryProviderLookupQuery", {
      Me: () => ({
        itinerariesConnection: {
          edges: [{ node: { internalID: "itinerary-1", isCurated: false } }],
        },
      }),
    })

    expect(await screen.findByText("sheet-open")).toBeTruthy()
    expect(mockShowToast).not.toHaveBeenCalled()
    // Pressed for as long as the list sheet is up, too.
    expect(screen.getByText("active show-1")).toBeTruthy()
  })

  it("does not leave the plus pressed once there is nothing left to do", async () => {
    await renderIt()

    expect(screen.queryByText("active show-1")).toBeNull()
  })

  describe("once Create has been pressed, while the first itinerary is still being made", () => {
    it("shows the plus as added at once, and ignores another tap on the same card", async () => {
      await renderIt()
      await openNamingSheet()

      await fireEvent.press(screen.getByTestId("create-itinerary-submit"))

      expect(await screen.findByText("active show-1")).toBeTruthy()

      const env = getMockRelayEnvironment()
      const pending = env.mock.getAllOperations().length

      await fireEvent.press(screen.getByText("plus show-1"))

      expect(env.mock.getAllOperations()).toHaveLength(pending)
    })

    it("adds a second card tapped meanwhile, rather than asking again or opening a sheet", async () => {
      await renderIt()
      await openNamingSheet()
      await fireEvent.press(screen.getByTestId("create-itinerary-submit"))
      await screen.findByText("active show-1")

      await fireEvent.press(screen.getByText("plus show-2"))

      expect(await screen.findByText("active show-2")).toBeTruthy()
      expect(screen.queryByText("sheet-open")).toBeNull()
      // No second lookup: the first card's add is still working out the itinerary.
      expect(
        getMockRelayEnvironment()
          .mock.getAllOperations()
          .filter((op) => op.request.node.params.name === "AddToItineraryProviderLookupQuery")
      ).toHaveLength(0)
    })
  })

  it("opens the sheet when the stop is already on an itinerary", async () => {
    await renderIt(true)

    await fireEvent.press(screen.getByText("plus show-1"))

    expect(await screen.findByText("sheet-open")).toBeTruthy()
  })
})
