import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryScreen } from "app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen"
import { goBack } from "app/system/navigation/navigate"
import {
  dropSortableItem,
  resetSortableListSpy,
  sortableItemDraggableFlags,
} from "app/utils/tests/draxSortableListSpy"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { RefreshControl, ScrollView } from "react-native"
import RNShare from "react-native-share"
import { ReactTestInstance } from "react-test-renderer"
import { MockPayloadGenerator } from "relay-test-utils"

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile
// Image component. See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

jest.mock("react-native-share", () => ({ open: jest.fn() }))

// Drax needs more of reanimated than the stock jest mock offers, and its drag can only be
// fired by invoking `onReorder` directly — both scoped to this file rather than setupJest.
jest.mock("react-native-reanimated", () =>
  require("app/utils/tests/draxReanimatedMock").draxReanimatedMock()
)
jest.mock("react-native-drax", () => require("app/utils/tests/draxSortableListSpy").mockDrax())

const mockShowToast = jest.fn()

jest.mock("app/Components/Toast/toastHook", () => ({
  ...jest.requireActual("app/Components/Toast/toastHook"),
  useToast: () => ({ show: mockShowToast, hide: jest.fn(), hideOldest: jest.fn() }),
}))

const stop = (n: number) => ({
  internalID: `stop-${n}`,
  title: `Stop ${n}`,
  address: null,
  category: "GALLERY",
  note: null,
  imageURL: null,
  latitude: 51.5,
  longitude: -0.1,
  startTime: "11:00am",
  endTime: "4:00pm",
  startAtISO: null,
  endAtISO: null,
  // Left null so no save control query fires: `item` resolving to null is the
  // "not a saveable Artsy entity" case, which is also what the fixture returns today.
  item: null,
  // A plain stop, naming no event of its own — otherwise the mock generator invents one and
  // every card here reads as that event (see `stopCardFields`).
  eventType: null,
  event: null,
})

const ITINERARY = {
  internalID: "chill-vibes-only",
  isCurated: true,
  isMine: false,
  citySlug: "london-united-kingdom",
  slug: "chill-vibes-only",
  shareToken: null,
  title: "Chill Vibes Only",
  subtitle: "Top picks",
  description: "Our list of recommendations.",
  authorName: "Casey Lesser",
  heroImage: {
    url: "https://example.com/hero.jpg",
  },
  sections: [
    { internalID: "day-1", title: "Day 1 — Easing in", stops: [stop(1), stop(2)] },
    { internalID: "day-2", title: "Day 2 — London Frieze", stops: [stop(3), stop(4)] },
  ],
}

describe("ItineraryScreen", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: ItineraryScreen })
  const props = { citySlug: "london-united-kingdom", itineraryId: "chill-vibes-only" }

  beforeEach(() => {
    jest.clearAllMocks()
    resetSortableListSpy()
  })

  it("renders the header and every section", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    expect(await screen.findByText("Chill Vibes Only")).toBeTruthy()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Day 2 — London Frieze")).toBeTruthy()
  })

  it("tracks the screen view against the guide's own id and slug", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    await screen.findByText("Chill Vibes Only")

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: ActionType.screen,
      context_screen_owner_type: OwnerType.cityGuideGuide,
      context_screen_owner_id: "chill-vibes-only",
      context_screen_owner_slug: "chill-vibes-only",
    })
  })

  it("tracks the map/list toggle under the cityGuideMapToggle module", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    fireEvent.press(await screen.findByTestId("itinerary-view-toggle"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: ActionType.tappedNavigationTab,
        context_module: ContextModule.cityGuideMapToggle,
        context_screen_owner_type: OwnerType.cityGuideGuide,
        context_screen_owner_id: "chill-vibes-only",
        context_screen_owner_slug: "chill-vibes-only",
        subject: "map",
      })
    )
  })

  it("falls back to a positional section title when the server sends none", async () => {
    renderWithRelay(
      {
        Itinerary: () => ({
          ...ITINERARY,
          sections: [{ internalID: "untitled", title: null, stops: [stop(1)] }],
        }),
      },
      props
    )

    expect(await screen.findByText("Day 1")).toBeTruthy()
  })

  it("joins the two server-formatted times into the row's display time", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    expect(await screen.findAllByText("11am-4pm")).not.toHaveLength(0)
  })

  it("renders the unavailable state when the itinerary does not resolve", async () => {
    // Resolved at the root: an `Itinerary: () => null` resolver does not null the field,
    // MockPayloadGenerator still generates a default object for it.
    renderWithRelay({ Query: () => ({ itinerary: null }) }, props)

    expect(await screen.findByText("This guide is no longer available.")).toBeTruthy()
    expect(screen.queryByText("Chill Vibes Only")).toBeNull()
  })

  // The hero asks for a named version rather than a Gemini resize: Gravity sends the
  // versioned URLs it generated but not the original's dimensions, and `resized` scales
  // from those.
  it("uses the hero image url", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    expect(await screen.findByTestId("itinerary-hero-image")).toHaveProp(
      "src",
      "https://example.com/hero.jpg"
    )
  })

  it("hides the hero image section when the itinerary has no image", async () => {
    renderWithRelay({ Itinerary: () => ({ ...ITINERARY, heroImage: null }) }, props)

    expect(await screen.findByText("Chill Vibes Only")).toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-hero-image")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-hero-scrim")).not.toBeOnTheScreen()
  })

  describe("your own itinerary", () => {
    const own = { ...ITINERARY, isCurated: false, isMine: true }

    it("labels it Your Itinerary and drops the byline", async () => {
      renderWithRelay({ Itinerary: () => own }, props)

      expect(await screen.findByText("Your Itinerary")).toBeOnTheScreen()
      expect(screen.queryByText(/^By /)).not.toBeOnTheScreen()
    })

    it("offers the itinerary picker on the map", async () => {
      const view = renderWithRelay({ Itinerary: () => own }, props)

      fireEvent.press(await screen.findByTestId("itinerary-view-toggle"))

      // The picker runs its own query, and renderWithRelay resolves only the screen's.
      await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))
      view.mockResolveLastOperation({
        Me: () => ({
          itinerariesConnection: {
            edges: [{ node: { internalID: "chill-vibes-only", slug: null, title: "Mine" } }],
          },
        }),
      })

      expect(await screen.findByTestId("itinerary-picker")).toBeOnTheScreen()
    })

    // One section is the whole list, so its name would be a redundant subheading.
    it("hides the heading while it has a single section", async () => {
      renderWithRelay(
        {
          Itinerary: () => ({
            ...own,
            sections: [{ internalID: "my-stops", title: "My Stops", stops: [stop(1)] }],
          }),
        },
        props
      )

      await screen.findByText("Stop 1")

      expect(screen.queryAllByTestId("itinerary-section-header")).toHaveLength(0)
      expect(screen.queryByText("My Stops")).not.toBeOnTheScreen()
    })

    // Removing a section's last stop leaves the section behind, and a heading over nothing
    // reads as a section that failed to load.
    it("leaves out a section with no stops, and stops counting it", async () => {
      renderWithRelay(
        {
          Itinerary: () => ({
            ...own,
            sections: [
              { internalID: "my-stops", title: "My Stops", stops: [stop(1)] },
              { internalID: "emptied", title: "Emptied", stops: [] },
            ],
          }),
        },
        props
      )

      await screen.findByText("Stop 1")

      expect(screen.queryByText("Emptied")).not.toBeOnTheScreen()
      // One section left to show, so its own heading is redundant again.
      expect(screen.queryAllByTestId("itinerary-section-header")).toHaveLength(0)
    })

    // A guide copied onto your own itinerary brings its days along; without their headings
    // they read as one undifferentiated list.
    it("shows every section's heading once it has more than one", async () => {
      renderWithRelay({ Itinerary: () => own }, props)

      expect(await screen.findByText("Day 1 — Easing in")).toBeOnTheScreen()
      expect(screen.getByText("Day 2 — London Frieze")).toBeOnTheScreen()
      expect(screen.queryAllByTestId("itinerary-section-header")).toHaveLength(2)
    })

    it("offers to edit it", async () => {
      renderWithRelay({ Itinerary: () => own }, props)

      fireEvent.press(await screen.findByLabelText("Edit Chill Vibes Only"))

      expect(await screen.findByText("Edit Itinerary")).toBeOnTheScreen()
      expect(screen.getByTestId("itinerary-edit-name")).toHaveProp("value", "Chill Vibes Only")
    })

    it("lets its stops be reordered", async () => {
      renderWithRelay({ Itinerary: () => own }, props)

      await screen.findByText("Stop 1")

      const flags = sortableItemDraggableFlags()

      expect(flags.length).toBeGreaterThan(0)
      expect(flags.every(Boolean)).toBe(true)
    })

    it("goes back once the itinerary is deleted from its own edit sheet", async () => {
      const view = renderWithRelay({ Itinerary: () => own }, props)

      fireEvent.press(await screen.findByLabelText("Edit Chill Vibes Only"))
      fireEvent.press(await screen.findByTestId("itinerary-edit-delete"))

      view.mockResolveLastOperation({
        deleteItineraryPayload: () => ({
          responseOrError: { __typename: "ItineraryMutationSuccess" },
        }),
      })

      await waitFor(() => expect(goBack).toHaveBeenCalled())
    })
  })

  describe("a curated guide", () => {
    it("keeps its section headings and byline", async () => {
      renderWithRelay({ Itinerary: () => ITINERARY }, props)

      expect(await screen.findByText("Day 1 — Easing in")).toBeOnTheScreen()
      expect(screen.getByText("By Casey Lesser")).toBeOnTheScreen()
      expect(screen.queryByText("Your Itinerary")).not.toBeOnTheScreen()
    })

    // The picker lists what you own, so on a guide it would navigate away from what you are
    // reading rather than switch between peers.
    it("offers no itinerary picker on the map", async () => {
      renderWithRelay({ Itinerary: () => ITINERARY }, props)

      fireEvent.press(await screen.findByTestId("itinerary-view-toggle"))

      expect(screen.queryByTestId("itinerary-picker")).not.toBeOnTheScreen()
    })

    it("offers no way to edit it", async () => {
      renderWithRelay({ Itinerary: () => ITINERARY }, props)

      await screen.findByText("Chill Vibes Only")

      expect(screen.queryByTestId("itinerary-edit")).not.toBeOnTheScreen()
    })

    // Gravity makes a curated guide's editor its owner, so `isMine` alone can't be trusted —
    // this is the FIREWORKS-68 case: the account that built the guide in forque still sees it
    // as "mine" in the app.
    it("offers no way to edit or reorder it even when isMine is true", async () => {
      renderWithRelay({ Itinerary: () => ({ ...ITINERARY, isMine: true }) }, props)

      await screen.findByText("Stop 1")

      const flags = sortableItemDraggableFlags()

      expect(screen.queryByTestId("itinerary-edit")).not.toBeOnTheScreen()
      expect(flags.length).toBeGreaterThan(0)
      expect(flags.every((draggable) => !draggable)).toBe(true)
    })
  })

  // `isCurated` alone can't distinguish your own itinerary from someone else's personal one
  // opened via their share link — only `isMine` can.
  it("offers no way to edit or share someone else's personal itinerary opened via a share link", async () => {
    renderWithRelay(
      { Itinerary: () => ({ ...ITINERARY, isCurated: false, isMine: false, shareToken: "tok" }) },
      { ...props, shareToken: "tok" }
    )

    await screen.findByText("Chill Vibes Only")

    expect(screen.queryByTestId("itinerary-edit")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-share")).not.toBeOnTheScreen()
  })

  // `ItineraryStop.image` is the curator's uploaded one, and the app sends none when it
  // creates a stop, so without a fallback every entity-backed stop rendered an empty box.
  describe("a stop's image", () => {
    const withStops = (stops: object[]) => ({
      Itinerary: () => ({
        ...ITINERARY,
        sections: [{ internalID: "day-1", title: "Day 1", stops }],
      }),
    })

    it("uses the uploaded image when the curator gave one", async () => {
      renderWithRelay(
        withStops([
          {
            ...stop(1),
            image: { url: "https://example.com/uploaded.jpg" },
            item: {
              __typename: "Show",
              coverImage: { url: "https://example.com/show.jpg" },
            },
          },
        ]),
        props
      )

      expect(await screen.findByTestId("stop-card-image")).toHaveProp(
        "src",
        "https://example.com/uploaded.jpg"
      )
    })

    it("falls back to a show's cover image", async () => {
      renderWithRelay(
        withStops([
          {
            ...stop(1),
            image: null,
            item: {
              __typename: "Show",
              coverImage: { url: "https://example.com/show.jpg" },
            },
          },
        ]),
        props
      )

      expect(await screen.findByTestId("stop-card-image")).toHaveProp(
        "src",
        "https://example.com/show.jpg"
      )
    })

    it("falls back to a fair's image", async () => {
      renderWithRelay(
        withStops([
          {
            ...stop(1),
            image: null,
            item: { __typename: "Fair", image: { url: "https://example.com/fair.jpg" } },
          },
        ]),
        props
      )

      expect(await screen.findByTestId("stop-card-image")).toHaveProp(
        "src",
        "https://example.com/fair.jpg"
      )
    })

    // A location has no picture of its own, so the gallery's profile stands in.
    it("falls back to a gallery's profile image", async () => {
      renderWithRelay(
        withStops([
          {
            ...stop(1),
            image: null,
            item: {
              __typename: "Location",
              partner: {
                slug: "white-cube",
                profile: { image: { url: "https://example.com/gallery.jpg" } },
              },
            },
          },
        ]),
        props
      )

      expect(await screen.findByTestId("stop-card-image")).toHaveProp(
        "src",
        "https://example.com/gallery.jpg"
      )
    })
  })

  describe("the share button", () => {
    it("offers no way to share a curated guide", async () => {
      renderWithRelay({ Itinerary: () => ITINERARY }, props)

      await screen.findByText("Chill Vibes Only")

      expect(screen.queryByTestId("itinerary-share")).not.toBeOnTheScreen()
    })

    it("mints a share token for a personal itinerary and includes it in the link", async () => {
      const own = { ...ITINERARY, isCurated: false, isMine: true, slug: null, shareToken: null }
      const view = renderWithRelay({ Itinerary: () => own }, props)

      fireEvent.press(await screen.findByTestId("itinerary-share"))

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useItineraryShareMintTokenMutation"
        )
      )

      view.env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Mutation: () => ({
            updateItinerary: {
              responseOrError: {
                __typename: "ItineraryMutationSuccess",
                itinerary: { internalID: "chill-vibes-only", shareToken: "abc123" },
              },
            },
          }),
        })
      )

      await waitFor(() => expect(RNShare.open).toHaveBeenCalled())
      expect(RNShare.open).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining(
            "https://staging.artsy.net/city-guide/london-united-kingdom/itinerary/chill-vibes-only?shareToken=abc123"
          ),
        })
      )
    })
  })

  // A stop title `Text` renders its string directly, or as the lone string among other
  // (falsy, conditional) children — either way, this pulls out just the string.
  const stopTitleText = (element: ReactTestInstance) => {
    // eslint-disable-next-line testing-library/no-node-access -- React props, not a DOM node.
    const children = element.props.children

    return Array.isArray(children) ? children.find((child) => typeof child === "string") : children
  }

  const displayedStopTitles = () => screen.getAllByText(/^Stop \d$/).map(stopTitleText)

  // The drag itself is native, so it can't be fired here; `onReorder` is where drax hands the
  // drop back and is invoked directly. What follows it — the optimistic order, the mutation's
  // 1-indexed position, and the revert — is all this screen's own.
  describe("reordering a stop", () => {
    const own = {
      ...ITINERARY,
      isCurated: false,
      isMine: true,
      sections: [{ internalID: "day-1", title: "Day 1", stops: [stop(1), stop(2), stop(3)] }],
    }

    const dropFirstStopLast = () =>
      act(() => {
        dropSortableItem(0, 0, 2)
      })

    it("shows the new order before the mutation answers, and sends a 1-indexed position", async () => {
      const view = renderWithRelay({ Itinerary: () => own }, props)

      expect(await screen.findByText("Stop 1")).toBeOnTheScreen()

      dropFirstStopLast()

      // Optimistic: the list reads in the dropped order with the mutation still in flight.
      expect(displayedStopTitles()).toEqual(["Stop 2", "Stop 3", "Stop 1"])

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useReorderItineraryStopMutation"
        )
      )
      // `acts_as_list`'s `insert_at` is 1-indexed, so display index 2 goes over as 3.
      expect(view.env.mock.getMostRecentOperation().request.variables).toEqual({
        input: { id: "stop-1", position: 3 },
      })

      await act(async () => {
        view.env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Mutation: () => ({
              updateItineraryStop: {
                responseOrError: {
                  __typename: "ItineraryStopMutationSuccess",
                  itineraryStop: { internalID: "stop-1" },
                },
              },
            }),
          })
        )
      })

      expect(displayedStopTitles()).toEqual(["Stop 2", "Stop 3", "Stop 1"])
      expect(mockShowToast).not.toHaveBeenCalled()
    })

    it("puts the stop back and says so when the mutation fails", async () => {
      const view = renderWithRelay({ Itinerary: () => own }, props)

      expect(await screen.findByText("Stop 1")).toBeOnTheScreen()

      dropFirstStopLast()

      expect(displayedStopTitles()).toEqual(["Stop 2", "Stop 3", "Stop 1"])

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useReorderItineraryStopMutation"
        )
      )

      await act(async () => {
        view.env.mock.rejectMostRecentOperation(new Error("network is down"))
      })

      await waitFor(() => expect(displayedStopTitles()).toEqual(["Stop 1", "Stop 2", "Stop 3"]))
      expect(mockShowToast).toHaveBeenCalledWith(
        "Could not reorder that stop, try again",
        "bottom",
        { backgroundColor: "red100" }
      )
    })
  })

  // Refreshed through fetchQuery rather than this query's fetchKey: a network-only re-render
  // would suspend and replace the guide with a spinner.
  describe("pull to refresh", () => {
    it("refetches without unmounting the guide", async () => {
      const view = renderWithRelay({ Itinerary: () => ITINERARY }, props)

      await screen.findByText("Chill Vibes Only")

      // The RefreshControl element itself does not surface in the tree, so the refresh is
      // fired through the scroll view that owns it.
      act(() => {
        screen.UNSAFE_getByType(RefreshControl).props.onRefresh()
      })

      await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))
      expect(view.env.mock.getAllOperations()[0].request.node.params.name).toBe(
        "ItineraryScreenQuery"
      )

      // Still on screen while the refetch is in flight, rather than replaced by the fallback.
      expect(screen.getByText("Chill Vibes Only")).toBeOnTheScreen()
    })

    it("renders an itinerary that becomes empty after refreshing", async () => {
      const view = renderWithRelay({ Itinerary: () => ITINERARY }, props)

      expect(await screen.findByText("Stop 1")).toBeOnTheScreen()

      act(() => {
        screen.UNSAFE_getByType(RefreshControl).props.onRefresh()
      })

      await waitFor(() => expect(view.env.mock.getAllOperations()).toHaveLength(1))

      await act(async () => {
        view.env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Itinerary: () => ({ ...ITINERARY, sections: [] }),
          })
        )
      })

      await waitFor(() => expect(screen.queryByText("Stop 1")).not.toBeOnTheScreen())
      expect(screen.getByText("Chill Vibes Only")).toBeOnTheScreen()
    })
  })

  it("keeps the stop list clear of the floating map toggle button", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    expect(await screen.findByText("Stop 1")).toBeOnTheScreen()

    expect(screen.UNSAFE_getByType(ScrollView).props.contentContainerStyle).toMatchObject({
      paddingBottom: 60,
    })
  })

  // Itinerary, ItinerarySection and ItineraryStop each carry an id, so every query that reads
  // an itinerary writes to the same record this screen renders from. The listing behind the
  // Add to Itinerary sheet has no sections (Gravity serializes it at :short), and a listing
  // that selected them wrote that empty list over this screen's own, blanking the stops.
  describe("opening Add to Itinerary", () => {
    const own = {
      ...ITINERARY,
      id: "itinerary-global-id",
      isCurated: false,
      sections: [
        {
          internalID: "day-1",
          title: "Day 1",
          stops: [
            { ...stop(1), item: { __typename: "Show", internalID: "show-1", name: "Show 1" } },
          ],
        },
        { internalID: "day-2", title: "Day 2", stops: [stop(2)] },
      ],
    }

    it("keeps every stop on screen once the sheet's own query resolves", async () => {
      const view = renderWithRelay({ Itinerary: () => own }, props)

      expect(await screen.findByText("Stop 1")).toBeOnTheScreen()
      expect(screen.getByText("Stop 2")).toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("city-guide-save-button"))

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "AddToItinerarySheetQuery"
        )
      )

      await act(async () => {
        view.env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Me: () => ({
              itinerariesConnection: {
                edges: [
                  {
                    node: {
                      id: "itinerary-global-id",
                      internalID: own.internalID,
                      title: own.title,
                      isCurated: false,
                      stopsCount: 2,
                      heroImage: null,
                    },
                  },
                ],
              },
            }),
          })
        )
      })

      // The sheet lists the itinerary by title, so the header's copy is no longer alone.
      expect(await screen.findAllByText("Chill Vibes Only")).toHaveLength(2)
      expect(screen.getByText("Stop 1")).toBeOnTheScreen()
      expect(screen.getByText("Stop 2")).toBeOnTheScreen()
    })
  })
})
