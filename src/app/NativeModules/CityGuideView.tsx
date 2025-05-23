import { Flex, Spinner } from "@artsy/palette-mobile"
import { MapContainer } from "app/Scenes/Map/MapContainer"
import { cityNearLocation } from "app/Scenes/Map/helpers/cityNearLocation"
import { GlobalStore } from "app/store/GlobalStore"
import { useLocation } from "app/utils/hooks/useLocation"
import { useEffect } from "react"
import cities from "../../../data/cityDataSortedByDisplayPreference.json"

export const CityGuideView: React.FC = () => {
  const previouslySelectedCitySlug = GlobalStore.useAppState(
    (state) => state.userPrefs.previouslySelectedCitySlug
  )

  const { location, isLoading } = useLocation()

  useEffect(() => {
    if (location && cityNearLocation(cities, location)) {
      GlobalStore.actions.userPrefs.setPreviouslySelectedCitySlug(
        cityNearLocation(cities, location)?.slug ?? ""
      )
    }
  }, [location])

  if (isLoading && !previouslySelectedCitySlug) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    )
  }

  return (
    <MapContainer
      citySlug={previouslySelectedCitySlug ?? "new-york-ny-usa"}
      hideMapButtons={false}
      safeAreaInsets={{ top: 0, right: 0, bottom: 0, left: 0 }}
      initialCoordinates={location ?? undefined}
      userLocationWithinCity={true}
    />
  )
}
