import Geolocation from "@react-native-community/geolocation"
import { useCityGuideCitiesQuery } from "__generated__/useCityGuideCitiesQuery.graphql"
import { CityData } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { cityGuideCitiesQuery } from "app/Scenes/CityGuide/hooks/useCityGuideCities"
import { cityNearLocation } from "app/Scenes/CityGuide/utils/cityNearLocation"
import { Location } from "app/utils/hooks/useLocation"
import { AppState, Platform } from "react-native"
import { PERMISSIONS, RESULTS, request } from "react-native-permissions"
import { fetchQuery } from "react-relay"
import { IEnvironment } from "relay-runtime"

export const CITY_GUIDE_HREF = "/city-guide"

// Same as `useLocation`
const LOCATION_TIMEOUT = 3000
const LOCATION_MAX_AGE = 1000 * 60 * 10 // 10 minutes

// Permissions are requested explicitly below; never let a position lookup prompt on its own.
// `useLocation` sets the same, but only once its module has loaded.
Geolocation.setRNConfiguration({ skipPermissionRequests: true })

/**
 * - "granted"
 * - "denied": the user declined the prompt just now, so nothing should happen
 * - "blocked": no prompt could be shown anymore, so only Settings can grant access
 */
type PermissionResult = "granted" | "denied" | "blocked"

/**
 * Android reports "blocked" both when the user denies for the second time in the dialog and when no
 * dialog could be shown at all. Only the second case is "blocked" for us, so we look at the state
 * before the request too: react-native-permissions calls the rationale function only when the user
 * denied before but can still be asked.
 *
 * Approximate (coarse) location is enough to pick a city, and on Android 12+ asking for fine
 * location alone is ignored.
 */
const requestAndroidLocationPermission = async (): Promise<PermissionResult> => {
  let couldAskAgain = false

  const status = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, async () => {
    couldAskAgain = true
    return true
  })

  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) return "granted"
  if (status === RESULTS.BLOCKED && !couldAskAgain) return "blocked"

  return "denied"
}

/**
 * iOS shows the location prompt once; afterwards the request fails right away, with no system UI.
 * Geolocation reports both failures the same way, so the prompt is detected instead: while it's on
 * screen the app is `inactive`.
 */
const requestIOSLocationPermission = () =>
  new Promise<PermissionResult>((resolve) => {
    let wasPromptShown = false

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "inactive") wasPromptShown = true
    })

    const settle = (result: PermissionResult) => {
      subscription.remove()
      resolve(result)
    }

    Geolocation.requestAuthorization(
      () => settle("granted"),
      () => settle(wasPromptShown ? "denied" : "blocked")
    )
  })

const requestLocationPermission = (): Promise<PermissionResult> =>
  Platform.OS === "android" ? requestAndroidLocationPermission() : requestIOSLocationPermission()

/** `null` when the device can't provide a position in time */
const getCurrentLocation = () =>
  new Promise<Location | null>((resolve) => {
    Geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      () => resolve(null),
      { timeout: LOCATION_TIMEOUT, maximumAge: LOCATION_MAX_AGE }
    )
  })

/** The City Guide cities, from the store when the City Guide has been opened before */
const fetchCityGuideCities = async (environment: IEnvironment): Promise<CityData[]> => {
  try {
    const data = await fetchQuery<useCityGuideCitiesQuery>(
      environment,
      cityGuideCitiesQuery,
      {},
      { fetchPolicy: "store-or-network" }
    ).toPromise()

    return (data?.cityGuideCities ?? []).flatMap(({ slug, name, coordinates }) =>
      coordinates?.lat != null && coordinates.lng != null
        ? [{ slug, name, coordinates: { lat: coordinates.lat, lng: coordinates.lng } }]
        : []
    )
  } catch {
    return []
  }
}

export type NearestCityGuideResult =
  /**
   * The City Guide of the nearest city, preselected. Or the City Guide as is (it picks a city
   * itself) when there's no position, or no City Guide city near it.
   */
  | { status: "granted"; href: string }
  /** The user declined the location prompt just now: nothing should happen */
  | { status: "denied" }
  /** Location access was denied before and can't be asked for again: point to Settings */
  | { status: "blocked" }

/** Where "Explore city near me" should go, asking for location access if needed */
export const findNearestCityGuide = async (
  environment: IEnvironment
): Promise<NearestCityGuideResult> => {
  const permission = await requestLocationPermission()

  if (permission !== "granted") {
    return { status: permission }
  }

  const [location, cities] = await Promise.all([
    getCurrentLocation(),
    fetchCityGuideCities(environment),
  ])

  const nearestCity = location ? cityNearLocation(cities, location) : null

  return {
    status: "granted",
    href: nearestCity ? `${CITY_GUIDE_HREF}?citySlug=${nearestCity.slug}` : CITY_GUIDE_HREF,
  }
}
