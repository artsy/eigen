import MapboxGL from "@react-native-mapbox-gl/maps"
import algoliasearch from "algoliasearch"
import { Box, Flex } from "palette"
import { FC, useEffect, useRef, useState } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import Config from "react-native-config"
import styled from "styled-components/native"
import cityData from "../../../../data/cityDataSortedByDisplayPreference.json"
import { UserPositionButton } from "./Components/UserPositionButton"
import { ArtsyMapStyleURL } from "./GlobalMap"

MapboxGL.setAccessToken(Config.MAPBOX_API_CLIENT_KEY)

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Dimensions.get("window").height,
  },
  map: {
    flex: 1,
  },
})

const TopButtonsContainer = styled(Box)`
  position: absolute;
  left: -25;
  right: 0;
  z-index: 1;
  width: 100%;
  height: 100;
  bottom: 10;
`

const DEFAULT_ZOOM_LEVEL = 11
const MINIMUM__METERS_BEFORE_UPDATING_POSITION = 300
const MIN_ZOOM_LVL = 9
const MAX_ZOOM_LVL = 25

const BERLIN_DATA = cityData.find((city) => city.name === "Berlin")
const BERLIN_COORDS = [BERLIN_DATA!.coordinates.lng, BERLIN_DATA!.coordinates.lat]

interface GalleryHit {
  partner: {
    name: string
    href: string
  }
  _geoloc: {
    lat: number
    lng: number
  }
}

const { ALGOLIA_API_KEY, ALGOLIA_APP_ID } = process.env
const client = algoliasearch(ALGOLIA_APP_ID!, ALGOLIA_API_KEY!)
const galleryIndex = client.initIndex("PartnerLocation_staging")

export const NewMapScreen: FC = () => {
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const mapRef = useRef<MapboxGL.MapView>(null)
  const [userLocation, setUserLocation] = useState<GeoJSON.Position>()
  const [showUserLocation, setShowUserLocation] = useState(false)
  const [visibleBounds, setVisibleBounds] = useState<GeoJSON.Position[] | null>(null)
  // fly user to their location in the map
  const onPressUserPositionButton = () => {
    setShowUserLocation(true)
    cameraRef.current?.setCamera({
      centerCoordinate: userLocation,
      zoomLevel: DEFAULT_ZOOM_LEVEL,
      animationDuration: 500,
    })
  }
  console.warn({ galleryIndex })

  useEffect(() => {
    console.warn({ visibleBounds })
  }, [visibleBounds])

  const convertBoundsToAlgoliaBounds = (
    bounds: GeoJSON.Position[]
  ): [number, number, number, number] => {
    const [[north, east] = [], [south, west] = []] = bounds
    return [north, east, south, west]
  }

  const fetchGalleryLocations = async (bounds?: GeoJSON.Position[]) => {
    if (!bounds) {
      return null
    }

    const options = {
      insideBoundingBox: [convertBoundsToAlgoliaBounds(bounds)],
      aroundLatLngViaIP: true,
    }
    try {
      const results = await galleryIndex.search<GalleryHit>("", options)
      console.warn(results.hits)
      return results.hits
    } catch (error) {
      console.warn(error)
    }
  }

  const onUpdateUserLocation = (location: MapboxGL.Location) => {
    setUserLocation([location.coords.longitude, location.coords.latitude])
  }

  return (
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white100">
      <View style={styles.container}>
        <MapboxGL.MapView
          ref={mapRef}
          onRegionDidChange={async () => {
            const newBounds = await mapRef.current?.getVisibleBounds()
            // @ts-expect-error pffffffff
            setVisibleBounds(newBounds)
          }}
          styleURL={ArtsyMapStyleURL}
          style={styles.map}
          compassEnabled={false}
        >
          <TopButtonsContainer>
            <UserPositionButton onPress={onPressUserPositionButton} />
          </TopButtonsContainer>
          <MapboxGL.UserLocation
            // dynamically pass this onUpdate when user presses the CrossHair Icon
            // to avoid starting the location manager before that
            {...(!!showUserLocation && { onUpdate: onUpdateUserLocation })}
            visible={showUserLocation}
            androidRenderMode="normal"
            minDisplacement={MINIMUM__METERS_BEFORE_UPDATING_POSITION}
          />
          <MapboxGL.Camera
            ref={cameraRef}
            animationMode="flyTo"
            centerCoordinate={BERLIN_COORDS}
            zoomLevel={DEFAULT_ZOOM_LEVEL}
            minZoomLevel={MIN_ZOOM_LVL}
            maxZoomLevel={MAX_ZOOM_LVL}
          />
          <MapboxGL.MarkerView id="1" coordinate={BERLIN_COORDS} />
        </MapboxGL.MapView>
      </View>
    </Flex>
  )
}
