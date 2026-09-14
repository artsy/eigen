import { act, screen, waitFor } from "@testing-library/react-native"
import { ItineraryStopEntityResolvers } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopEntityResolvers"
import { ItineraryUnaddableStopsDevList } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryUnaddableStopsDevList"
import { ItineraryStopEntitiesProvider } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { getMockItinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.mock("app/utils/hooks/useDevToggle", () => ({
  useDevToggle: jest.fn(),
}))

const itinerary = getMockItinerary("london-united-kingdom", "chill-vibes-only")!
const stops = itinerary.sections.flatMap((section) => section.stops)
// stop-1, "Coffee at London Cafe", has `saveTarget: null` in the fixture.
const nonEntityStop = stops.find((stop) => stop.id === "stop-1")!
const saveableStops = stops.filter((stop) => !!stop.saveTarget)

const renderHarness = (env: ReturnType<typeof createMockEnvironment>, given = stops) =>
  renderWithWrappers(
    <RelayEnvironmentProvider environment={env}>
      <ItineraryStopEntitiesProvider stops={given}>
        <ItineraryStopEntityResolvers stops={given} />
        <ItineraryUnaddableStopsDevList stops={given} />
      </ItineraryStopEntitiesProvider>
    </RelayEnvironmentProvider>
  )

const queueResolvers = (env: ReturnType<typeof createMockEnvironment>, count: number) => {
  for (let i = 0; i < count; i++) {
    env.mock.queueOperationResolver((operation) => MockPayloadGenerator.generate(operation))
  }
}

describe("ItineraryUnaddableStopsDevList", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("renders nothing when the dev toggle is off", () => {
    ;(useDevToggle as jest.Mock).mockReturnValue(false)

    renderHarness(env, [nonEntityStop])

    expect(screen.queryByTestId("itinerary-unaddable-stops-dev-list")).toBeNull()
  })

  it("lists a stop with no saveTarget as not an Artsy entity", () => {
    ;(useDevToggle as jest.Mock).mockReturnValue(true)

    renderHarness(env, [nonEntityStop])

    expect(screen.getByTestId("itinerary-unaddable-stops-dev-list")).toBeTruthy()
    expect(screen.getByText(`${nonEntityStop.title} — not an Artsy entity`)).toBeTruthy()
  })

  it("lists a stop whose lookup failed", async () => {
    ;(useDevToggle as jest.Mock).mockReturnValue(true)
    queueResolvers(env, saveableStops.length - 1)

    renderHarness(env)

    await waitFor(() => expect(env.mock.getAllOperations().length).toEqual(1))
    act(() => {
      env.mock.reject(env.mock.getAllOperations()[0], new Error("boom"))
    })

    await screen.findByText(/lookup failed/)
  })

  it("shows nothing to fix when every stop is addable or already resolved", async () => {
    ;(useDevToggle as jest.Mock).mockReturnValue(true)
    queueResolvers(env, saveableStops.length)

    renderHarness(env, saveableStops)

    await screen.findByText("DEV: All stops can be added")
  })
})
