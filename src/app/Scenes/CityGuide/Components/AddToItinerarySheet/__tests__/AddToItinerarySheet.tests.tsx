import { ActionType, OwnerType } from "@artsy/cohesion"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { AddToItinerarySheet } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItinerarySheet"
import { navigate } from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { KeyboardController } from "react-native-keyboard-controller"
import { MockPayloadGenerator } from "relay-test-utils"

let mockContentGeneration = 0
const mockShowToast = jest.fn()
jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => ({ show: mockShowToast }),
}))

// Simulate a modal content remount while the context provider keeps its session state.
jest.mock("@gorhom/bottom-sheet", () => {
  const { View } = require("react-native")
  const mock = require("@gorhom/bottom-sheet/mock")
  class BottomSheetModal extends mock.BottomSheetModal {
    render() {
      return <View key={mockContentGeneration}>{super.render()}</View>
    }
  }
  return {
    ...mock,
    SCROLLABLE_TYPE: {},
    createBottomSheetScrollableComponent: jest.fn().mockReturnValue(View),
    BottomSheetModal,
    useBottomSheetInternal: () => ({
      animatedLayoutState: { get: () => ({ containerHeight: 800, handleHeight: 24 }) },
      animatedPosition: { get: () => 400 },
    }),
  }
})

/** What the listing knows about an itinerary: no sections, those come from a second read. */
const itinerary = (internalID: string, title: string) => ({
  internalID,
  title,
  citySlug: "london-united-kingdom",
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
    mockContentGeneration = 0
  })

  const withItineraries = (nodes: object[]) => ({
    Query: () => ({ sourceShow: null, sourceFair: null }),
    Me: () => ({
      name: "Alex Collector",
      itinerariesConnection: { edges: nodes.map((node) => ({ node })) },
    }),
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

  // The sheet is already open while this loads, so its chrome stays and only the list waits.
  it("keeps the title and create row up over a skeleton while the itineraries load", () => {
    renderWithWrappers(<AddToItinerarySheet {...props} />)

    expect(screen.getByText("Add to Itinerary")).toBeOnTheScreen()
    expect(screen.getByText("Create New Itinerary")).toBeOnTheScreen()
    expect(screen.getByTestId("add-to-itinerary-skeleton")).toBeOnTheScreen()
    expect(screen.getByTestId("add-to-itinerary-done")).toBeDisabled()
    expect(screen.queryByText(/selected$/)).toBeNull()
  })

  it("keeps the same Done button through loading and quick selection changes", async () => {
    renderWithWrappers(<AddToItinerarySheet {...props} />)
    const button = screen.getByTestId("add-to-itinerary-done")
    expect(button).toBeDisabled()

    act(() =>
      getMockRelayEnvironment().mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, withItineraries([itinerary("a", "My trip")]))
      )
    )

    const row = await screen.findByTestId("add-to-itinerary-row")
    expect(screen.getByTestId("add-to-itinerary-done")).toBe(button)
    fireEvent.press(row)
    expect(button).toBeEnabled()
    expect(screen.getByTestId("add-to-itinerary-done")).toBe(button)
    fireEvent.press(row)
    expect(button).toBeDisabled()
    expect(screen.getByTestId("add-to-itinerary-done")).toBe(button)
  })

  it("preserves a quick selection when the modal remounts its content", async () => {
    const view = renderWithWrappers(<AddToItinerarySheet {...props} />)
    const environment = getMockRelayEnvironment()
    const resolveItineraries = () => {
      environment.mock.getAllOperations().forEach((operation) => {
        environment.mock.resolve(
          operation,
          MockPayloadGenerator.generate(operation, withItineraries([itinerary("a", "My trip")]))
        )
      })
    }
    act(resolveItineraries)

    fireEvent.press(await screen.findByTestId("add-to-itinerary-row"))
    expect(screen.getByTestId("add-to-itinerary-done")).toBeEnabled()

    // Remount only the modal content, keeping the surrounding sheet provider mounted.
    act(() => {
      mockContentGeneration += 1
      view.UNSAFE_getByType(BottomSheetModal).instance.forceUpdate()
    })
    expect(screen.getByTestId("add-to-itinerary-done")).toBeEnabled()
    act(resolveItineraries)

    expect(await screen.findByText("1 selected")).toBeOnTheScreen()
    expect(screen.getByTestId("add-to-itinerary-row")).toBeChecked()
    expect(screen.getByTestId("add-to-itinerary-done")).toBeEnabled()

    fireEvent.press(screen.getByTestId("add-to-itinerary-row"))
    expect(screen.getByText("0 selected")).toBeOnTheScreen()
    expect(screen.getByTestId("add-to-itinerary-done")).toBeDisabled()
  })

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
    it("keeps Changes Saved green when adding to multiple itineraries", async () => {
      const view = renderWithRelay(
        withItineraries([itinerary("a", "First"), itinerary("b", "Second")]),
        props
      )
      await screen.findByText("Second")
      screen.getAllByTestId("add-to-itinerary-row").forEach((row) => fireEvent.press(row))
      fireEvent.press(screen.getByTestId("add-to-itinerary-done"))

      for (const id of ["a", "b"]) {
        await resolveNext(view, "fetchItinerarySectionsQuery", myStopsSection(id))
        await resolveNext(view, "useApplyItinerarySelectionAddMutation", {
          Mutation: () => ({
            createItineraryStop: {
              responseOrError: {
                __typename: "ItineraryStopMutationSuccess",
                itineraryStop: { internalID: `stop-${id}` },
              },
            },
          }),
        })
      }

      await waitFor(() =>
        expect(mockShowToast).toHaveBeenCalledWith("Changes Saved", "bottom", {
          backgroundColor: "green100",
        })
      )
    })

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

      await waitFor(() =>
        expect(mockShowToast).toHaveBeenCalledWith(
          "Added to your Itinerary",
          "bottom",
          expect.objectContaining({
            backgroundColor: "green100",
            cta: "View Itinerary",
            hideOnPress: true,
          })
        )
      )
      mockShowToast.mock.calls.at(-1)?.[2].onPress()
      expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/itinerary/b")
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

      await screen.findByText("0 selected")
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
      await waitFor(() =>
        expect(mockShowToast).toHaveBeenCalledWith(
          "Added to your Itinerary",
          "bottom",
          expect.objectContaining({ backgroundColor: "green100", cta: "View Itinerary" })
        )
      )
      mockShowToast.mock.calls.at(-1)?.[2].onPress()
      expect(navigate).toHaveBeenCalledWith(
        "/city-guide/london-united-kingdom/itinerary/auto-created"
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
      expect(mockShowToast).toHaveBeenCalledWith("Changes Saved", "bottom", {
        backgroundColor: "green100",
      })
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

  // A regression: Done used to skip the rail refetch whenever the sheet had no city of its own.
  it("refetches the itineraries rail against the sheet's city on Done", async () => {
    const view = renderWithRelay(withItineraries([itinerary("a", "First")]), props)

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
      expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
        "CityGuideItinerariesRailQuery"
      )
    )
    expect(view.env.mock.getMostRecentOperation().request.variables).toEqual({
      citySlug: "london-united-kingdom",
      first: 10,
    })
  })

  describe("creating one", () => {
    it("tracks tappedCreateItinerary against the sheet's own city", async () => {
      renderWithRelay(withItineraries([]), props)

      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-create"))

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: ActionType.tappedCreateItinerary,
        context_screen_owner_type: OwnerType.cityGuide,
        context_screen_owner_slug: "london-united-kingdom",
      })
    })

    it("tracks tappedCreateItinerary against the screen the sheet was opened on", async () => {
      renderWithRelay(withItineraries([]), {
        ...props,
        target: {
          ...props.target,
          contextScreenOwnerType: OwnerType.show,
          contextScreenOwnerId: "show-1",
          contextScreenOwnerSlug: "frida-kahlo",
        },
      })

      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-create"))

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: ActionType.tappedCreateItinerary,
        context_screen_owner_type: OwnerType.show,
        context_screen_owner_id: "show-1",
        context_screen_owner_slug: "frida-kahlo",
      })
    })

    // gorhom's default "switch": the list sheet steps aside while the form is up, so only one
    // sheet shows at a time, the same as the artwork lists' create flow.
    it("switches to the form rather than stacking it on the list", async () => {
      renderWithRelay(withItineraries([]), props)

      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-create"))

      const [createSheet] = screen.UNSAFE_getAllByProps({ name: "CreateItinerary" })
      expect(createSheet.props.stackBehavior).toBeUndefined()
    })

    it("names it after the city, month and year, and counts the characters", async () => {
      renderWithRelay(withItineraries([]), props)

      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-create"))

      const input = screen.getByTestId("create-itinerary-name")

      expect(input.props.value).toMatch(/^London \w+ \d{4}$/)
      expect(screen.getByText(`${input.props.value.length} / 40`)).toBeOnTheScreen()
    })

    it("cannot be submitted empty", async () => {
      renderWithRelay(withItineraries([]), props)

      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-create"))
      fireEvent.changeText(screen.getByTestId("create-itinerary-name"), "   ")

      expect(screen.getByTestId("create-itinerary-submit")).toBeDisabled()
    })

    // For someone who opened the form and then remembered they have one already.
    it("goes back to the list without creating anything", async () => {
      const view = renderWithRelay(withItineraries([itinerary("a", "First")]), props)

      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-create"))
      expect(screen.getByTestId("create-itinerary-name")).toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("create-itinerary-back"))

      expect(await screen.findByText("First")).toBeOnTheScreen()
      expect(screen.queryByTestId("create-itinerary-name")).not.toBeOnTheScreen()
      expect(view.env.mock.getAllOperations()).toHaveLength(0)
    })

    it("creates it with the city and the name", async () => {
      const view = renderWithRelay(withItineraries([]), props)

      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-create"))
      fireEvent.changeText(screen.getByTestId("create-itinerary-name"), "Frieze week")
      fireEvent.press(screen.getByTestId("create-itinerary-submit"))

      await waitFor(() => expect(view.env.mock.getAllOperations()).toHaveLength(1))

      const operation = view.env.mock.getMostRecentOperation()

      expect(operation.request.node.params.name).toBe("AddToItinerarySheetCreateMutation")
      expect(operation.request.variables.input).toEqual({
        citySlug: "london-united-kingdom",
        title: "Frieze week",
        authorName: "Alex Collector",
      })
    })

    // Closing the form with the keyboard still up animated both at once and stuttered.
    it("hides the keyboard before going back to the list", async () => {
      let hideKeyboard = () => {}
      jest
        .mocked(KeyboardController.dismiss)
        .mockReturnValueOnce(new Promise<void>((resolve) => (hideKeyboard = resolve)))

      const view = renderWithRelay(withItineraries([itinerary("a", "First")]), props)

      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-create"))
      fireEvent.changeText(screen.getByTestId("create-itinerary-name"), "Frieze week")
      fireEvent.press(screen.getByTestId("create-itinerary-submit"))

      expect(KeyboardController.dismiss).toHaveBeenCalledTimes(1)

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

      // Created and ticked, but still on the form until the keyboard is down.
      expect(await screen.findByText("1 selected")).toBeOnTheScreen()
      expect(screen.getByTestId("create-itinerary-name")).toBeOnTheScreen()

      hideKeyboard()

      await waitFor(() =>
        expect(screen.queryByTestId("create-itinerary-name")).not.toBeOnTheScreen()
      )
    })

    // A regression: `create` used to only tick the new itinerary locally, without adding it
    // to the list the sheet renders from or the one Done reads to find what to mutate — so it
    // never showed up, and Done silently did nothing for it.
    it("shows the created itinerary in the list, and adds to it on Done", async () => {
      const view = renderWithRelay(withItineraries([itinerary("a", "First")]), props)

      await screen.findByText("First")

      await screen.findByText("0 selected")
      fireEvent.press(screen.getByTestId("add-to-itinerary-create"))
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
