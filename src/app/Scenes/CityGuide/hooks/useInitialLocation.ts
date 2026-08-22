import { cityNearLocation } from "app/Scenes/Map/helpers/cityNearLocation"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useLocation } from "app/utils/hooks/useLocation"
import expandedCities from "../../../../../data/cityDataSortedByDisplayPreference-expanded.json"
import originalCities from "../../../../../data/cityDataSortedByDisplayPreference.json"

export const useInitialLocation = (preselectedCitySlug?: string) => {
  const enabledExpandedList = useFeatureFlag("AREnableExpandedCityGuide")
  const cities = enabledExpandedList ? expandedCities : originalCities

  const previouslySelectedCitySlug = GlobalStore.useAppState(
    (state) => state.userPrefs.previouslySelectedCitySlug
  )

  const { location } = useLocation()

  if (preselectedCitySlug && cities.some((city) => city.slug === preselectedCitySlug)) {
    return preselectedCitySlug
  }

  let initialCitySlug = "new-york-ny-usa"

  if (location) {
    const nearest = cityNearLocation(cities, location)
    if (nearest) {
      initialCitySlug = nearest.slug
    }
  }

  if (previouslySelectedCitySlug) {
    initialCitySlug = previouslySelectedCitySlug
  }

  return initialCitySlug
}
