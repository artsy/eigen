import MapboxGL from "@react-native-mapbox-gl/maps"
import { NewMap_system } from "__generated__/NewMap_system.graphql"
import { NewMapQuery } from "__generated__/NewMapQuery.graphql"
import algoliasearch from "algoliasearch"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Box, Button, Flex, Spinner, Text } from "palette"
import React, { FC, useEffect, useRef, useState } from "react"
import { Dimensions, ScrollView, StyleSheet, View } from "react-native"
import Config from "react-native-config"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import styled from "styled-components/native"
import cityData from "../../../../data/cityDataSortedByDisplayPreference.json"
import { UserPositionButton } from "./Components/UserPositionButton"
import { ArtsyMapStyleURL } from "./GlobalMap"

MapboxGL.setAccessToken(Config.MAPBOX_API_CLIENT_KEY)

const mapContainerStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: Dimensions.get("window").height - 220,
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
  id: string
  partner: {
    name: string
    href: string
  }
  _geoloc: {
    lat: number
    lng: number
  }
}

export const NewMapScreen: FC<{ system: NewMap_system }> = ({ system: { algolia } }) => {
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const mapRef = useRef<MapboxGL.MapView>(null)
  const [userLocation, setUserLocation] = useState<GeoJSON.Position>()
  const [showUserLocation, setShowUserLocation] = useState(false)
  const [visibleBounds, setVisibleBounds] = useState<GeoJSON.Position[] | undefined>()
  const [locations, setLocations] = useState<GalleryHit[] | undefined>()
  const [showReloadButton, setShowReloadButton] = useState<boolean>(false)
  const didInitialFetch = useRef(false)

  const client = algoliasearch(algolia?.appID!, algolia?.apiKey!)
  const galleryIndex = client.initIndex("PartnerLocation_staging")

  // fly user to their location in the map
  const onPressUserPositionButton = () => {
    setShowUserLocation(true)
    cameraRef.current?.setCamera({
      centerCoordinate: userLocation,
      zoomLevel: DEFAULT_ZOOM_LEVEL,
      animationDuration: 500,
    })
  }
  // console.warn({ galleryIndex })

  // fetch galleries once on load (hopefully visibleBounds are defined?)
  useEffect(() => {
    if (!!visibleBounds) {
      if (!didInitialFetch.current) {
        didInitialFetch.current = true
        fetchGalleryLocations()
      } else {
        setShowReloadButton(true)
      }
    }
  }, [visibleBounds])

  const algoliaBounds = (bounds: GeoJSON.Position[]): [number, number, number, number] => {
    const [[east, north] = [], [west, south] = []] = bounds
    console.log([north, east, south, west])
    return [north, east, south, west]
  }

  const fetchGalleryLocations = async () => {
    if (!visibleBounds) {
      return null
    }
    const options = {
      insideBoundingBox: [algoliaBounds(visibleBounds)],
      aroundLatLngViaIP: true,
    }
    try {
      const results = await galleryIndex.search<GalleryHit>("", options)
      // console.log(JSON.stringify(results.hits, null, 2))
      // console.warn("Hits: " + results.hits.length)
      setLocations(results.hits ?? undefined)
      return results.hits
    } catch (error) {
      console.warn(error)
    }
  }

  const onUpdateUserLocation = (location: MapboxGL.Location) => {
    setUserLocation([location.coords.longitude, location.coords.latitude])
  }

  const onPressReloadButton = () => {
    setShowReloadButton(false)
    fetchGalleryLocations()
  }

  return (
    <ScrollView>
      <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white100">
        <View style={mapContainerStyles.container}>
          <MapboxGL.MapView
            ref={mapRef}
            onRegionDidChange={async () => {
              // TODO: I think this fires several times on the initial flyTo render
              const newBounds = await mapRef.current?.getVisibleBounds()
              setVisibleBounds(newBounds)
            }}
            styleURL={ArtsyMapStyleURL}
            style={mapContainerStyles.map}
            compassEnabled={false}
          >
            <TopButtonsContainer>
              <UserPositionButton onPress={onPressUserPositionButton} />
              {!!showReloadButton && (
                <Button ml={30} onPress={onPressReloadButton}>
                  Reload{" "}
                </Button>
              )}
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
            {!!locations &&
              locations.map((location) => {
                const {
                  id,
                  partner: { href, name },
                  _geoloc: { lng, lat },
                } = location
                return (
                  <MapboxGL.MarkerView
                    onSelected={() => navigate(href)}
                    key={id}
                    id={name}
                    coordinate={[lng, lat]}
                  />
                )
              })}
          </MapboxGL.MapView>
        </View>
        <View>
          <Box backgroundColor="gray60">
            {!!locations &&
              locations.map((location) => {
                const {
                  id,
                  partner: { name },
                } = location
                return <Text key={id}>{name}</Text>
              })}
          </Box>
        </View>
      </Flex>
    </ScrollView>
  )
}

export const NewMapContainer = createFragmentContainer(NewMapScreen, {
  system: graphql`
    fragment NewMap_system on System {
      algolia {
        appID
        apiKey
      }
    }
  `,
})

export const NewMapScreenQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<NewMapQuery>
      environment={defaultEnvironment}
      query={graphql`
        query NewMapQuery {
          system {
            ...NewMap_system
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: NewMapContainer,
        renderPlaceholder: () => {
          return (
            <Flex>
              <Spinner />
            </Flex>
          )
        },
      })}
      variables={{}}
    />
  )
}
