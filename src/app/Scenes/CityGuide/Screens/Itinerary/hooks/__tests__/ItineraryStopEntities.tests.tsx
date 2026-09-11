import { Text } from "@artsy/palette-mobile"
import { act, screen, waitFor } from "@testing-library/react-native"
import { ItineraryStopEntityResolvers } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopEntityResolvers"
import {
  ItineraryStopEntitiesProvider,
  useItineraryStopEntitiesState,
} from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { getMockItinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

const itinerary = getMockItinerary("london-united-kingdom", "chill-vibes-only")!
const stops = itinerary.sections.flatMap((section) => section.stops)
const saveableStops = stops.filter((stop) => !!stop.saveTarget)

const Readout: React.FC = () => {
  const { entities, expectedCount, failedCount, isSettled, isComplete } =
    useItineraryStopEntitiesState()

  return (
    <Text>
      {`resolved ${entities.length} of ${expectedCount}, failed ${failedCount}, settled ${isSettled}, complete ${isComplete}`}
    </Text>
  )
}

const renderHarness = (
  env: ReturnType<typeof createMockEnvironment>,
  given: typeof stops = stops
) =>
  renderWithWrappers(
    <RelayEnvironmentProvider environment={env}>
      <ItineraryStopEntitiesProvider stops={given}>
        <ItineraryStopEntityResolvers stops={given} />
        <Readout />
      </ItineraryStopEntitiesProvider>
    </RelayEnvironmentProvider>
  )

/** One fresh function per operation, because Relay removes a consumed resolver by reference. */
const queueResolvers = (env: ReturnType<typeof createMockEnvironment>, count: number) => {
  for (let i = 0; i < count; i++) {
    env.mock.queueOperationResolver((operation) => MockPayloadGenerator.generate(operation))
  }
}

/**
 * These drive a mock environment directly rather than using `setupTestWrapper`, whose
 * `renderWithRelay` resolves exactly one operation unconditionally at render
 * (`setupTestWrapper.tsx:112-129`). This tree fires one query per saveable stop, or none.
 */
describe("ItineraryStopEntities", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("seeds the expected count from the saveable stops before anything resolves", () => {
    renderHarness(env)

    expect(
      screen.getByText(
        `resolved 0 of ${saveableStops.length}, failed 0, settled false, complete false`
      )
    ).toBeTruthy()
  })

  it("is not complete while some lookups are still pending", async () => {
    // Exactly one resolver, so exactly one operation is answered.
    queueResolvers(env, 1)

    renderHarness(env)

    await screen.findByText(/^resolved 1 of/)
    // The bug this guards: one resolved entity used to be enough to enable bulk-add.
    expect(screen.getByText(/complete false/)).toBeTruthy()
    expect(screen.getByText(/settled false/)).toBeTruthy()
  })

  it("is complete only once every saveable stop has resolved", async () => {
    queueResolvers(env, saveableStops.length)

    renderHarness(env)

    // Counts derived from the mock, so growing the itinerary cannot produce a false alarm.
    await screen.findByText(
      `resolved ${saveableStops.length} of ${saveableStops.length}, failed 0, settled true, complete true`
    )
  })

  it("settles but never completes when a lookup fails", async () => {
    queueResolvers(env, saveableStops.length - 1)

    renderHarness(env)

    await waitFor(() => expect(env.mock.getAllOperations().length).toEqual(1))
    act(() => {
      env.mock.reject(env.mock.getAllOperations()[0], new Error("boom"))
    })

    await screen.findByText(/failed 1/)
    // Settled, so the screen stops waiting; not complete, so bulk-add stays unavailable and
    // cannot present a partial list as the full one.
    expect(screen.getByText(/settled true/)).toBeTruthy()
    expect(screen.getByText(/complete false/)).toBeTruthy()
  })

  it("fires no query and reports nothing to resolve when no stop is saveable", () => {
    const nonSaveable = stops.filter((stop) => !stop.saveTarget)

    renderHarness(env, nonSaveable)

    expect(env.mock.getAllOperations()).toHaveLength(0)
    expect(screen.getByText(/resolved 0 of 0/)).toBeTruthy()
  })
})
