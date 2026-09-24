import { ActionType, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryItemSaveControl } from "app/Components/ItineraryItemSaveControl"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { MockPayloadGenerator } from "relay-test-utils"

jest.mock("app/utils/hooks/useFeatureFlag", () => ({ useFeatureFlag: () => true }))

// The bottom-sheet mock does not mount the sheet's footer host, so render the Done button inline.
jest.mock("@gorhom/portal", () => ({
  ...jest.requireActual("@gorhom/portal"),
  Portal: ({ children }: { children: React.ReactNode }) => children,
}))

describe("ItineraryItemSaveControl", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: ItineraryItemSaveControl })

  it.each(["SHOW", "FAIR"] as const)(
    "shows the saved state of a %s and opens the itinerary sheet",
    async (itemType) => {
      const view = renderWithRelay(
        {
          Query: () => ({
            [itemType === "SHOW" ? "show" : "fair"]: { isOnMyItineraries: true },
          }),
        },
        {
          itemType,
          itemID: "entity-id",
          name: "My event",
          contextScreenOwnerType: itemType === "SHOW" ? OwnerType.show : OwnerType.fair,
          contextScreenOwnerId: "entity-id",
        }
      )

      expect(await screen.findByLabelText("My event is on an itinerary")).toBeOnTheScreen()
      fireEvent.press(screen.getByLabelText("My event is on an itinerary"))
      await waitFor(() => expect(view.env.mock.getAllOperations()).toHaveLength(1))
      const operation = view.env.mock.getMostRecentOperation()
      expect(operation.request.node.params.name).toBe("AddToItinerarySheetQuery")
      expect(operation.request.variables).toMatchObject({
        itemID: "entity-id",
        hasShow: itemType === "SHOW",
        hasFair: itemType === "FAIR",
      })
      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ActionType.tappedAddToItinerary,
          context_screen_owner_type: itemType === "SHOW" ? OwnerType.show : OwnerType.fair,
          context_screen_owner_id: "entity-id",
          destination_screen_owner_type: itemType === "SHOW" ? OwnerType.show : OwnerType.fair,
          destination_screen_owner_id: "entity-id",
        })
      )
    }
  )

  describe("on a show in a City Guide city", () => {
    const showProps = {
      itemType: "SHOW" as const,
      itemID: "show-1",
      name: "My show",
      contextScreenOwnerType: OwnerType.show,
      contextScreenOwnerId: "show-1",
      contextScreenOwnerSlug: "my-show",
    }

    const openSheet = async (itineraries: object[]) => {
      const view = renderWithRelay(
        {
          Show: () => ({
            isOnMyItineraries: false,
            cityGuideCity: { slug: "paris-france", name: "Paris" },
          }),
        },
        showProps
      )

      fireEvent.press(await screen.findByLabelText("Add My show to an itinerary"))
      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "AddToItinerarySheetQuery"
        )
      )
      const operation = view.env.mock.getMostRecentOperation()
      view.env.mock.resolveMostRecentOperation(() =>
        MockPayloadGenerator.generate(operation, {
          Query: () => ({ sourceShow: { myItineraryStopMemberships: [] }, sourceFair: null }),
          Me: () => ({
            itinerariesConnection: { edges: itineraries.map((node) => ({ node })) },
          }),
        })
      )

      return { view, operation }
    }

    // Fetching every city's itineraries and filtering here would miss the ones past the first
    // page, and Done would then create a duplicate.
    it("asks the server for that city's itineraries only", async () => {
      const { operation } = await openSheet([])

      expect(operation.request.variables).toMatchObject({ citySlug: "paris-france" })
    })

    it("adds to the city's existing itinerary on Done, rather than creating another", async () => {
      const { view } = await openSheet([
        { internalID: "paris", title: "Paris trip", isCurated: false, stopsCount: 0 },
      ])

      fireEvent.press(await screen.findByText("Paris trip"))
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "fetchItinerarySectionsQuery"
        )
      )
      expect(view.env.mock.getMostRecentOperation().request.variables).toEqual({ id: "paris" })
    })

    it("offers Create New Itinerary for that city, tracked against the show page", async () => {
      await openSheet([])

      fireEvent.press(await screen.findByTestId("add-to-itinerary-create"))

      expect(screen.getByTestId("create-itinerary-name").props.value).toMatch(/^Paris \w+ \d{4}$/)
      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: ActionType.tappedCreateItinerary,
        context_screen_owner_type: OwnerType.show,
        context_screen_owner_id: "show-1",
        context_screen_owner_slug: "my-show",
      })
    })
  })

  it("lists every itinerary and offers no create when the show has no City Guide city", async () => {
    const view = renderWithRelay(
      { Show: () => ({ isOnMyItineraries: false, cityGuideCity: null }) },
      {
        itemType: "SHOW",
        itemID: "show-1",
        name: "My show",
        contextScreenOwnerType: OwnerType.show,
      }
    )

    fireEvent.press(await screen.findByLabelText("Add My show to an itinerary"))
    await waitFor(() =>
      expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
        "AddToItinerarySheetQuery"
      )
    )
    expect(view.env.mock.getMostRecentOperation().request.variables).toMatchObject({
      citySlug: null,
    })
    view.env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Me: () => ({
          itinerariesConnection: {
            edges: [{ node: { internalID: "a", title: "First", isCurated: false } }],
          },
        }),
      })
    )

    expect(await screen.findByText("First")).toBeOnTheScreen()
    expect(screen.queryByTestId("add-to-itinerary-create")).not.toBeOnTheScreen()
  })
})
