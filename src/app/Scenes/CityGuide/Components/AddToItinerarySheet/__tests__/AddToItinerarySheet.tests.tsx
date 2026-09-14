import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { AddToItinerarySheet } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItinerarySheet"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const itinerary = (internalID: string, title: string, stops: object[]) => ({
  internalID,
  title,
  stopsCount: stops.length,
  heroImage: null,
  sections: [{ internalID: `${internalID}-s`, title: "My Stops", stopsCount: stops.length, stops }],
})

const showStop = (stopId: string, showId: string) => ({
  internalID: stopId,
  item: { __typename: "Show", internalID: showId },
})

describe("AddToItinerarySheet", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: AddToItinerarySheet })

  const props = {
    target: {
      itemType: "SHOW" as const,
      itemID: "show-1",
      citySlug: "london-united-kingdom",
      cityName: "London",
    },
    onClose: jest.fn(),
  }

  const withItineraries = (nodes: object[]) => ({
    Me: () => ({ itinerariesConnection: { edges: nodes.map((node) => ({ node })) } }),
  })

  it("lists the itineraries, ticking the ones already holding the entity", async () => {
    renderWithRelay(
      withItineraries([
        itinerary("a", "London October 2026", [showStop("stop-1", "show-1")]),
        itinerary("b", "Second trip", []),
      ]),
      props
    )

    expect(await screen.findByText("London October 2026")).toBeOnTheScreen()
    expect(screen.getByText("Second trip")).toBeOnTheScreen()
    expect(screen.getAllByTestId("add-to-itinerary-row-selected")).toHaveLength(1)
    expect(screen.getAllByTestId("add-to-itinerary-row-unselected")).toHaveLength(1)
    expect(screen.getByText("1 selected")).toBeOnTheScreen()
  })

  // Selection is local until Done, as the artwork-lists sheet does it.
  it("toggles a row without firing a mutation", async () => {
    const view = renderWithRelay(withItineraries([itinerary("b", "Second trip", [])]), props)

    fireEvent.press(await screen.findByTestId("add-to-itinerary-row"))

    expect(screen.getByTestId("add-to-itinerary-row-selected")).toBeOnTheScreen()
    expect(screen.getByText("1 selected")).toBeOnTheScreen()
    expect(view.env.mock.getAllOperations()).toHaveLength(0)
  })

  it("counts the ticks as they change", async () => {
    renderWithRelay(
      withItineraries([
        itinerary("a", "First", [showStop("stop-1", "show-1")]),
        itinerary("b", "Second", []),
      ]),
      props
    )

    await screen.findByText("First")
    expect(screen.getByText("1 selected")).toBeOnTheScreen()

    fireEvent.press(screen.getAllByTestId("add-to-itinerary-row")[0])

    expect(screen.getByText("0 selected")).toBeOnTheScreen()
  })

  describe("Done", () => {
    it("adds a stop to a newly ticked itinerary and nothing to an untouched one", async () => {
      const view = renderWithRelay(
        withItineraries([
          itinerary("a", "First", [showStop("stop-1", "show-1")]),
          itinerary("b", "Second", []),
        ]),
        props
      )

      await screen.findByText("Second")

      fireEvent.press(screen.getAllByTestId("add-to-itinerary-row")[1])
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))

      const operation = view.env.mock.getMostRecentOperation()

      // "Second" already has a My Stops section, so the stop is created straight away.
      expect(operation.request.node.params.name).toBe("useApplyItinerarySelectionAddMutation")
      expect(operation.request.variables.input).toEqual({
        itinerarySectionID: "b-s",
        itemType: "SHOW",
        itemID: "show-1",
      })
    })

    it("removes the stop from an itinerary whose tick was cleared", async () => {
      const view = renderWithRelay(
        withItineraries([itinerary("a", "First", [showStop("stop-1", "show-1")])]),
        props
      )

      await screen.findByText("First")

      fireEvent.press(screen.getByTestId("add-to-itinerary-row"))
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))

      const operation = view.env.mock.getMostRecentOperation()

      expect(operation.request.node.params.name).toBe("useApplyItinerarySelectionRemoveMutation")
      expect(operation.request.variables.input).toEqual({ id: "stop-1" })
    })

    it("fires nothing when no tick changed", async () => {
      const view = renderWithRelay(
        withItineraries([itinerary("a", "First", [showStop("stop-1", "show-1")])]),
        props
      )

      await screen.findByText("First")

      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await waitFor(() => expect(props.onClose).toHaveBeenCalled())
      expect(view.env.mock.getAllOperations()).toHaveLength(0)
    })
  })

  // `createItineraryInput.citySlug` is required, so an itinerary cannot be made without a city.
  describe("with no city", () => {
    const noCity = { ...props, target: { itemType: "SHOW" as const, itemID: "show-1" } }

    it("offers no way to create one", async () => {
      renderWithRelay(withItineraries([itinerary("a", "First", [])]), noCity)

      await screen.findByText("First")

      expect(screen.queryByTestId("add-to-itinerary-create")).not.toBeOnTheScreen()
    })

    it("says so when there is nothing to add to", async () => {
      renderWithRelay(withItineraries([]), noCity)

      expect(
        await screen.findByText("You have no itineraries yet. Start one from a city guide.")
      ).toBeOnTheScreen()
    })
  })

  describe("creating one", () => {
    it("names it after the city, month and year, and counts the characters", async () => {
      renderWithRelay(withItineraries([]), props)

      fireEvent.press(await screen.findByTestId("add-to-itinerary-create"))

      const input = screen.getByTestId("create-itinerary-name")

      expect(input.props.value).toMatch(/^London \w+ \d{4}$/)
      expect(screen.getByText(`${input.props.value.length} / 40`)).toBeOnTheScreen()
    })

    it("cannot be submitted empty", async () => {
      renderWithRelay(withItineraries([]), props)

      fireEvent.press(await screen.findByTestId("add-to-itinerary-create"))
      fireEvent.changeText(screen.getByTestId("create-itinerary-name"), "   ")

      expect(screen.getByTestId("create-itinerary-submit")).toBeDisabled()
    })

    it("creates it with the city and the name", async () => {
      const view = renderWithRelay(withItineraries([]), props)

      fireEvent.press(await screen.findByTestId("add-to-itinerary-create"))
      fireEvent.changeText(screen.getByTestId("create-itinerary-name"), "Frieze week")
      fireEvent.press(screen.getByTestId("create-itinerary-submit"))

      await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))

      const operation = view.env.mock.getMostRecentOperation()

      expect(operation.request.node.params.name).toBe("AddToItinerarySheetCreateMutation")
      expect(operation.request.variables.input).toEqual({
        citySlug: "london-united-kingdom",
        title: "Frieze week",
      })
    })
  })
})
