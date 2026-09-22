import { ActionType, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { AddToItinerarySheet } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItinerarySheet"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { MockPayloadGenerator } from "relay-test-utils"

// The bottom-sheet mock does not mount its footer host. Render portal children
// inline here so these tests can exercise the Done button's mutation behavior.
jest.mock("@gorhom/portal", () => ({
  ...jest.requireActual("@gorhom/portal"),
  Portal: ({ children }: { children: React.ReactNode }) => children,
}))

/** What the listing knows about an itinerary: no sections, those come from a second read. */
const itinerary = (internalID: string, title: string) => ({
  internalID,
  title,
  isCurated: false,
  stopsCount: 0,
  heroImage: null,
})

describe("AddToItinerarySheet", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: AddToItinerarySheet })

  type View = ReturnType<typeof renderWithRelay>

  const props = {
    target: {
      itemType: "SHOW" as const,
      itemID: "show-1",
      citySlug: "london-united-kingdom",
      cityName: "London",
    },
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const withItineraries = (nodes: object[]) => ({
    Query: () => ({ sourceShow: null, sourceFair: null }),
    Me: () => ({ itinerariesConnection: { edges: nodes.map((node) => ({ node })) } }),
  })

  /** The show the sheet was opened for already sits on these itineraries, as these stops. */
  const heldBy = (memberships: { itineraryID: string; stopIDs: string[] }[]) => ({
    Query: () => ({ sourceShow: { myItineraryStopMemberships: memberships }, sourceFair: null }),
  })

  /** An itinerary's sections as `Query.itinerary` returns them: one empty "My Stops". */
  const myStopsSection = (itineraryID: string) => ({
    Itinerary: () => ({
      sections: [{ internalID: `${itineraryID}-s`, title: "My Stops", stops: [] }],
    }),
  })

  /** Resolves the next pending operation, checking it is the one expected. */
  const resolveNext = async (view: View, name: string, resolvers: object) => {
    await waitFor(() =>
      expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(name)
    )

    view.env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, resolvers)
    )
  }

  it.each(["SHOW", "FAIR"] as const)(
    "deletes a %s by entity membership even when the listing has no stops",
    async (itemType) => {
      const view = renderWithRelay(
        {
          ...withItineraries([itinerary("a", "My trip")]),
          Query: () => ({
            [itemType === "SHOW" ? "sourceShow" : "sourceFair"]: {
              myItineraryStopMemberships: [{ itineraryID: "a", stopIDs: ["matching-stop"] }],
            },
          }),
        },
        { ...props, target: { ...props.target, itemType } }
      )

      expect(await screen.findByText("My trip")).toBeOnTheScreen()
      expect(screen.getByText("1 selected")).toBeOnTheScreen()
      fireEvent.press(screen.getByTestId("add-to-itinerary-row"))
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await waitFor(() => expect(view.env.mock.getAllOperations()).toHaveLength(1))
      const operation = view.env.mock.getMostRecentOperation()
      expect(operation.request.node.params.name).toBe("useApplyItinerarySelectionRemoveMutation")
      expect(operation.request.variables.input).toEqual({ id: "matching-stop" })
    }
  )

  it("lists the itineraries, ticking the ones already holding the entity", async () => {
    renderWithRelay(
      {
        ...withItineraries([itinerary("a", "London October 2026"), itinerary("b", "Second trip")]),
        ...heldBy([{ itineraryID: "a", stopIDs: ["stop-1"] }]),
      },
      props
    )

    expect(await screen.findByText("London October 2026")).toBeOnTheScreen()
    expect(screen.getByText("Second trip")).toBeOnTheScreen()
    expect(screen.getAllByTestId("add-to-itinerary-row-selected")).toHaveLength(1)
    expect(screen.getAllByTestId("add-to-itinerary-row-unselected")).toHaveLength(1)
    expect(screen.getByText("1 selected")).toBeOnTheScreen()
  })

  // A membership on an itinerary the listing doesn't show (another city's, say) is no row.
  it("ignores memberships on itineraries that are not listed", async () => {
    renderWithRelay(
      {
        ...withItineraries([itinerary("a", "London October 2026")]),
        ...heldBy([{ itineraryID: "elsewhere", stopIDs: ["stop-1"] }]),
      },
      props
    )

    expect(await screen.findByText("London October 2026")).toBeOnTheScreen()
    expect(screen.getByText("0 selected")).toBeOnTheScreen()
  })

  it("deletes every matching stop when a fresh membership is unselected", async () => {
    const view = renderWithRelay(
      {
        ...withItineraries([
          itinerary("a", "Removed from this trip"),
          itinerary("b", "Still on this trip"),
        ]),
        Query: () => ({
          sourceStop: {
            internalID: "source-stop",
            myItineraryStopMemberships: [
              {
                itineraryID: "b",
                stopIDs: ["copied-stop-1", "copied-stop-2"],
              },
            ],
          },
        }),
      },
      {
        ...props,
        target: {
          ...props.target,
          sourceStopID: "source-stop",
          myItineraries: [{ internalID: "a" }],
        },
      }
    )

    expect(await screen.findByText("Still on this trip")).toBeOnTheScreen()
    expect(screen.getByLabelText("Removed from this trip")).toHaveProp("accessibilityState", {
      checked: false,
    })
    expect(screen.getByLabelText("Still on this trip")).toHaveProp("accessibilityState", {
      checked: true,
    })
    expect(screen.getByText("1 selected")).toBeOnTheScreen()

    fireEvent.press(screen.getAllByTestId("add-to-itinerary-row")[1])
    expect(screen.getByText("0 selected")).toBeOnTheScreen()
    fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

    await waitFor(() => expect(view.env.mock.getAllOperations()).toHaveLength(1))
    const firstDelete = view.env.mock.getMostRecentOperation()
    expect(firstDelete.request.node.params.name).toBe("useApplyItinerarySelectionRemoveMutation")
    expect(firstDelete.request.variables.input).toEqual({ id: "copied-stop-1" })

    view.env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Mutation: () => ({
          deleteItineraryStop: {
            responseOrError: {
              __typename: "ItineraryStopMutationSuccess",
              itineraryStop: { internalID: "copied-stop-1" },
            },
          },
        }),
      })
    )

    await waitFor(() => expect(view.env.mock.getAllOperations()).toHaveLength(1))
    const secondDelete = view.env.mock.getMostRecentOperation()
    expect(secondDelete.request.node.params.name).toBe("useApplyItinerarySelectionRemoveMutation")
    expect(secondDelete.request.variables.input).toEqual({ id: "copied-stop-2" })
  })

  it("deletes only the exact source stop from its own itinerary", async () => {
    const view = renderWithRelay(
      {
        ...withItineraries([itinerary("b", "Current trip")]),
        Query: () => ({
          sourceStop: {
            internalID: "copied-stop-1",
            myItineraryStopMemberships: [
              {
                itineraryID: "b",
                stopIDs: ["copied-stop-1", "copied-stop-2"],
              },
            ],
          },
        }),
      },
      {
        ...props,
        target: { ...props.target, sourceStopID: "copied-stop-1" },
      }
    )

    expect(await screen.findByLabelText("Current trip")).toHaveProp("accessibilityState", {
      checked: true,
    })

    fireEvent.press(screen.getByTestId("add-to-itinerary-row"))
    fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

    await waitFor(() => expect(view.env.mock.getAllOperations()).toHaveLength(1))
    const operation = view.env.mock.getMostRecentOperation()
    expect(operation.request.node.params.name).toBe("useApplyItinerarySelectionRemoveMutation")
    expect(operation.request.variables.input).toEqual({ id: "copied-stop-1" })
  })

  // Selection is local until Done, as the artwork-lists sheet does it.
  it("toggles a row without firing a mutation", async () => {
    const view = renderWithRelay(withItineraries([itinerary("b", "Second trip")]), props)

    fireEvent.press(await screen.findByTestId("add-to-itinerary-row"))

    expect(screen.getByTestId("add-to-itinerary-row-selected")).toBeOnTheScreen()
    expect(screen.getByText("1 selected")).toBeOnTheScreen()
    expect(view.env.mock.getAllOperations()).toHaveLength(0)
  })

  it("counts the ticks as they change", async () => {
    renderWithRelay(
      {
        ...withItineraries([itinerary("a", "First"), itinerary("b", "Second")]),
        ...heldBy([{ itineraryID: "a", stopIDs: ["stop-1"] }]),
      },
      props
    )

    await screen.findByText("First")
    expect(screen.getByText("1 selected")).toBeOnTheScreen()

    fireEvent.press(screen.getAllByTestId("add-to-itinerary-row")[0])

    expect(screen.getByText("0 selected")).toBeOnTheScreen()
  })

  describe("Done", () => {
    // The listing serializes at :short, which has no sections, so the ticked itinerary's own
    // are read through Query.itinerary — the same record the itinerary screen renders from.
    it("adds a stop to a newly ticked itinerary and nothing to an untouched one", async () => {
      const view = renderWithRelay(
        {
          ...withItineraries([itinerary("a", "First"), itinerary("b", "Second")]),
          ...heldBy([{ itineraryID: "a", stopIDs: ["stop-1"] }]),
        },
        props
      )

      await screen.findByText("Second")

      fireEvent.press(screen.getAllByTestId("add-to-itinerary-row")[1])
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await waitFor(() => expect(view.env.mock.getAllOperations()).toHaveLength(1))
      const read = view.env.mock.getMostRecentOperation()
      expect(read.request.node.params.name).toBe("fetchItinerarySectionsQuery")
      expect(read.request.variables).toEqual({ id: "b" })

      await resolveNext(view, "fetchItinerarySectionsQuery", myStopsSection("b"))

      // "Second" already has a My Stops section, so the stop is created straight away.
      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useApplyItinerarySelectionAddMutation"
        )
      )
      expect(view.env.mock.getMostRecentOperation().request.variables.input).toEqual({
        itinerarySectionID: "b-s",
        itemType: "SHOW",
        itemID: "show-1",
      })
    })

    // A custom stop has no entity to point at, so it carries its own fields across instead of
    // an itemType/itemID pair — same sheet, same picker, as an Artsy stop gets.
    it("adds a custom stop's own fields, not itemType/itemID", async () => {
      const view = renderWithRelay(withItineraries([itinerary("a", "First")]), {
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

      await resolveNext(view, "fetchItinerarySectionsQuery", myStopsSection("a"))

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useApplyItinerarySelectionAddMutation"
        )
      )
      expect(view.env.mock.getMostRecentOperation().request.variables.input).toEqual({
        itinerarySectionID: "a-s",
        title: "Coffee at London Cafe",
        sourceStopID: "source-stop",
        sourceShareToken: "source-token",
        address: "12 Bermondsey Street",
      })
    })

    it("removes the stop from an itinerary whose tick was cleared", async () => {
      const view = renderWithRelay(
        {
          ...withItineraries([itinerary("a", "First")]),
          ...heldBy([{ itineraryID: "a", stopIDs: ["stop-1"] }]),
        },
        props
      )

      await screen.findByText("First")

      fireEvent.press(screen.getByTestId("add-to-itinerary-row"))
      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await waitFor(() => expect(view.env.mock.getAllOperations()).toHaveLength(1))

      const operation = view.env.mock.getMostRecentOperation()

      expect(operation.request.node.params.name).toBe("useApplyItinerarySelectionRemoveMutation")
      expect(operation.request.variables.input).toEqual({ id: "stop-1" })
    })

    // deleteItineraryStop takes a stop id. With none in the membership, the stop is found by
    // what it points at, in the itinerary's own sections.
    it("looks the stop up when the membership names no stop", async () => {
      const view = renderWithRelay(
        {
          ...withItineraries([itinerary("a", "First")]),
          ...heldBy([{ itineraryID: "a", stopIDs: [] }]),
        },
        props
      )

      await screen.findByText("First")

      fireEvent.press(screen.getByTestId("add-to-itinerary-row"))
      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await resolveNext(view, "fetchItinerarySectionsQuery", {
        Itinerary: () => ({
          sections: [
            {
              internalID: "a-s",
              title: "My Stops",
              stops: [{ internalID: "stop-9", item: { __typename: "Show", internalID: "show-1" } }],
            },
          ],
        }),
      })

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useApplyItinerarySelectionRemoveMutation"
        )
      )
      expect(view.env.mock.getMostRecentOperation().request.variables.input).toEqual({
        id: "stop-9",
      })
    })

    it("tracks addedStopToItinerary against the newly ticked itinerary", async () => {
      const view = renderWithRelay(
        {
          ...withItineraries([itinerary("a", "First"), itinerary("b", "Second")]),
          ...heldBy([{ itineraryID: "a", stopIDs: ["stop-1"] }]),
        },
        { ...props, target: { ...props.target, itemSlug: "frida-kahlo" } }
      )

      await screen.findByText("Second")

      fireEvent.press(screen.getAllByTestId("add-to-itinerary-row")[1])
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await resolveNext(view, "fetchItinerarySectionsQuery", myStopsSection("b"))
      await resolveNext(view, "useApplyItinerarySelectionAddMutation", {
        Mutation: () => ({
          createItineraryStop: {
            responseOrError: {
              __typename: "ItineraryStopMutationSuccess",
              itineraryStop: { internalID: "new-stop" },
            },
          },
        }),
      })

      await waitFor(() =>
        expect(mockTrackEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: ActionType.addedStopToItinerary,
            context_owner_type: OwnerType.show,
            context_owner_id: "show-1",
            context_owner_slug: "frida-kahlo",
            owner_ids: ["b"],
          })
        )
      )
    })

    // Ticking several rows still lands on all of them in a single Done tap — one event with
    // every landed-on id, not one event per itinerary.
    it("tracks a custom stop's own owner type with no destination entity", async () => {
      const view = renderWithRelay(withItineraries([itinerary("a", "First")]), {
        ...props,
        target: {
          title: "Coffee at London Cafe",
          citySlug: "london-united-kingdom",
          cityName: "London",
        },
      })

      fireEvent.press(await screen.findByTestId("add-to-itinerary-row"))
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await resolveNext(view, "fetchItinerarySectionsQuery", myStopsSection("a"))
      await resolveNext(view, "useApplyItinerarySelectionAddMutation", {
        Mutation: () => ({
          createItineraryStop: {
            responseOrError: {
              __typename: "ItineraryStopMutationSuccess",
              itineraryStop: { internalID: "new-stop" },
            },
          },
        }),
      })

      await waitFor(() =>
        expect(mockTrackEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: ActionType.addedStopToItinerary,
            context_owner_type: OwnerType.cityGuideCustomStop,
            owner_ids: ["a"],
          })
        )
      )
    })

    it("does not track addedStopToItinerary on a pure removal", async () => {
      const view = renderWithRelay(
        {
          ...withItineraries([itinerary("a", "First")]),
          ...heldBy([{ itineraryID: "a", stopIDs: ["stop-1"] }]),
        },
        props
      )

      await screen.findByText("First")

      fireEvent.press(screen.getByTestId("add-to-itinerary-row"))
      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await waitFor(() => expect(view.env.mock.getAllOperations()).toHaveLength(1))

      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({ action: ActionType.addedStopToItinerary })
      )
    })

    it("tracks addedStopToItinerary when Done auto-creates the only itinerary", async () => {
      const view = renderWithRelay(withItineraries([]), {
        ...props,
        target: { ...props.target, itemSlug: "frida-kahlo" },
      })

      await screen.findByTestId("add-to-itinerary-done")
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useCityItineraryStopsLookupQuery"
        )
      )
      view.env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, { Me: () => ({ itinerariesConnection: null }) })
      )

      await resolveNext(view, "useCityItineraryStopsCreateItineraryMutation", {
        Mutation: () => ({
          createItinerary: {
            responseOrError: {
              __typename: "ItineraryMutationSuccess",
              itinerary: { internalID: "auto-created" },
            },
          },
        }),
      })
      await resolveNext(view, "useCityItineraryStopsCreateSectionMutation", {
        Mutation: () => ({
          createItinerarySection: {
            responseOrError: {
              __typename: "ItinerarySectionMutationSuccess",
              itinerarySection: { internalID: "auto-created-s" },
            },
          },
        }),
      })
      await resolveNext(view, "useCityItineraryStopsAddMutation", {
        Mutation: () => ({
          createItineraryStop: {
            responseOrError: {
              __typename: "ItineraryStopMutationSuccess",
              itineraryStop: { internalID: "new-stop" },
            },
          },
        }),
      })

      await waitFor(() =>
        expect(mockTrackEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: ActionType.addedStopToItinerary,
            context_owner_type: OwnerType.show,
            context_owner_id: "show-1",
            context_owner_slug: "frida-kahlo",
            owner_ids: ["auto-created"],
          })
        )
      )
    })

    it("fires nothing when no tick changed", async () => {
      const view = renderWithRelay(
        {
          ...withItineraries([itinerary("a", "First")]),
          ...heldBy([{ itineraryID: "a", stopIDs: ["stop-1"] }]),
        },
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
      renderWithRelay(withItineraries([itinerary("a", "First")]), noCity)

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
    it("tracks tappedCreateItinerary against the sheet's own city", async () => {
      renderWithRelay(withItineraries([]), props)

      fireEvent.press(await screen.findByTestId("add-to-itinerary-create"))

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: ActionType.tappedCreateItinerary,
        context_screen_owner_type: OwnerType.cityGuide,
        context_screen_owner_slug: "london-united-kingdom",
      })
    })

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
      const view = renderWithRelay(withItineraries([itinerary("a", "First")]), props)

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

      await waitFor(() => expect(view.env.mock.getAllOperations()).toHaveLength(1))

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
      const view = renderWithRelay(withItineraries([itinerary("a", "First")]), props)

      await screen.findByText("First")

      fireEvent.press(await screen.findByTestId("add-to-itinerary-create"))
      fireEvent.changeText(screen.getByTestId("create-itinerary-name"), "Frieze week")
      fireEvent.press(screen.getByTestId("create-itinerary-submit"))

      await resolveNext(view, "AddToItinerarySheetCreateMutation", {
        Mutation: () => ({
          createItinerary: {
            responseOrError: {
              __typename: "ItineraryMutationSuccess",
              itinerary: { internalID: "new-itinerary" },
            },
          },
        }),
      })

      expect(await screen.findByText("Frieze week")).toBeOnTheScreen()
      expect(screen.getByText("1 selected")).toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      // The itinerary just made has no "My Stops" section yet, so applying its tick creates
      // one first, same as any other itinerary that arrived without one.
      await resolveNext(view, "fetchItinerarySectionsQuery", {
        Itinerary: () => ({ sections: [] }),
      })

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useApplyItinerarySelectionCreateSectionMutation"
        )
      )
      expect(view.env.mock.getMostRecentOperation().request.variables.input).toEqual({
        itineraryID: "new-itinerary",
        title: "My Stops",
      })
    })
  })
})
