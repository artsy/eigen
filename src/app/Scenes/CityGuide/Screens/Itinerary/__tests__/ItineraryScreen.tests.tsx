import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryScreen } from "app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen"
import { goBack } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Alert, RefreshControl } from "react-native"
import { PanGesture } from "react-native-gesture-handler"
import { fireGestureHandler, getByGestureTestId } from "react-native-gesture-handler/jest-utils"
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

// A stop title `Text` renders its string directly, or as the lone string among other
// (falsy, conditional) children — either way, this pulls out just the string.
const stopTitleText = (element: ReactTestInstance) => {
  // eslint-disable-next-line testing-library/no-node-access -- React props, not a DOM node.
  const children = element.props.children

  return Array.isArray(children) ? children.find((child) => typeof child === "string") : children
}

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

  it("numbers stops continuously across sections", async () => {
    renderWithRelay({ Itinerary: () => ITINERARY }, props)

    // Numbering runs 1..N across the whole itinerary rather than restarting per section,
    // so the last number only exists if every earlier section was counted.
    expect(await screen.findByText("4")).toBeTruthy()
    expect(screen.queryByText("5")).toBeNull()
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

    expect(await screen.findAllByText("11:00am-4:00pm")).not.toHaveLength(0)
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

    it("shows no stop numbers, since it has no running order", async () => {
      renderWithRelay({ Itinerary: () => own }, props)

      await screen.findByText("Stop 1")

      expect(screen.queryAllByTestId("itinerary-stop-number")).toHaveLength(0)
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
      // Still no numbering: the headings say where you are, not in what order.
      expect(screen.queryAllByTestId("itinerary-stop-number")).toHaveLength(0)
    })

    it("offers to edit it", async () => {
      renderWithRelay({ Itinerary: () => own }, props)

      fireEvent.press(await screen.findByLabelText("Edit Chill Vibes Only"))

      expect(await screen.findByText("Edit Itinerary")).toBeOnTheScreen()
      expect(screen.getByTestId("itinerary-edit-name")).toHaveProp("value", "Chill Vibes Only")
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
    it("keeps its numbering, section headings and byline", async () => {
      renderWithRelay({ Itinerary: () => ITINERARY }, props)

      expect(await screen.findByText("Day 1 — Easing in")).toBeOnTheScreen()
      expect(screen.getByText("By Casey Lesser")).toBeOnTheScreen()
      expect(screen.queryAllByTestId("itinerary-stop-number")).not.toHaveLength(0)
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
  })

  // `isCurated` alone can't distinguish your own itinerary from someone else's personal one
  // opened via their share link — only `isMine` can.
  it("offers no way to edit someone else's personal itinerary opened via a share link", async () => {
    renderWithRelay(
      { Itinerary: () => ({ ...ITINERARY, isCurated: false, isMine: false, shareToken: "tok" }) },
      { ...props, shareToken: "tok" }
    )

    await screen.findByText("Chill Vibes Only")

    expect(screen.queryByTestId("itinerary-edit")).not.toBeOnTheScreen()
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
    it("shares a curated guide's public link, minting nothing", async () => {
      const view = renderWithRelay({ Itinerary: () => ITINERARY }, props)

      fireEvent.press(await screen.findByTestId("itinerary-share"))

      await waitFor(() => expect(RNShare.open).toHaveBeenCalled())

      // No share-token mutation for a curated guide — its slug is already public. (A curated
      // guide's own Add Full List button fires an unrelated query of its own on mount.)
      expect(
        view.env.mock
          .getAllOperations()
          .some((op) => op.request.node.params.name === "useItineraryShareMintTokenMutation")
      ).toBe(false)
      expect(RNShare.open).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining(
            "https://staging.artsy.net/city-guide/london-united-kingdom/itinerary/chill-vibes-only"
          ),
        })
      )
    })

    it("mints a share token for a personal itinerary and includes it in the link", async () => {
      const own = { ...ITINERARY, isCurated: false, slug: null, shareToken: null }
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

  // Refreshed through fetchQuery rather than this query's fetchKey: a network-only re-render
  // would suspend and replace the guide with a spinner.
  describe("pull to refresh", () => {
    it("refetches without unmounting the guide", async () => {
      const view = renderWithRelay({ Itinerary: () => ITINERARY }, props)

      await screen.findByText("Chill Vibes Only")

      // A curated guide's own Add Full List button fires its own query to check for a
      // same-named itinerary you already own; resolve it so it doesn't count below.
      await act(async () => {
        view.env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, { Me: () => ({ itinerariesConnection: null }) })
        )
      })

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

      await act(async () => {
        view.env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, { Me: () => ({ itinerariesConnection: null }) })
        )
      })

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

  // No real ownership field on `Query.itinerary` yet (FIREWORKS-36 is adding one), so the gate
  // is `!isCurated && !shareToken` — exercised here rather than restated per screen.
  describe("swipe to delete a stop", () => {
    const own = { ...ITINERARY, isCurated: false, shareToken: null }

    beforeEach(() => {
      jest.spyOn(Alert, "alert").mockImplementation((_title, _message, buttons) => {
        buttons?.find((button) => button.style === "destructive")?.onPress?.()
      })
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    const swipeAndConfirmDelete = (stopID: string) => {
      fireGestureHandler<PanGesture>(getByGestureTestId(`pan-itinerary-stop-${stopID}`), [
        { translationX: 0 },
        { translationX: -100 },
      ])
      fireEvent.press(screen.getByTestId(`delete-button-${stopID}`))
    }

    it("offers no swipe gesture on a curated guide", async () => {
      renderWithRelay({ Itinerary: () => ITINERARY }, props)

      await screen.findByText("Stop 1")

      expect(screen.queryByTestId("delete-button-stop-1")).toBeNull()
    })

    it("offers no swipe gesture on a shared link to somebody else's itinerary", async () => {
      renderWithRelay(
        { Itinerary: () => ({ ...own, shareToken: "abc123" }) },
        { ...props, shareToken: "abc123" }
      )

      await screen.findByText("Stop 1")

      expect(screen.queryByTestId("delete-button-stop-1")).toBeNull()
    })

    it("removes the swiped stop from the list and the map after a confirmed delete", async () => {
      const view = renderWithRelay({ Itinerary: () => own }, props)

      expect(await screen.findByText("Stop 1")).toBeOnTheScreen()

      swipeAndConfirmDelete("stop-1")

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useDeleteItineraryStopMutation"
        )
      )

      await act(async () => {
        view.env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Mutation: () => ({
              deleteItineraryStop: {
                responseOrError: {
                  __typename: "ItineraryStopMutationSuccess",
                  itineraryStop: { internalID: "stop-1" },
                },
              },
            }),
          })
        )
      })

      await waitFor(() => expect(screen.queryByText("Stop 1")).not.toBeOnTheScreen())
      expect(screen.getByText("Stop 2")).toBeOnTheScreen()
    })

    // Removing the only stop left in a day empties that section, which the screen already
    // drops rather than showing a heading over nothing.
    it("drops a section once its last stop is swipe-deleted", async () => {
      const twoDays = {
        ...own,
        sections: [
          { internalID: "day-1", title: "Day 1 — Easing in", stops: [stop(1)] },
          { internalID: "day-2", title: "Day 2 — London Frieze", stops: [stop(2)] },
        ],
      }
      const view = renderWithRelay({ Itinerary: () => twoDays }, props)

      expect(await screen.findByText("Stop 1")).toBeOnTheScreen()

      swipeAndConfirmDelete("stop-1")

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useDeleteItineraryStopMutation"
        )
      )

      await act(async () => {
        view.env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Mutation: () => ({
              deleteItineraryStop: {
                responseOrError: {
                  __typename: "ItineraryStopMutationSuccess",
                  itineraryStop: { internalID: "stop-1" },
                },
              },
            }),
          })
        )
      })

      await waitFor(() => expect(screen.queryByText("Stop 1")).not.toBeOnTheScreen())
      // The section itself is gone too, not just its stop, since it now has none left.
      expect(screen.queryByText("Day 1 — Easing in")).not.toBeOnTheScreen()
      expect(screen.getByText("Stop 2")).toBeOnTheScreen()
    })

    // Regression test: `handleReorderStop` used to resolve its section and previous order from
    // the raw itinerary rather than the displayed one, so a drag after a delete in the same
    // section ran `moveStop` on stale indices and produced the wrong order.
    it("keeps the order correct when a stop is dragged after an earlier delete in the same section", async () => {
      const fourStops = {
        ...own,
        sections: [
          {
            internalID: "day-1",
            title: "Day 1 — Easing in",
            stops: [stop(1), stop(2), stop(3), stop(4)],
          },
        ],
      }
      const view = renderWithRelay({ Itinerary: () => fourStops }, props)

      expect(await screen.findByText("Stop 1")).toBeOnTheScreen()

      // Delete Stop 2, so the displayed section is [Stop 1, Stop 3, Stop 4] while the raw
      // itinerary this screen still holds keeps all four.
      swipeAndConfirmDelete("stop-2")

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useDeleteItineraryStopMutation"
        )
      )

      await act(async () => {
        view.env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Mutation: () => ({
              deleteItineraryStop: {
                responseOrError: {
                  __typename: "ItineraryStopMutationSuccess",
                  itineraryStop: { internalID: "stop-2" },
                },
              },
            }),
          })
        )
      })

      await waitFor(() => expect(screen.queryByText("Stop 2")).not.toBeOnTheScreen())

      // Drag Stop 1 (displayed index 0 of 3) to the end of the displayed section.
      act(() => {
        fireGestureHandler<PanGesture>(getByGestureTestId("drag-itinerary-stop-stop-1"), [
          { translationY: 0 },
          { translationY: 20 },
        ])
      })

      await waitFor(() =>
        expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
          "useReorderItineraryStopMutation"
        )
      )

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

      // Dragging Stop 1 to the end of the displayed [Stop 1, Stop 3, Stop 4] gives
      // [Stop 3, Stop 4, Stop 1] — resolving the section against the raw (undeleted)
      // itinerary would instead have produced [Stop 3, Stop 1, Stop 4].
      await waitFor(() => {
        const titles = screen.getAllByText(/^Stop \d$/).map(stopTitleText)
        expect(titles).toEqual(["Stop 3", "Stop 4", "Stop 1"])
      })
    })
  })
})
