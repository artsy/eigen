import MapboxGL from "@react-native-mapbox-gl/maps"
import themeGet from "@styled-system/theme-get"
import { NewMap_system } from "__generated__/NewMap_system.graphql"
import { NewMapQuery } from "__generated__/NewMapQuery.graphql"
import { NewMapShowsRailQuery } from "__generated__/NewMapShowsRailQuery.graphql"
import algoliasearch from "algoliasearch"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import _ from "lodash"
import { debounce, throttle } from "lodash"
import { Box, Button, CloseIcon, Flex, Pill, Spinner, Text } from "palette"
import React, { FC, useEffect, useRef, useState } from "react"
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import Config from "react-native-config"
import {
  createFragmentContainer,
  createRefetchContainer,
  FragmentRef,
  graphql,
  QueryRenderer,
} from "react-relay"
import styled from "styled-components/native"
import cityData from "../../../../data/cityDataSortedByDisplayPreference.json"
import { ShowsRail } from "../Home/Components/ShowsRail"
import { UserPositionButton } from "./Components/UserPositionButton"
import { ArtsyMapStyleURL } from "./GlobalMap"

MapboxGL.setAccessToken(Config.MAPBOX_API_CLIENT_KEY)

const FilterPills = ["Open Now", "Available Works", "Open Exhibitions"]

const mapContainerStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: Dimensions.get("window").height,
  },
  map: {
    flex: 1,
  },
})

const PillsContainer = styled(Box)`
  position: absolute;
  top: 160;
  left: 25;
  z-index: 1;
  width: 100%;
  height: 100;
`

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
const MAX_ZOOM_LVL = 250

const BERLIN_DATA = cityData.find((city) => city.name === "Berlin")
const BERLIN_COORDS = [BERLIN_DATA!.coordinates.lng, BERLIN_DATA!.coordinates.lat]
const BERLIN_BOUNDING_BOX = [
  [52.500176, 13.318375],
  [52.55983, 13.442026],
]
export interface GalleryHit {
  id: string
  address: string
  partner: {
    name: string
    href: string
  }
  _geoloc: {
    lat: number
    lng: number
  }
}
export const DEBOUNCE_DELAY = 400

export const NewMapScreen: FC<{ system: NewMap_system }> = ({ system: { algolia } }) => {
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const mapRef = useRef<MapboxGL.MapView>(null)
  const [userLocation, setUserLocation] = useState<GeoJSON.Position>()
  const [showUserLocation, setShowUserLocation] = useState(false)
  const [visibleBounds, setVisibleBounds] = useState<GeoJSON.Position[]>(BERLIN_BOUNDING_BOX)
  const [locations, setLocations] = useState<GalleryHit[] | undefined>()
  const [showReloadButton, setShowReloadButton] = useState<boolean>(false)
  const didInitialFetch = useRef(false)
  const client = algoliasearch(algolia?.appID!, algolia?.apiKey!)
  const galleryIndex = client.initIndex("PartnerLocation_staging")
  const [selectedPin, setSelectedPin] = useState({ name: "", href: "" })

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
      fetchGalleryLocations()
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
      // console.warn(JSON.stringify(results.hits, null, 2))
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
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white100">
      <View style={mapContainerStyles.container}>
        <MapboxGL.MapView
          onPress={() => setSelectedPin({})}
          ref={mapRef}
          regionDidChangeDebounceTime={1000}
          onRegionDidChange={async () => {
            // TODO: I think this fires several times on the initial flyTo render
            const newBounds = await mapRef.current?.getVisibleBounds()
            setVisibleBounds(newBounds)
          }}
          styleURL={ArtsyMapStyleURL}
          style={mapContainerStyles.map}
          compassEnabled={false}
        >
          <PillsContainer>
            <Flex flexDirection="row">
              {FilterPills.map((pill, index) => (
                <Pill mr={1} key={index} rounded>
                  {pill}
                </Pill>
              ))}
            </Flex>
          </PillsContainer>
          <TopButtonsContainer>
            <UserPositionButton onPress={onPressUserPositionButton} />
            {/* {!!showReloadButton && (
              <Button ml={30} onPress={onPressReloadButton}>
                Reload{" "}
              </Button>
            )} */}
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
            // maxZoomLevel={MAX_ZOOM_LVL}
          />
          {!!locations &&
            locations.map((location) => {
              // console.warn({ location })
              const {
                id,
                partner: { href, name, type },
                address,
                _geoloc: { lng, lat },
              } = location
              return (
                <MapboxGL.MarkerView
                  onSelected={() => {
                    setSelectedPin({ name, href, address, type, id })
                  }}
                  key={id}
                  id={id}
                  css={{
                    color: !!selectedPin?.id ? "white" : "red",
                  }}
                  coordinate={[lng, lat]}
                >
                  <MapboxGL.Callout title={name} />
                </MapboxGL.MarkerView>
              )
            })}
        </MapboxGL.MapView>
        {!!selectedPin.name && (
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: "5%",
              alignSelf: "center",
            }}
            onPress={() => navigate(selectedPin.href)}
          >
            <Box
              p={1}
              backgroundColor="white100"
              style={{
                // height: 100,
                width: 250,
              }}
            >
              <Text variant="lg">{selectedPin.name}</Text>
              <Text>{selectedPin.type}</Text>
              <Text>{selectedPin.address}</Text>
            </Box>
          </TouchableOpacity>
        )}
      </View>
      {/* <View>
          <Box backgroundColor="gray60">
            {!!locations &&
              locations.map((location) => {
                const {
                  id,
                  partner: { name },
                } = location
                return <Text key={id}>{name}</Text>
              })}
          </Box> */}
      {/* <ShowsRailQueryRenderer /> */}
      {/* </View> */}
    </Flex>
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

export const ShowsRailContainer = createRefetchContainer(
  ShowsRail,
  {
    showsConnection: graphql`
      fragment NewMap_showsConnection on ShowConnection {
        ...ShowsRail_showsConnection @relay(mask: false)
      }
    `,
  },
  graphql`
    query NewMapRefetchQuery($partnerID: String!) {
      partner(id: $partnerID) {
        showsConnection(first: 10) {
          ...ShowsRail_showsConnection
        }
      }
    }
  `
)

export const ShowsRailQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<NewMapShowsRailQuery>
      environment={defaultEnvironment}
      query={graphql`
        query NewMapShowsRailQuery($partnerID: String!) {
          partner(id: $partnerID) {
            showsConnection(first: 10) {
              ...NewMap_showsConnection
            }
          }
        }
      `}
      render={({ props }) => {
        if (props?.partner) {
          return (
            <ShowsRailContainer
              title=""
              showsConnection={
                props!.partner!.showsConnection! as FragmentRef<"ShowsRail_showsConnection">
              }
            />
          )
        }
      }}
      variables={{ partnerID: "gagosian" }}
    />
  )
}

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
      cacheConfig={{ force: true }}
    />
  )
}
