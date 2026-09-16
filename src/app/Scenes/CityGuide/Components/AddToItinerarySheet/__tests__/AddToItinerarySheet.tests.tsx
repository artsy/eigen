import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { AddToItinerarySheet } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItinerarySheet"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { MockPayloadGenerator } from "relay-test-utils"

// The bottom-sheet mock does not mount its footer host. Render portal children
// inline here so these tests can exercise the Done button's mutation behavior.
jest.mock("@gorhom/portal", () => ({
  ...jest.requireActual("@gorhom/portal"),
  Portal: ({ children }: { children: React.ReactNode }) => children,
}))

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

    // A custom stop has no entity to point at, so it carries its own fields across instead of
    // an itemType/itemID pair — same sheet, same picker, as an Artsy stop gets.
    it("adds a custom stop's own fields, not itemType/itemID", async () => {
      const view = renderWithRelay(withItineraries([itinerary("a", "First", [])]), {
        ...props,
        target: {
          title: "Coffee at London Cafe",
          sourceStopID: "source-stop",
          sourceShareToken: "source-token",
          address: "12 Bermondsey Street",
          citySlug: "london-united-kingdom",
          cityName: "London",
        },
      })

      fireEvent.press(await screen.findByTestId("add-to-itinerary-row"))
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))

      const operation = view.env.mock.getMostRecentOperation()

      // "First" already has a My Stops section (every fixture itinerary gets one), so the
      // stop is created straight away.
      expect(operation.request.node.params.name).toBe("useApplyItinerarySelectionAddMutation")
      expect(operation.request.variables.input).toEqual({
        itinerarySectionID: "a-s",
        title: "Coffee at London Cafe",
        sourceStopID: "source-stop",
        sourceShareToken: "source-token",
        address: "12 Bermondsey Street",
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

    // For someone who opened the form and then remembered they have one already.
    it("goes back to the list without creating anything", async () => {
      const view = renderWithRelay(withItineraries([itinerary("a", "First", [])]), props)

      fireEvent.press(await screen.findByTestId("add-to-itinerary-create"))
      expect(screen.getByTestId("create-itinerary-name")).toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("create-itinerary-back"))

      expect(await screen.findByText("First")).toBeOnTheScreen()
      expect(screen.queryByTestId("create-itinerary-name")).not.toBeOnTheScreen()
      expect(view.env.mock.getAllOperations()).toHaveLength(0)
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

    // A regression: `create` used to only tick the new itinerary locally, without adding it
    // to the list the sheet renders from or the one Done reads to find what to mutate — so it
    // never showed up, and Done silently did nothing for it.
    it("shows the created itinerary in the list, and adds to it on Done", async () => {
      const view = renderWithRelay(withItineraries([itinerary("a", "First", [])]), props)

      await screen.findByText("First")

      fireEvent.press(await screen.findByTestId("add-to-itinerary-create"))
      fireEvent.changeText(screen.getByTestId("create-itinerary-name"), "Frieze week")
      fireEvent.press(screen.getByTestId("create-itinerary-submit"))

      await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))

      view.env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Mutation: () => ({
            createItinerary: {
              responseOrError: {
                __typename: "ItineraryMutationSuccess",
                itinerary: { internalID: "new-itinerary" },
              },
            },
          }),
        })
      )

      expect(await screen.findByText("Frieze week")).toBeOnTheScreen()
      expect(screen.getByText("1 selected")).toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      // The itinerary just made has no "My Stops" section yet, so applying its tick creates
      // one first, same as any other itinerary that arrived without one.
      await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))

      const sectionOp = view.env.mock.getMostRecentOperation()

      expect(sectionOp.request.node.params.name).toBe(
        "useApplyItinerarySelectionCreateSectionMutation"
      )
      expect(sectionOp.request.variables.input).toEqual({
        itineraryID: "new-itinerary",
        title: "My Stops",
      })
    })
  })
})
