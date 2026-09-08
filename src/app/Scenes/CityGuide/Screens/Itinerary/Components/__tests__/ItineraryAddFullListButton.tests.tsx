import { Button } from "@artsy/palette-mobile"
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryAddFullListButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryAddFullListButton"
import {
  ItineraryStopEntitiesProvider,
  ItineraryStopEntity,
  useReportItineraryStopEntity,
} from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useEffect } from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

const entity = (
  stopId: string,
  isFollowed: boolean,
  type: ItineraryStopEntity["type"] = "SHOW"
): ItineraryStopEntity => ({
  stopId,
  id: `node-${stopId}`,
  internalID: `internal-${stopId}`,
  isFollowed,
  type,
})

/** Minimal stops, so the provider seeds the expected set the same way the screen does. */
const stopsFor = (entities: ItineraryStopEntity[]): ItineraryStop[] =>
  entities.map(
    (e) =>
      ({
        id: e.stopId,
        saveTarget: { type: e.type, slug: `slug-${e.stopId}` },
      }) as ItineraryStop
  )

/** Reports entities directly, standing in for Task 13's resolvers. */
const Seed: React.FC<{ entities: ItineraryStopEntity[] }> = ({ entities }) => {
  const { report } = useReportItineraryStopEntity()

  useEffect(() => {
    entities.forEach(report)
  }, [entities, report])

  return null
}

/**
 * Rendered without `setupTestWrapper`: this tree fires no query at render, and that helper
 * unconditionally resolves one operation (`setupTestWrapper.tsx:112-129`), which throws when
 * nothing is pending.
 *
 * `seeded` defaults to `entities`, so the common case is a fully settled provider. Pass fewer
 * to model lookups still in flight.
 */
const renderButton = (
  env: ReturnType<typeof createMockEnvironment>,
  entities: ItineraryStopEntity[],
  seeded: ItineraryStopEntity[] = entities
) =>
  renderWithWrappers(
    <RelayEnvironmentProvider environment={env}>
      <ItineraryStopEntitiesProvider stops={stopsFor(entities)}>
        <Seed entities={seeded} />
        <ItineraryAddFullListButton citySlug="madrid" itineraryId="itinerary-1" />
      </ItineraryStopEntitiesProvider>
    </RelayEnvironmentProvider>
  )

/**
 * A stop with no `saveTarget` at all — a cafe, or an address the guide author added to the
 * route, rather than an Artsy entity. `ItineraryStopEntityResolvers` never queries it and the
 * provider's `saveableStopIds` never counts it, so it must not appear in `expectedCount` or in
 * any mutation the button fires.
 */
const nonArtsyStop = (id: string): ItineraryStop => ({ id, saveTarget: null }) as ItineraryStop

/** Like `renderButton`, but lets the caller mix in stops that have no `saveTarget`. */
const renderButtonWithStops = (
  env: ReturnType<typeof createMockEnvironment>,
  stops: ItineraryStop[],
  entities: ItineraryStopEntity[],
  seeded: ItineraryStopEntity[] = entities
) =>
  renderWithWrappers(
    <RelayEnvironmentProvider environment={env}>
      <ItineraryStopEntitiesProvider stops={stops}>
        <Seed entities={seeded} />
        <ItineraryAddFullListButton citySlug="madrid" itineraryId="itinerary-1" />
      </ItineraryStopEntitiesProvider>
    </RelayEnvironmentProvider>
  )

describe("ItineraryAddFullListButton", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    jest.clearAllMocks()
    env = createMockEnvironment()
  })

  it("offers to add the list when every lookup resolved and something is unsaved", async () => {
    renderButton(env, [entity("a", false), entity("b", true)])

    expect(await screen.findByText("Add Full List")).toBeTruthy()
  })

  it("is not actionable while a lookup is still pending", async () => {
    const entities = [entity("a", false), entity("b", false)]

    // Two stops expected, one reported: the provider is incomplete.
    renderButton(env, entities, [entities[0]])

    const button = await screen.findByText("Add Full List")
    fireEvent.press(button)

    // The bug this guards: one resolved entity used to be enough to fire a partial bulk add.
    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(0))
  })

  it("does not show a spinner while a lookup is still pending", async () => {
    const entities = [entity("a", false), entity("b", false)]

    // Two stops expected, one reported: the provider is not settled.
    renderButton(env, entities, [entities[0]])

    await screen.findByText("Add Full List")

    // A spinner here would misread as an in-flight action, but the user has not pressed
    // anything yet: the button is merely waiting on lookups to settle.
    expect(screen.UNSAFE_getByType(Button).props.loading).not.toBe(true)
  })

  it("reports the list as added when everything is already saved", async () => {
    renderButton(env, [entity("a", true), entity("b", true)])

    expect(await screen.findByText("Added")).toBeTruthy()
  })

  it("renders nothing when there are no saveable stops", () => {
    renderButton(env, [])

    expect(screen.queryByText("Add Full List")).toBeNull()
    expect(screen.queryByText("Added")).toBeNull()
  })

  it("fires one mutation per unsaved entity and none for the saved one", async () => {
    const entities = [entity("a", false), entity("b", true), entity("c", false)]
    const unsavedCount = entities.filter((e) => !e.isFollowed).length

    renderButton(env, entities)
    fireEvent.press(await screen.findByText("Add Full List"))

    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(unsavedCount))
  })

  it("follows a partner through the profile mutation, not the show one", async () => {
    renderButton(env, [entity("a", false, "PARTNER")])
    fireEvent.press(await screen.findByText("Add Full List"))

    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(1))
    // Exercises the profile branch of `follow()`, which show-only fixtures never reach.
    expect(env.mock.getAllOperations()[0].request.node.operation.name).toMatch(/Profile/)
  })

  it("returns to the idle label when every mutation fails", async () => {
    renderButton(env, [entity("a", false), entity("b", false)])
    fireEvent.press(await screen.findByText("Add Full List"))

    await waitFor(() => expect(env.mock.getAllOperations().length).toBeGreaterThan(0))
    act(() => {
      // Each operation explicitly. Rejecting "most recent" in a loop hits the same one twice
      // and leaves the other promise pending, so `mapWithLimit` never settles.
      env.mock.getAllOperations().forEach((operation) => {
        env.mock.reject(operation, new Error("nope"))
      })
    })

    // Does not claim success. The seeded entities never change, so the label stays idle.
    expect(await screen.findByText("Add Full List")).toBeTruthy()
  })

  it("skips non-Artsy stops and still becomes actionable when the rest resolve", async () => {
    const saveable = [entity("a", false), entity("b", false)]
    const stops = [...stopsFor(saveable), nonArtsyStop("cafe")]

    renderButtonWithStops(env, stops, saveable)

    // A cafe stop is never expected by the provider, so it cannot block completeness: the
    // button becomes actionable even though one of the three stops never reports anything.
    fireEvent.press(await screen.findByText("Add Full List"))

    // Only the two saveable, unfollowed stops fire a mutation. The cafe, which was never
    // seeded and has no entity, contributes nothing.
    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(saveable.length))
  })

  it("tracks the bulk add once it finishes, with attempted and added counts", async () => {
    const entities = [entity("a", false), entity("b", false)]

    renderButton(env, entities)
    fireEvent.press(await screen.findByText("Add Full List"))

    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(2))

    act(() => {
      env.mock.getAllOperations().forEach((operation) => {
        env.mock.resolve(operation, {
          data: {
            followShow: { show: { id: "x", internalID: "x", isFollowed: true } },
          },
        })
      })
    })

    await waitFor(() =>
      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action_name: "tappedAddFullList",
          action_type: "success",
          owner_type: "CityGuide",
          owner_slug: "madrid",
          owner_id: "itinerary-1",
          additional_properties: { attempted: 2, added: 2 },
        })
      )
    )
  })
})
