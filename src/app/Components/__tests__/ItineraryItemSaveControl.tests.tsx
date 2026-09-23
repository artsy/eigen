import { ActionType, OwnerType } from "@artsy/cohesion"
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryItemSaveControl } from "app/Components/ItineraryItemSaveControl"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { MockPayloadGenerator } from "relay-test-utils"

jest.mock("app/utils/hooks/useFeatureFlag", () => ({ useFeatureFlag: () => true }))

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

  it.each(["SHOW", "FAIR"] as const)(
    "offers Create New Itinerary when the %s resolves to a City Guide city",
    async (itemType) => {
      const view = renderWithRelay(
        {
          Query: () => ({
            [itemType === "SHOW" ? "show" : "fair"]: {
              isOnMyItineraries: false,
              cityGuideCity: { slug: "london-united-kingdom", name: "London" },
            },
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

      fireEvent.press(await screen.findByLabelText("Add My event to an itinerary"))
      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "AddToItinerarySheetQuery"
        )
      )

      await act(async () => {
        view.env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Me: () => ({ itinerariesConnection: { edges: [] } }),
          })
        )
      })

      expect(await screen.findByTestId("add-to-itinerary-create")).toBeOnTheScreen()
    }
  )

  it.each(["SHOW", "FAIR"] as const)(
    "keeps the empty state when the %s resolves to no City Guide city",
    async (itemType) => {
      const view = renderWithRelay(
        {
          Query: () => ({
            [itemType === "SHOW" ? "show" : "fair"]: {
              isOnMyItineraries: false,
              cityGuideCity: null,
            },
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

      fireEvent.press(await screen.findByLabelText("Add My event to an itinerary"))
      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "AddToItinerarySheetQuery"
        )
      )

      await act(async () => {
        view.env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Me: () => ({ itinerariesConnection: { edges: [] } }),
          })
        )
      })

      expect(
        await screen.findByText("You have no itineraries yet. Start one from a city guide.")
      ).toBeOnTheScreen()
      expect(screen.queryByTestId("add-to-itinerary-create")).not.toBeOnTheScreen()
    }
  )
})
