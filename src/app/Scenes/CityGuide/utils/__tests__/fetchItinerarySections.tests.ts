import { fetchItinerarySections } from "app/Scenes/CityGuide/utils/fetchItinerarySections"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("fetchItinerarySections", () => {
  it("reads the sections through Query.itinerary, not the listing", async () => {
    const env = createMockEnvironment()

    const promise = fetchItinerarySections(env, "itinerary-1")

    const operation = env.mock.getMostRecentOperation()
    expect(operation.request.node.params.name).toBe("fetchItinerarySectionsQuery")
    expect(operation.request.variables).toEqual({ id: "itinerary-1" })

    env.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, {
        Itinerary: () => ({
          sections: [
            { internalID: "day-1", title: "Day 1", stops: [] },
            { internalID: "my-stops", title: "My Stops", stops: [{ internalID: "stop-1" }] },
          ],
        }),
      })
    )

    await expect(promise).resolves.toMatchObject([
      { internalID: "day-1", title: "Day 1" },
      { internalID: "my-stops", title: "My Stops", stops: [{ internalID: "stop-1" }] },
    ])
  })

  /*
    Null, not an empty list: a caller must be able to tell "this itinerary has no sections
    yet" from "we could not read it". Creating a "My Stops" on the strength of the latter is
    what leaves an itinerary with two of them.
  */
  it("returns null when the itinerary does not resolve", async () => {
    const env = createMockEnvironment()

    const promise = fetchItinerarySections(env, "gone")

    env.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, { Query: () => ({ itinerary: null }) })
    )

    await expect(promise).resolves.toBeNull()
  })

  it("returns an empty list for an itinerary that has no sections yet", async () => {
    const env = createMockEnvironment()

    const promise = fetchItinerarySections(env, "brand-new")

    env.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, { Itinerary: () => ({ sections: [] }) })
    )

    await expect(promise).resolves.toEqual([])
  })
})
