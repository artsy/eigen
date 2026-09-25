import { CityData } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { cityNearLocation } from "app/Scenes/CityGuide/utils/cityNearLocation"
import { GlobalStore } from "app/store/GlobalStore"
import { useLocation } from "app/utils/hooks/useLocation"

export const useInitialLocation = (cities: CityData[], preselectedCitySlug?: string) => {
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

  if (
    previouslySelectedCitySlug &&
    cities.some((city) => city.slug === previouslySelectedCitySlug)
  ) {
    initialCitySlug = previouslySelectedCitySlug
  }

  return initialCitySlug
}
