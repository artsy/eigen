import { renderHook, waitFor } from "@testing-library/react-native"
import {
  defaultItineraryTitle,
  findStop,
  MY_STOPS_SECTION,
  useCityItineraryStops,
} from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

const showStop = (stopId: string, showId: string) => ({
  internalID: stopId,
  item: { __typename: "Show", internalID: showId },
})

describe("findStop", () => {
  // Metaphysics has no "is this on my itinerary" field, so the app works it out itself.
  it("finds the stop pointing at the entity", () => {
    const result = findStop([showStop("stop-1", "show-1")], { itemType: "SHOW", itemID: "show-1" })

    expect(result?.internalID).toBe("stop-1")
  })

  it("ignores a stop of another type with the same id", () => {
    const result = findStop(
      [{ internalID: "stop-1", item: { __typename: "Fair", internalID: "x-1" } }],
      {
        itemType: "SHOW",
        itemID: "x-1",
      }
    )

    expect(result).toBeUndefined()
  })

  it("ignores a custom stop, which points at nothing", () => {
    const result = findStop([{ internalID: "stop-1", item: null }], {
      itemType: "SHOW",
      itemID: "show-1",
    })

    expect(result).toBeUndefined()
  })
})

describe("useCityItineraryStops", () => {
  let env: ReturnType<typeof createMockEnvironment>

  const wrapper = ({ children }: any) => (
    <RelayEnvironmentProvider environment={env}>{children}</RelayEnvironmentProvider>
  )

  const renderIt = () =>
    renderHook(
      () => useCityItineraryStops({ citySlug: "london-united-kingdom", cityName: "London" }),
      { wrapper }
    )

  /** Resolves the next pending operation, whatever it is, with the given resolvers. */
  const resolveNext = async (name: string, resolvers: object) => {
    await waitFor(() => {
      const op = env.mock.getMostRecentOperation()
      expect(op.request.node.params.name).toEqual(name)
    })

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, resolvers)
    )
  }

  beforeEach(() => {
    env = createMockEnvironment()
    jest.clearAllMocks()
  })

  /** The listing knows the user has an itinerary. Its sections come from a second read. */
  const existingItinerary = {
    Me: () => ({ itinerariesConnection: { edges: [{ node: { internalID: "itinerary-1" } }] } }),
  }

  /** An empty "My Stops" section, which is where an added stop belongs. */
  const emptyMyStops = {
    Itinerary: () => ({
      sections: [{ internalID: "section-1", title: MY_STOPS_SECTION, stops: [] }],
    }),
  }

  /** The same, already holding a stop for show-1. */
  const myStopsWithShow = {
    Itinerary: () => ({
      sections: [
        { internalID: "section-1", title: MY_STOPS_SECTION, stops: [showStop("stop-1", "show-1")] },
      ],
    }),
  }

  const stopAdded = (internalID: string) => ({
    createItineraryStopPayload: () => ({
      responseOrError: {
        __typename: "ItineraryStopMutationSuccess",
        itineraryStop: { internalID },
      },
    }),
  })

  it("adds a stop to the itinerary the user already has, in one mutation", async () => {
    const { result } = renderIt()

    const promise = result.current.addStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("fetchItinerarySectionsQuery", emptyMyStops)
    await resolveNext("useCityItineraryStopsAddMutation", stopAdded("stop-1"))

    await expect(promise).resolves.toBeTruthy()
  })

  // The rail's own counts would otherwise stay stale until its screen happens to remount.
  it("refetches the itineraries rail once a stop is added", async () => {
    const { result } = renderIt()

    const promise = result.current.addStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("fetchItinerarySectionsQuery", emptyMyStops)
    await resolveNext("useCityItineraryStopsAddMutation", stopAdded("stop-1"))

    await expect(promise).resolves.toBeTruthy()

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.params.name).toEqual(
        "CityGuideItinerariesRailQuery"
      )
    )
    expect(env.mock.getMostRecentOperation().request.variables).toEqual({
      citySlug: "london-united-kingdom",
      first: 10,
    })
  })

  // The listing serializes at :short, which has no sections, so the itinerary's own are read
  // separately — through Query.itinerary, the same record the itinerary screen renders from.
  it("reads the sections through Query.itinerary rather than the listing", async () => {
    const { result } = renderIt()

    void result.current.addStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.params.name).toEqual(
        "fetchItinerarySectionsQuery"
      )
    )
    expect(env.mock.getMostRecentOperation().request.variables).toEqual({ id: "itinerary-1" })
  })

  // The name is a plain string Gravity stores verbatim, so a stop belongs in the section the
  // user already has rather than in a second one differing only in case.
  it("reuses a My Stops section however it is cased", async () => {
    const { result } = renderIt()

    void result.current.addStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("fetchItinerarySectionsQuery", {
      Itinerary: () => ({
        sections: [{ internalID: "my-stops", title: "my stops ", stops: [] }],
      }),
    })

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.params.name).toEqual(
        "useCityItineraryStopsAddMutation"
      )
    )
    expect(env.mock.getMostRecentOperation().request.variables.input.itinerarySectionID).toBe(
      "my-stops"
    )
  })

  // Creating one on the strength of a failed read is what leaves an itinerary with two.
  it("refuses to add a section when the itinerary cannot be read", async () => {
    const { result } = renderIt()

    const promise = result.current.addStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("fetchItinerarySectionsQuery", { Query: () => ({ itinerary: null }) })

    await expect(promise).rejects.toThrow("Could not read that itinerary")
    expect(env.mock.getAllOperations()).toHaveLength(0)
  })

  // An itinerary copied from a guide arrives with the guide's own days, so the section is
  // matched by name rather than taken as the first.
  it("adds to an existing My Stops section rather than a guide's own days", async () => {
    const { result } = renderIt()

    // Not awaited: the assertion is about which section the add targets, not its result.
    void result.current.addStop({ itemType: "SHOW", itemID: "show-2" })

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("fetchItinerarySectionsQuery", {
      Itinerary: () => ({
        sections: [
          { internalID: "day-1", title: "Day 1", stops: [] },
          { internalID: "my-stops", title: MY_STOPS_SECTION, stops: [] },
        ],
      }),
    })

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.params.name).toEqual(
        "useCityItineraryStopsAddMutation"
      )
    )

    expect(env.mock.getMostRecentOperation().request.variables.input.itinerarySectionID).toBe(
      "my-stops"
    )
  })

  it("leaves the city out of the name when none is known", () => {
    expect(defaultItineraryTitle()).toBe(defaultItineraryTitle(undefined))
    expect(defaultItineraryTitle("London")).toBe(`London ${defaultItineraryTitle()}`)
  })

  // A custom stop has no Artsy entity to point at, so its fields are copied instead. The
  // image cannot come across: createItineraryStopInput.imageURL takes an S3 upload URL.
  describe("a custom stop", () => {
    const customStop = {
      title: "Coffee at London Cafe",
      address: "12 Bermondsey Street",
      note: "Small place, good pastries.",
      sourceURL: "https://timeout.com/london-cafe",
      category: "GALLERY" as const,
      isFreeAdmission: true,
      latitude: 51.5,
      longitude: -0.1,
    }

    it("sends the copied fields and no item", async () => {
      const { result } = renderIt()

      const promise = result.current.addStop(customStop)

      await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
      await resolveNext("fetchItinerarySectionsQuery", emptyMyStops)

      await waitFor(() => {
        const op = env.mock.getMostRecentOperation()
        expect(op.request.node.params.name).toEqual("useCityItineraryStopsAddMutation")
      })

      const { input } = env.mock.getMostRecentOperation().request.variables

      expect(input).toEqual({
        itinerarySectionID: "section-1",
        ...customStop,
      })
      expect(input.itemType).toBeUndefined()
      expect(input.itemID).toBeUndefined()

      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, stopAdded("stop-9"))
      )

      await expect(promise).resolves.toBeTruthy()
    })

    // No id to compare, so a duplicate is caught on title plus address.
    it("does not add the same custom stop twice", async () => {
      const { result } = renderIt()

      const promise = result.current.addStop(customStop)

      await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
      await resolveNext("fetchItinerarySectionsQuery", {
        Itinerary: () => ({
          sections: [
            {
              internalID: "section-1",
              title: MY_STOPS_SECTION,
              stops: [
                {
                  internalID: "stop-9",
                  title: "Coffee at London Cafe",
                  address: "12 Bermondsey Street",
                  item: null,
                },
              ],
            },
          ],
        }),
      })

      await expect(promise).resolves.toBeTruthy()
      expect(env.mock.getAllOperations()).toHaveLength(0)
    })
  })

  // Metaphysics has no find-or-create, and a new itinerary has no section for a stop to
  // belong to. With no itinerary there are no sections to read either.
  it("creates the itinerary and a section when the user has none", async () => {
    const { result } = renderIt()

    const promise = result.current.addStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", {
      Me: () => ({ itinerariesConnection: { edges: [] } }),
    })

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.params.name).toEqual(
        "useCityItineraryStopsCreateItineraryMutation"
      )
    )

    // "London October 2026" — a trip rather than a place, so a second visit does not collide.
    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
      citySlug: "london-united-kingdom",
      title: defaultItineraryTitle("London"),
    })

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        createItineraryPayload: () => ({
          responseOrError: {
            __typename: "ItineraryMutationSuccess",
            itinerary: { internalID: "new-itinerary" },
          },
        }),
      })
    )

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.params.name).toEqual(
        "useCityItineraryStopsCreateSectionMutation"
      )
    )

    // Every added stop goes to "My Stops": nothing can create a section yet.
    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
      itineraryID: "new-itinerary",
      title: MY_STOPS_SECTION,
    })

    await resolveNext("useCityItineraryStopsCreateSectionMutation", {
      createItinerarySectionPayload: () => ({
        responseOrError: {
          __typename: "ItinerarySectionMutationSuccess",
          itinerarySection: { internalID: "new-section" },
        },
      }),
    })

    await resolveNext("useCityItineraryStopsAddMutation", stopAdded("stop-1"))

    await expect(promise).resolves.toBeTruthy()
  })

  // deleteItineraryStop takes the stop's own id, which a card never has, so the stop is found
  // by the entity it points at.
  it("finds the stop by its item, then deletes it by id", async () => {
    const { result } = renderIt()

    const promise = result.current.removeStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("fetchItinerarySectionsQuery", myStopsWithShow)

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.params.name).toEqual(
        "useCityItineraryStopsRemoveMutation"
      )
    )

    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({ id: "stop-1" })

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        deleteItineraryStopPayload: () => ({
          responseOrError: {
            __typename: "ItineraryStopMutationSuccess",
            itineraryStop: { internalID: "stop-1" },
          },
        }),
      })
    )

    await expect(promise).resolves.toBeTruthy()
  })

  // The card already shows what the user wanted, so this is success, not an error.
  it("does nothing when the itinerary has no stop for that entity", async () => {
    const { result } = renderIt()

    const promise = result.current.removeStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("fetchItinerarySectionsQuery", emptyMyStops)

    await expect(promise).resolves.toBeNull()
  })

  // Gravity has no uniqueness constraint on (section, item type, item id) yet.
  it("does not add a second stop for an entity already on the itinerary", async () => {
    const { result } = renderIt()

    const promise = result.current.addStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("fetchItinerarySectionsQuery", myStopsWithShow)

    await expect(promise).resolves.toMatchObject({ stop: { internalID: "stop-1" } })
    // Only the reads ran: no create mutation was fired.
    expect(env.mock.getAllOperations()).toHaveLength(0)
  })

  // Nothing to remove from, and creating an itinerary in order to delete from it is absurd.
  it("does nothing when removing and the user has no itinerary", async () => {
    const { result } = renderIt()

    const promise = result.current.removeStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", {
      Me: () => ({ itinerariesConnection: { edges: [] } }),
    })

    await expect(promise).resolves.toBeNull()
  })

  it("surfaces a mutation failure rather than reporting success", async () => {
    const { result } = renderIt()

    const promise = result.current.addStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("fetchItinerarySectionsQuery", emptyMyStops)
    await resolveNext("useCityItineraryStopsAddMutation", {
      createItineraryStopPayload: () => ({
        responseOrError: {
          __typename: "ItineraryStopMutationFailure",
          mutationError: { message: "Gravity said no" },
        },
      }),
    })

    await expect(promise).rejects.toThrow("Gravity said no")
  })

  // Two quick taps would otherwise each find no itinerary and create one.
  it("serialises calls so a double tap cannot create two itineraries", async () => {
    const { result } = renderIt()

    const first = result.current.addStop({ itemType: "SHOW", itemID: "show-1" })
    const second = result.current.addStop({ itemType: "SHOW", itemID: "show-2" })

    // Only the first call's lookup is in flight; the second is still queued behind it.
    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(1))

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("fetchItinerarySectionsQuery", emptyMyStops)
    await resolveNext("useCityItineraryStopsAddMutation", stopAdded("stop-1"))

    await expect(first).resolves.toBeTruthy()

    // Now the second one starts.
    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("fetchItinerarySectionsQuery", emptyMyStops)
    await resolveNext("useCityItineraryStopsAddMutation", stopAdded("stop-2"))

    await expect(second).resolves.toBeTruthy()
  })
})
