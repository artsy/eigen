import { renderHook, waitFor } from "@testing-library/react-native"
import { useCityItineraryStops } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

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

  /** An itinerary with one empty section. */
  const existingItinerary = {
    Me: () => ({
      itinerariesConnection: {
        edges: [
          {
            node: { internalID: "itinerary-1", sections: [{ internalID: "section-1", stops: [] }] },
          },
        ],
      },
    }),
  }

  /** The same, already holding a stop for show-1. */
  const itineraryWithShow = {
    Me: () => ({
      itinerariesConnection: {
        edges: [
          {
            node: {
              internalID: "itinerary-1",
              sections: [
                {
                  internalID: "section-1",
                  stops: [
                    {
                      internalID: "stop-1",
                      item: { __typename: "Show", internalID: "show-1" },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    }),
  }

  it("adds a stop to the itinerary the user already has, in one mutation", async () => {
    const { result } = renderIt()

    const promise = result.current.addStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("useCityItineraryStopsAddMutation", {
      createItineraryStopPayload: () => ({
        responseOrError: {
          __typename: "ItineraryStopMutationSuccess",
          itineraryStop: { internalID: "stop-1" },
        },
      }),
    })

    await expect(promise).resolves.toBeTruthy()
  })

  // Three round trips, because Metaphysics has no find-or-create and a new itinerary has no
  // section for a stop to belong to.
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

    // The default itinerary is named after the city, and nothing else.
    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
      citySlug: "london-united-kingdom",
      name: "London",
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

    // The section is named after the city too.
    expect(env.mock.getMostRecentOperation().request.variables.input).toEqual({
      itineraryID: "new-itinerary",
      title: "London",
    })

    await resolveNext("useCityItineraryStopsCreateSectionMutation", {
      createItinerarySectionPayload: () => ({
        responseOrError: {
          __typename: "ItinerarySectionMutationSuccess",
          itinerarySection: { internalID: "new-section" },
        },
      }),
    })

    await resolveNext("useCityItineraryStopsAddMutation", {
      createItineraryStopPayload: () => ({
        responseOrError: {
          __typename: "ItineraryStopMutationSuccess",
          itineraryStop: { internalID: "stop-1" },
        },
      }),
    })

    await expect(promise).resolves.toBeTruthy()
  })

  // deleteItineraryStop takes the stop's own id, which a card never has, so the stop is found
  // by the entity it points at.
  it("finds the stop by its item, then deletes it by id", async () => {
    const { result } = renderIt()

    const promise = result.current.removeStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", itineraryWithShow)

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

    await expect(promise).resolves.toBeNull()
  })

  // Gravity has no uniqueness constraint on (section, item type, item id) yet.
  it("does not add a second stop for an entity already on the itinerary", async () => {
    const { result } = renderIt()

    const promise = result.current.addStop({ itemType: "SHOW", itemID: "show-1" })

    await resolveNext("useCityItineraryStopsLookupQuery", itineraryWithShow)

    await expect(promise).resolves.toMatchObject({ internalID: "stop-1" })
    // Only the lookup ran: no create mutation was fired.
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
    await resolveNext("useCityItineraryStopsAddMutation", {
      createItineraryStopPayload: () => ({
        responseOrError: {
          __typename: "ItineraryStopMutationSuccess",
          itineraryStop: { internalID: "stop-1" },
        },
      }),
    })

    await expect(first).resolves.toBeTruthy()

    // Now the second one starts.
    await resolveNext("useCityItineraryStopsLookupQuery", existingItinerary)
    await resolveNext("useCityItineraryStopsAddMutation", {
      createItineraryStopPayload: () => ({
        responseOrError: {
          __typename: "ItineraryStopMutationSuccess",
          itineraryStop: { internalID: "stop-2" },
        },
      }),
    })

    await expect(second).resolves.toBeTruthy()
  })
})
