import { Flex } from "@artsy/palette-mobile"
import { CityGuide } from "app/Scenes/Map/CityGuide"
import { MapContainer } from "app/Scenes/Map/MapContainer"
import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { requireNativeComponent } from "react-native"

const ARTCityGuideView = !unsafe_getFeatureFlag("AREnableCrossPlatformCityGuide")
  ? requireNativeComponent("ARTCityGuideView")
  : Flex

export const CityGuideView: React.FC = () => {
  const enableCrossPlatformCityGuide = useFeatureFlag("AREnableCrossPlatformCityGuide")

  if (enableCrossPlatformCityGuide) {
    return (
      <MapContainer
        citySlug="new-york-ny-usa"
        hideMapButtons={false}
        safeAreaInsets={{ top: 0, right: 0, bottom: 0, left: 0 }}
        initialCoordinates={NEW_YORK_COORDINATES}
        userLocationWithinCity={true}
      />
    )
  }

  return (
    <ARTCityGuideView // @ts-ignore
      style={{ flex: 1 }}
    />
  )
}

const NEW_YORK_COORDINATES = { lat: 40.713, lng: -74.006 }
