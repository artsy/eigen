import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryItemSaveControl } from "app/Components/ItineraryItemSaveControl"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

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
        { itemType, itemID: "entity-id", name: "My event" }
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
    }
  )
})
