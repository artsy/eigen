import Geolocation from "@react-native-community/geolocation"
import { getNearestCityGuideHref } from "app/Scenes/HomeView/Components/CityGuides/getNearestCityGuideHref"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

const mockRequestAuthorization = Geolocation.requestAuthorization as jest.Mock
const mockGetCurrentPosition = Geolocation.getCurrentPosition as jest.Mock

const LONDON = { lat: 51.51, lng: -0.13 }
const MANCHESTER = { lat: 53.4808, lng: -2.2426 } // ~260km from London
const MIDDLE_OF_THE_ATLANTIC = { lat: 30, lng: -40 }

const grantPermission = (isGranted: boolean) => {
  mockRequestAuthorization.mockImplementation((success, error) =>
    isGranted ? success() : error({ code: 1, message: "denied" })
  )
}

const setPosition = (location: { lat: number; lng: number } | null) => {
  mockGetCurrentPosition.mockImplementation((success, error) =>
    location
      ? success({ coords: { latitude: location.lat, longitude: location.lng } })
      : error({ code: 3, message: "Location request timed out" })
  )
}

/** Resolves the `cityGuideCities` query with London and New York */
const resolveCities = (environment: ReturnType<typeof createMockEnvironment>) => {
  environment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, {
      Query: () => ({
        cityGuideCities: [
          { slug: "london-united-kingdom", name: "London", coordinates: LONDON },
          { slug: "new-york-ny-usa", name: "New York", coordinates: { lat: 40.71, lng: -74.01 } },
        ],
      }),
    })
  )
}

/** Runs `getNearestCityGuideHref`, answering the cities query if it gets that far */
const run = async () => {
  const environment = createMockEnvironment()
  const result = getNearestCityGuideHref(environment)

  // Let the permission and position promises settle, then answer the query
  await new Promise(process.nextTick)
  if (environment.mock.getAllOperations().length > 0) {
    resolveCities(environment)
  }

  return { href: await result, environment }
}

describe("getNearestCityGuideHref", () => {
  beforeEach(() => {
    mockRequestAuthorization.mockReset()
    mockGetCurrentPosition.mockReset()
  })

  it("returns null, without looking up the position, when location access is denied", async () => {
    grantPermission(false)

    const { href } = await run()

    expect(href).toBeNull()
    expect(mockGetCurrentPosition).not.toHaveBeenCalled()
  })

  it("returns the nearest city's City Guide", async () => {
    grantPermission(true)
    setPosition(LONDON)

    const { href } = await run()

    expect(href).toBe("/city-guide?citySlug=london-united-kingdom")
  })

  it("finds a city up to 500km away", async () => {
    grantPermission(true)
    setPosition(MANCHESTER)

    const { href } = await run()

    expect(href).toBe("/city-guide?citySlug=london-united-kingdom")
  })

  it("falls back to the City Guide when no City Guide city is near", async () => {
    grantPermission(true)
    setPosition(MIDDLE_OF_THE_ATLANTIC)

    const { href } = await run()

    expect(href).toBe("/city-guide")
  })

  it("falls back to the City Guide when the position can't be found", async () => {
    grantPermission(true)
    setPosition(null)

    const { href } = await run()

    expect(href).toBe("/city-guide")
  })

  it("falls back to the City Guide when the cities can't be loaded", async () => {
    grantPermission(true)
    setPosition(LONDON)

    const environment = createMockEnvironment()
    const result = getNearestCityGuideHref(environment)

    await new Promise(process.nextTick)
    environment.mock.rejectMostRecentOperation(new Error("Network error"))

    expect(await result).toBe("/city-guide")
  })
})
