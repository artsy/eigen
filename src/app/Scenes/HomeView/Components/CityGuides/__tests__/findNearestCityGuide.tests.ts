import Geolocation from "@react-native-community/geolocation"
import { findNearestCityGuide } from "app/Scenes/HomeView/Components/CityGuides/findNearestCityGuide"
import { AppState, AppStateEvent, Platform } from "react-native"
import { request } from "react-native-permissions"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.mock("react-native-permissions", () => ({
  PERMISSIONS: { ANDROID: { ACCESS_COARSE_LOCATION: "android.permission.ACCESS_COARSE_LOCATION" } },
  RESULTS: { GRANTED: "granted", LIMITED: "limited", DENIED: "denied", BLOCKED: "blocked" },
  request: jest.fn(),
}))

const mockRequestAuthorization = Geolocation.requestAuthorization as jest.Mock
const mockGetCurrentPosition = Geolocation.getCurrentPosition as jest.Mock
const mockRequest = request as jest.Mock

const LONDON = { lat: 51.51, lng: -0.13 }
const MANCHESTER = { lat: 53.4808, lng: -2.2426 } // ~260km from London
const MIDDLE_OF_THE_ATLANTIC = { lat: 30, lng: -40 }

let appStateListeners: Partial<Record<AppStateEvent, Array<(state?: string) => void>>> = {}

/** iOS: what the system does when location access is requested */
const setPermissionRequest = (
  outcome: "grantedWithoutPrompt" | "grantedFromPrompt" | "deniedFromPrompt" | "blocked"
) => {
  mockRequestAuthorization.mockImplementation((success, error) => {
    if (outcome === "grantedFromPrompt" || outcome === "deniedFromPrompt") {
      // The system prompt takes focus away from the app
      appStateListeners.change?.forEach((listener) => listener("inactive"))
    }

    if (outcome === "grantedWithoutPrompt" || outcome === "grantedFromPrompt") {
      success()
    } else {
      error({ code: 1, message: "denied" })
    }
  })
}

/**
 * Android, through react-native-permissions: its rationale function only runs when the user denied
 * before but can still be asked
 */
const setAndroidPermissionRequest = ({
  deniedBefore,
  status,
}: {
  deniedBefore: boolean
  status: "granted" | "denied" | "blocked"
}) => {
  mockRequest.mockImplementation(async (_permission, rationale?: () => Promise<boolean>) => {
    if (deniedBefore && rationale) {
      await rationale()
    }
    return status
  })
}

const grantPermission = (isGranted: boolean) =>
  setPermissionRequest(isGranted ? "grantedWithoutPrompt" : "deniedFromPrompt")

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

/** Runs `findNearestCityGuide`, answering the cities query if it gets that far */
const run = async () => {
  const environment = createMockEnvironment()
  const result = findNearestCityGuide(environment)

  // Let the permission and position promises settle, then answer the query
  await new Promise(process.nextTick)
  if (environment.mock.getAllOperations().length > 0) {
    resolveCities(environment)
  }

  const outcome = await result

  return { outcome, href: outcome.status === "granted" ? outcome.href : null, environment }
}

describe("findNearestCityGuide", () => {
  beforeEach(() => {
    mockRequestAuthorization.mockReset()
    mockGetCurrentPosition.mockReset()
    mockRequest.mockReset()

    appStateListeners = {}
    jest.spyOn(AppState, "addEventListener").mockImplementation((type, listener) => {
      appStateListeners[type] = [...(appStateListeners[type] ?? []), listener as () => void]
      return { remove: jest.fn() }
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("on iOS", () => {
    it("is denied, without looking up the position, when the user declines the prompt", async () => {
      setPermissionRequest("deniedFromPrompt")

      const { outcome } = await run()

      expect(outcome).toEqual({ status: "denied" })
      expect(mockGetCurrentPosition).not.toHaveBeenCalled()
    })

    it("is blocked when no prompt could be shown", async () => {
      setPermissionRequest("blocked")

      const { outcome } = await run()

      expect(outcome).toEqual({ status: "blocked" })
      expect(mockGetCurrentPosition).not.toHaveBeenCalled()
    })

    it("stops listening to the app state once settled", async () => {
      const remove = jest.fn()
      jest.spyOn(AppState, "addEventListener").mockReturnValue({ remove })
      setPermissionRequest("blocked")

      await run()

      expect(remove).toHaveBeenCalledTimes(1)
    })
  })

  describe("on Android", () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, "OS", "android")
    })

    it("asks for approximate location only", async () => {
      setAndroidPermissionRequest({ deniedBefore: false, status: "granted" })
      setPosition(LONDON)

      const { outcome } = await run()

      expect(mockRequest).toHaveBeenCalledWith(
        "android.permission.ACCESS_COARSE_LOCATION",
        expect.any(Function)
      )
      expect(mockRequestAuthorization).not.toHaveBeenCalled()
      expect(outcome).toEqual({
        status: "granted",
        href: "/city-guide?citySlug=london-united-kingdom",
      })
    })

    it("is denied when the user declines the dialog for the first time", async () => {
      setAndroidPermissionRequest({ deniedBefore: false, status: "denied" })

      const { outcome } = await run()

      expect(outcome).toEqual({ status: "denied" })
    })

    it("is denied when the user declines the dialog again, even though Android reports it as blocked", async () => {
      setAndroidPermissionRequest({ deniedBefore: true, status: "blocked" })

      const { outcome } = await run()

      expect(outcome).toEqual({ status: "denied" })
    })

    it("is blocked when Android can't show the dialog anymore", async () => {
      setAndroidPermissionRequest({ deniedBefore: false, status: "blocked" })

      const { outcome } = await run()

      expect(outcome).toEqual({ status: "blocked" })
      expect(mockGetCurrentPosition).not.toHaveBeenCalled()
    })
  })

  it("finds the nearest city after the user accepts the prompt", async () => {
    setPermissionRequest("grantedFromPrompt")
    setPosition(LONDON)

    const { outcome } = await run()

    expect(outcome).toEqual({
      status: "granted",
      href: "/city-guide?citySlug=london-united-kingdom",
    })
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
    const result = findNearestCityGuide(environment)

    await new Promise(process.nextTick)
    environment.mock.rejectMostRecentOperation(new Error("Network error"))

    expect(await result).toEqual({ status: "granted", href: "/city-guide" })
  })
})
