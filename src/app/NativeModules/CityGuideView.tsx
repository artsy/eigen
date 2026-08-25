import { Flex, Spinner } from "@artsy/palette-mobile"
import { CityGuideMapQueryRenderer } from "app/Scenes/CityGuide/Components/CityGuideMapQueryRenderer"
import { cityNearLocation } from "app/Scenes/CityGuide/utils/cityNearLocation"
import { GlobalStore } from "app/store/GlobalStore"
import { useLocation } from "app/utils/hooks/useLocation"
import { useEffect } from "react"
import cities from "../../../data/cityDataSortedByDisplayPreference.json"

export const CityGuideView: React.FC = () => {
  const previouslySelectedCitySlug = GlobalStore.useAppState(
    (state) => state.userPrefs.previouslySelectedCitySlug
  )
  const { setPreviouslySelectedCitySlug } = GlobalStore.actions.userPrefs

  const { location, isLoading } = useLocation()

  useEffect(() => {
    if (location && cityNearLocation(cities, location)) {
      setPreviouslySelectedCitySlug(cityNearLocation(cities, location)?.slug ?? "")
    }
  }, [location])

  if (isLoading && !previouslySelectedCitySlug) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    )
  }

  return <CityGuideMapQueryRenderer citySlug={previouslySelectedCitySlug ?? "new-york-ny-usa"} />
}
