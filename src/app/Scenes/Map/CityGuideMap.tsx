import { Flex, useTheme } from "@artsy/palette-mobile"
import MapboxGL from "@react-native-mapbox-gl/maps"
import { CityGuideMapQuery } from "__generated__/CityGuideMapQuery.graphql"
import { ArtsyMapStyleURL } from "app/Scenes/Map/GlobalMap"
import { isEqual } from "lodash"
import React, { useEffect, useRef, useState } from "react"
import { Dimensions } from "react-native"
import Config from "react-native-config"
import { graphql, useLazyLoadQuery } from "react-relay"

MapboxGL.setAccessToken(Config.MAPBOX_API_CLIENT_KEY)

type Coordinate = { lat: number; lng: number }

interface CityGuideMapProps {
  citySlug: string
}

export const CityGuideMap: React.FC<CityGuideMapProps> = ({ citySlug }) => {
  const data = useLazyLoadQuery<CityGuideMapQuery>(cityGuideMapQuery, {
    citySlug,
  })

  const mapRef = useRef<MapboxGL.MapView>(null)
  const cameraRef = useRef<MapboxGL.Camera>(null)

  const [centerOfMap, setCenterOfMap] = useState<Coordinate>(NEW_YORK_COORDINATES)

  useEffect(() => {
    if (!data?.city) {
      return
    }

    /** Update the center coordinate of the map if it has changed */
    if (
      !isEqual(data.city.coordinates, centerOfMap) &&
      data.city.coordinates?.lat &&
      data.city.coordinates?.lng
    ) {
      setCenterOfMap({ lat: data.city.coordinates?.lat, lng: data.city.coordinates?.lng })
    }
  }, [data])

  const { color } = useTheme()

  /** TODO: Reintroduce pins for shows (upcoming saved, and current) */
  /** TODO: Reintroduce pins for fairs */
  /** TODO: Reintroduce the user location */
  /** TODO: Reintroduce displaying the show/fair card when a pin is tapped */
  /** TODO: Reintroduce changing the pin when a show/fair is tapped */
  /** TODO: Reintroduce zooming into a cluster when tapped */
  /** TODO: Reintroduce tapping on the user position */
  /** TODO: Reintroduce the tracking events */
  /** TODO: Reintroduce the bucketed filters */
  /** TODO: Reintroduce dispatching a "map:error" when a Relay error occurs */
  /** TODO: Reintroduce switching cities */
  /** TODO: Reintroduce zooming in and out */
  /** TODO: Show a skeleton loader while the map is loading */

  return (
    <Flex mb={0.5} flexDirection="column" style={{ backgroundColor: color("black5") }}>
      <Flex flex={1}>
        <MapboxGL.MapView
          ref={mapRef}
          style={{ width: "100%", height: Dimensions.get("window").height }}
          styleURL={ArtsyMapStyleURL}
          userTrackingMode={MapboxGL.UserTrackingModes.Follow}
          logoEnabled={!!data.city}
          attributionEnabled={false}
          compassEnabled={false}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            animationMode="flyTo"
            zoomLevel={DEFAULT_ZOOM_LEVEL}
            minZoomLevel={MIN_ZOOM_LEVEL}
            maxZoomLevel={MAX_ZOOM_LEVEL}
            centerCoordinate={[centerOfMap.lng, centerOfMap.lat]}
          />
        </MapboxGL.MapView>
      </Flex>
    </Flex>
  )
}

const cityGuideMapQuery = graphql`
  query CityGuideMapQuery($citySlug: String!) {
    city(slug: $citySlug) {
      coordinates {
        lat
        lng
      }
    }
  }
`

const NEW_YORK_COORDINATES = { lat: 40.713, lng: -74.006 }
const DEFAULT_ZOOM_LEVEL = 11
const MIN_ZOOM_LEVEL = 9
const MAX_ZOOM_LEVEL = 17.5
