import MapboxGL from "@react-native-mapbox-gl/maps"
import { themeGet } from "@styled-system/theme-get"
import { Box } from "palette"
import React, { useRef, useState } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import Config from "react-native-config"
import styled from "styled-components"
import { UserPositionButton } from "./Components/UserPositionButton"
import { ArtsyMapStyleURL } from "./GlobalMap"

MapboxGL.setAccessToken(Config.MAPBOX_API_CLIENT_KEY)

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${themeGet("colors.white100")}`,
  },
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
const MAX_ZOOM_LVL = 50

// this is the center of Berlin for now until we decide otherwise
const INITIAL_LOCATION = [13.413141, 52.523509]

export const NewMapScreen = () => {
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const [userLocation, setUserLocation] = useState<GeoJSON.Position>()
  const [showUserLocation, setShowUserLocation] = useState(false)

  // fly user to their location in the map
  const onPressUserPositionButton = () => {
    setShowUserLocation(true)
    cameraRef.current?.setCamera({
      centerCoordinate: userLocation,
      zoomLevel: DEFAULT_ZOOM_LEVEL,
      animationDuration: 500,
    })
  }

  const onUpdateUserLocation = (location: MapboxGL.Location) => {
    setUserLocation([location.coords.longitude, location.coords.latitude])
  }

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView styleURL={ArtsyMapStyleURL} style={styles.map} compassEnabled={false}>
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
            centerCoordinate={INITIAL_LOCATION}
            zoomLevel={DEFAULT_ZOOM_LEVEL}
            minZoomLevel={MIN_ZOOM_LVL}
            maxZoomLevel={MAX_ZOOM_LVL}
          />
        </MapboxGL.MapView>
      </View>
    </View>
  )
}
