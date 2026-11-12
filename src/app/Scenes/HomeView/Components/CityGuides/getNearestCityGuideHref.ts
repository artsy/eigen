import Geolocation from "@react-native-community/geolocation"
import { useCityGuideCitiesQuery } from "__generated__/useCityGuideCitiesQuery.graphql"
import { CityData } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { cityGuideCitiesQuery } from "app/Scenes/CityGuide/hooks/useCityGuideCities"
import { cityNearLocation } from "app/Scenes/CityGuide/utils/cityNearLocation"
import { Location } from "app/utils/hooks/useLocation"
import { fetchQuery } from "react-relay"
import { IEnvironment } from "relay-runtime"

export const CITY_GUIDE_HREF = "/city-guide"

// Same as `useLocation`
const LOCATION_TIMEOUT = 3000
const LOCATION_MAX_AGE = 1000 * 60 * 10 // 10 minutes

/**
 * Resolves `true` once location access is granted. Prompts only when the user hasn't decided yet:
 * after a denial, iOS (and Android with "Don't ask again") resolve `false` without a prompt.
 */
const requestLocationPermission = () =>
  new Promise<boolean>((resolve) => {
    Geolocation.requestAuthorization(
      () => resolve(true),
      () => resolve(false)
    )
  })

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

/**
 * Where "Explore city near me" should go:
 * - `null` when location access isn't granted, so nothing happens
 * - the City Guide of the nearest city, preselected
 * - the City Guide as is (it picks a city itself) when there's no position, or no City Guide city
 *   near it
 */
export const getNearestCityGuideHref = async (
  environment: IEnvironment
): Promise<string | null> => {
  const isGranted = await requestLocationPermission()

  if (!isGranted) {
    return null
  }

  const [location, cities] = await Promise.all([
    getCurrentLocation(),
    fetchCityGuideCities(environment),
  ])

  const nearestCity = location ? cityNearLocation(cities, location) : null

  return nearestCity ? `${CITY_GUIDE_HREF}?citySlug=${nearestCity.slug}` : CITY_GUIDE_HREF
}
