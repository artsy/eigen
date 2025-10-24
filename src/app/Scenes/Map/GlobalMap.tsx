import { Box, Flex, useColor, useSpace } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import MapboxGL from "@rnmapbox/maps"
import { GlobalMap_viewer$key } from "__generated__/GlobalMap_viewer.graphql"
import { CityBottomSheet } from "app/Scenes/City/CityBottomSheet"
import { CityData, CityPicker } from "app/Scenes/City/CityPicker"
import { cityTabs } from "app/Scenes/City/cityTabs"
import { SelectedPin } from "app/Scenes/Map/Components/SelectedPin"
import { MAX_GRAPHQL_INT } from "app/Scenes/Map/MapRenderer"
import {
  convertCityToGeoJSON,
  fairToGeoCityFairs,
  showsToGeoCityShow,
} from "app/utils/convertCityToGeoJSON"
import { extractNodes } from "app/utils/extractNodes"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { isEqual, uniq } from "lodash"
import { AnimatePresence } from "moti"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Platform } from "react-native"
import Keys from "react-native-keys"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useRefetchableFragment } from "react-relay"
import { useTracking } from "react-tracking"
import usePrevious from "react-use/lib/usePrevious"
import Supercluster, { AnyProps, ClusterProperties, PointFeature } from "supercluster"
import { CitySwitcherButton } from "./Components/CitySwitcherButton"
import { PinsShapeLayer } from "./Components/PinsShapeLayer"
import { ShowCard } from "./Components/ShowCard"
import { UserPositionButton } from "./Components/UserPositionButton"
import { EventEmitter } from "./EventEmitter"
import {
  bucketCityResults,
  BucketKey,
  BucketResults,
  emptyBucketResults,
} from "./bucketCityResults"
import { Fair, FilterData, Show } from "./types"

MapboxGL.setAccessToken(Keys.secureFor("MAPBOX_API_CLIENT_KEY"))

interface Props {
  /** city slug */
  citySlug: string
  // TODO: Rethink this
  /** Error from Relay (MapRenderer.tsx). Needed here to send over the EventEmitter. */
  // relayErrorState?: RelayErrorState
  /** The viewer data */
  viewer: GlobalMap_viewer$key
}

export const ArtsyMapStyleURL = "mapbox://styles/artsyit/cjrb59mjb2tsq2tqxl17pfoak"

const DefaultZoomLevel = 11
const MinZoomLevel = 9
const MaxZoomLevel = 17.5

const SHOW_CARD_HEIGHT = 150

export enum DrawerPosition {
  open = "open",
  closed = "closed",
  collapsed = "collapsed",
  partiallyRevealed = "partiallyRevealed",
}

export const GlobalMap: React.FC<Props> = (props) => {
  const color = useColor()
  const space = useSpace()
  const safeAreaInsets = useSafeAreaInsets()

  const [viewer, refetch] = useRefetchableFragment(globalMapFragment, props.viewer)
  const { trackEvent } = useTracking()

  const mapRef = useRef<MapboxGL.MapView>(null)
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const hideButtons = new Animated.Value(0)
  let currentZoom = useRef(DefaultZoomLevel).current
  const showsRef = useRef<{ [key: string]: Show }>({})
  const fairsRef = useRef<{ [key: string]: Fair }>({})

  const [activeShows, setActiveShows] = useState<Array<Fair | Show>>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const currentLocation = viewer.city?.coordinates
  const [userLocation, setUserLocation] = useState(currentLocation)

  const [bucketResults, setBucketResults] = useState<BucketResults>(emptyBucketResults)
  const previousBucketResults = usePrevious(bucketResults)

  const [featureCollections, setFeatureCollections] = useState<
    { [key in BucketKey]: FilterData } | {}
  >({})
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isSavingShow, setIsSavingShow] = useState(false)
  const [nearestFeature, setNearestFeature] = useState<
    PointFeature<ClusterProperties & AnyProps> | PointFeature<AnyProps> | null
  >(null)
  const [activePin, setActivePin] = useState<GeoJSON.Feature | null>(null)
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [drawerPosition, setDrawerPosition] = useState<DrawerPosition>(DrawerPosition.closed)

  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Animated.View
            style={{
              transform: [
                {
                  translateY: hideButtons.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -(safeAreaInsets.top + 12 + 50)],
                  }),
                },
              ],
            }}
          >
            <Flex flexDirection="row" justifyContent="flex-end" alignContent="flex-end">
              <CitySwitcherButton
                city={viewer.city}
                isLoading={!viewer.city}
                onPress={onPressCitySwitcherButton}
              />
              {!!userLocation && (
                <Box style={{ marginLeft: 10 }}>
                  <UserPositionButton
                    highlight={userLocation === currentLocation}
                    onPress={onPressUserPositionButton}
                  />
                </Box>
              )}
            </Flex>
          </Animated.View>
        )
      },
      headerShadowVisible: false,
    })
  }, [navigation, viewer, userLocation, showCityPicker, activePin])

  useEffect(() => {
    updateShowIdMap()
    EventEmitter.subscribe("filters:change", handleFilterChange)
    return () => {
      EventEmitter.unsubscribe("filters:change", handleFilterChange)
    }
  }, [])

  useEffect(() => {
    if (!bucketResults) return

    if (previousBucketResults) {
      const prevFollowed = previousBucketResults.saved?.map((g) => g?.is_followed)
      const currentFollowed = bucketResults.saved?.map((g) => g?.is_followed)

      const shouldUpdate = !isEqual(prevFollowed, currentFollowed)

      if (shouldUpdate) {
        updateClusterMap(bucketResults)
      }
    }
  }, [bucketResults])

  useEffect(() => {
    updateShowIdMap()
  }, [viewer])

  useEffect(() => {
    if (viewer) {
      // TODO: This is currently really inefficient.
      const newBucketResults = bucketCityResults(viewer)

      setBucketResults(newBucketResults)
      emitFilteredBucketResults(newBucketResults)
      updateShowIdMap()
      updateClusterMap(newBucketResults)
    }
  }, [props, viewer])

  const handleFilterChange = (activeIndex: number) => {
    setActiveIndex(activeIndex)
    setActivePin(null)
    setActiveShows([])
  }

  const trackPinTap = (actionName: string, show: any, type: string) => {
    trackEvent(tracks.trackPinTap(actionName, show, type))
  }

  const updateClusterMap = (newBucketResults: BucketResults) => {
    const newFeatureCollections = {}
    cityTabs.forEach((tab) => {
      const newShows = tab.getShows(newBucketResults)
      const newFairs = tab.getFairs(newBucketResults)
      const showData = showsToGeoCityShow(newShows)
      const fairData = fairToGeoCityFairs(newFairs)
      const data = showData.concat(fairData as any as Show[])
      const geoJSONFeature = convertCityToGeoJSON(data)

      const clusterEngine = new Supercluster({
        radius: 50,
        minZoom: Math.floor(MinZoomLevel),
        maxZoom: Math.floor(MaxZoomLevel),
      })

      clusterEngine.load(geoJSONFeature.features as any)

      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      newFeatureCollections[tab.id] = {
        featureCollection: geoJSONFeature,
        filter: tab.id,
        clusterEngine,
      }
    })

    setFeatureCollections(newFeatureCollections)
  }

  const emitFilteredBucketResults = (newBucketResults: BucketResults) => {
    if (!viewer) {
      return
    }

    const filter = cityTabs[activeIndex]

    const cityName = viewer.city?.name
    const citySlug = viewer.city?.slug

    EventEmitter.dispatch("map:change", {
      filter,
      buckets: newBucketResults,
      cityName,
      citySlug,
    })
  }

  const updateShowIdMap = () => {
    if (!viewer) {
      return
    }

    const { city } = viewer
    if (city) {
      const savedUpcomingShows = extractNodes(city.upcomingShows).filter((node) => node.is_followed)
      const shows = extractNodes(city.shows)
      const concatedShows = uniq(shows.concat(savedUpcomingShows as any))

      concatedShows.forEach((node) => {
        if (!node || !node.location || !node.location.coordinates) {
          return null
        }

        showsRef.current[node.slug] = node
      })

      extractNodes(city.fairs).forEach((node) => {
        if (!node || !node.location || !node.location.coordinates) {
          return null
        }

        fairsRef.current[node.slug] = {
          ...node,
          type: "Fair",
        }
      })
    }
  }

  const renderShowCard = () => {
    const hasShows = activeShows.length > 0

    // We need to update activeShows in case of a mutation (save show)
    const updatedShows: Array<Fair | Show> = activeShows.map((item: any) => {
      if (item.type === "Show") {
        return showsRef.current[item.slug]
      } else if (item.type === "Fair") {
        return fairsRef.current[item.slug]
      }
      return item
    })

    return (
      <Flex
        style={{
          left: 0,
          right: 0,
          position: "absolute",
          height: SHOW_CARD_HEIGHT,
        }}
      >
        {!!hasShows && (
          <ShowCard
            shows={updatedShows}
            onSaveStarted={() => {
              setIsSavingShow(true)
            }}
            onSaveEnded={() => {
              setIsSavingShow(false)
            }}
          />
        )}
      </Flex>
    )
  }

  const onUserLocationUpdate = (location: MapboxGL.Location) => {
    if (!location || !location.coords) {
      return
    }

    setUserLocation(longCoordsToLocation(location.coords))
  }

  const onRegionIsChanging = async () => {
    if (!mapRef.current) {
      return
    }
    const zoom = Math.ceil((await mapRef.current.getZoom()) ?? DefaultZoomLevel)

    if (currentZoom !== zoom) {
      setActivePin(null)
    }

    if (!currentZoom) {
      currentZoom = zoom
    }
  }

  const onDidFinishRenderingMapFully = () => {
    setMapLoaded(true)
  }

  const onPressMap = () => {
    if (!isSavingShow) {
      setActiveShows([])
      setActivePin(null)
    }
  }

  const onPressCitySwitcherButton = () => {
    if (!showCityPicker) {
      // Show the city picker
      setShowCityPicker(true)
      setActiveShows([])
      setActivePin(null)
    } else {
      // Hide the city picker
      setShowCityPicker(false)
    }
  }

  const onPressUserPositionButton = () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const { lat, lng } = userLocation
    cameraRef.current?.setCamera({
      centerCoordinate: [lng, lat],
      zoomLevel: DefaultZoomLevel,
      animationDuration: 500,
    })
  }

  const currentFeatureCollection = (): FilterData => {
    const filterID = cityTabs[activeIndex].id
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    return featureCollections[filterID]
  }

  const { city } = viewer
  const centerLat = city?.coordinates?.lat || 0
  const centerLng = city?.coordinates?.lng || 0

  const mapProps = {
    styleURL: ArtsyMapStyleURL,
    userTrackingMode: MapboxGL.UserTrackingModes.Follow,
    logoEnabled: !!city,
    attributionEnabled: false,
    compassEnabled: false,
  }

  /**
   * This function is complicated, because the work we have to do is tricky.
   * What's happening is that we have to replicate a subset of the map's clustering algorithm to get
   * access to the shows that the user has tapped on.
   */
  const handleFeaturePress = async (event: any) => {
    if (!mapRef.current) {
      return
    }
    const {
      properties: { slug, cluster, type },
      geometry: { coordinates },
    } = event.features[0]

    updateDrawerPosition(DrawerPosition.collapsed)

    let activeShows: Array<Fair | Show> = []

    // If the user only taps on the pin we can use the
    // id directly to retrieve the corresponding show
    // @TODO: Adding active Fairs to state only to handle Selecting Fairs
    // The rest of the logic for displaying active show shows and fairs in the
    // maps pins and cards will remain the same for now.
    if (!cluster) {
      if (type === "Show") {
        activeShows = [showsRef.current[slug]]
        trackPinTap(Schema.ActionNames.SingleMapPin, activeShows, Schema.OwnerEntityTypes.Show)
      } else if (type === "Fair") {
        activeShows = [fairsRef.current[slug]]
        trackPinTap(Schema.ActionNames.SingleMapPin, activeShows, Schema.OwnerEntityTypes.Fair)
      }
    }

    // Otherwise the logic is as follows
    // We use our clusterEngine which is map of our clusters
    // 1. Fetch all features (pins, clusters) based on the current map visible bounds
    // 2. Sort them by distance to the user tap coordinates
    // 3. Retrieve points within the cluster and map them back to shows
    else {
      trackPinTap(Schema.ActionNames.ClusteredMapPin, null, Schema.OwnerEntityTypes.Show)
      // Get map zoom level and coordinates of where the user tapped
      const zoom = Math.floor(await mapRef.current.getZoom())
      const [lat, lng] = coordinates

      // Get coordinates of the map's current viewport bounds
      const visibleBounds = await mapRef.current.getVisibleBounds()
      const [ne, sw] = visibleBounds
      const [eastLng, northLat] = ne
      const [westLng, southLat] = sw

      const clusterEngine = currentFeatureCollection().clusterEngine
      const visibleFeatures = clusterEngine.getClusters(
        [westLng, southLat, eastLng, northLat],
        zoom
      )
      const nearestFeature = getNearestPointToLatLongInCollection({ lat, lng }, visibleFeatures)

      const points = clusterEngine.getLeaves(nearestFeature?.properties?.cluster_id, Infinity)
      activeShows = points.map((a) => a.properties) as any
      setNearestFeature(nearestFeature)
    }

    setActiveShows(activeShows)
    setActivePin(event.features[0])
  }

  const getNearestPointToLatLongInCollection = (
    values: { lat: number; lng: number },
    features: any[]
  ) => {
    // https://stackoverflow.com/a/21623206
    function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
      const p = 0.017453292519943295 // Math.PI / 180
      const c = Math.cos
      const a =
        0.5 -
        c((lat2 - lat1) * p) / 2 +
        (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2

      return 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
    }

    const distances = features
      .map((feature) => {
        const [featureLat, featureLng] = feature.geometry.coordinates
        return {
          ...feature,
          distance: distance(values.lat, values.lng, featureLat, featureLng),
        }
      })
      .sort((a, b) => a.distance - b.distance)

    return distances[0]
  }

  const updateDrawerPosition = (position: DrawerPosition) => {
    setDrawerPosition(position)
  }

  const onSelectCity = (newCity: CityData) => {
    setShowCityPicker(false)
    refetch({ citySlug: newCity.slug, maxInt: MAX_GRAPHQL_INT })
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.CityGuideMap,
        context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
        context_screen_owner_slug: props.citySlug,
        context_screen_owner_id: props.citySlug,
      }}
    >
      {/* TODO: think of a better way to animate the appearance of the city picker */}
      <AnimatePresence>
        {!!showCityPicker && (
          <CityPicker selectedCity={city?.name ?? ""} onSelectCity={onSelectCity} />
        )}
      </AnimatePresence>
      <Flex flexDirection="column" style={{ backgroundColor: color("mono5") }}>
        <MapboxGL.MapView
          ref={mapRef}
          style={{ width: "100%", height: "100%" }}
          {...mapProps}
          onCameraChanged={onRegionIsChanging}
          onDidFinishLoadingMap={onDidFinishRenderingMapFully}
          attributionEnabled
          logoEnabled
          attributionPosition={{
            bottom: space(2),
            right: space(2),
          }}
          logoPosition={{
            bottom: space(2),
            left: space(2),
          }}
          onPress={onPressMap}
          scaleBarPosition={
            Platform.OS === "android"
              ? {
                  top: safeAreaInsets.top + space(6),
                  left: space(2),
                }
              : // The default position is fine on iOS // no need to override it
                undefined
          }
        >
          <MapboxGL.Camera
            ref={cameraRef}
            animationMode="flyTo"
            zoomLevel={DefaultZoomLevel}
            minZoomLevel={MinZoomLevel}
            maxZoomLevel={MaxZoomLevel}
            centerCoordinate={[centerLng, centerLat]}
          />
          <MapboxGL.UserLocation onUpdate={onUserLocationUpdate} />
          {!!city && (
            <>
              {!!mapLoaded && !!activeShows && !!activePin && (
                <SelectedPin
                  activePin={activePin}
                  nearestFeature={nearestFeature}
                  activeShows={activeShows}
                />
              )}
              {!!featureCollections && (
                <PinsShapeLayer
                  filterID={cityTabs[activeIndex].id}
                  featureCollections={featureCollections}
                  onPress={(e) => handleFeaturePress(e)}
                />
              )}
            </>
          )}
        </MapboxGL.MapView>
        {!!city && activeShows.length > 0 && (
          <Flex
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height={SHOW_CARD_HEIGHT}
            justifyContent="flex-end"
          >
            {renderShowCard()}
          </Flex>
        )}
        <CityBottomSheet drawerPosition={drawerPosition} citySlug={viewer.city?.slug || ""} />
      </Flex>
    </ProvideScreenTracking>
  )
}

/** Makes sure we're consistently using { lat, lng } internally */
const longCoordsToLocation = (coords: { longitude: number; latitude: number }) => {
  return { lat: coords.latitude, lng: coords.longitude }
}

const tracks = {
  trackPinTap: (_: any, __: any, args: any) => {
    const actionName = args[0]
    const show = args[1]
    const type = args[2]

    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Tap,
      owner_id: !!show ? show[0].internalID : "",
      owner_slug: !!show ? show[0].id : "",
      owner_type: !!type ? type : "",
    } as any
  },
}

const globalMapFragment = graphql`
  fragment GlobalMap_viewer on Viewer
  @refetchable(queryName: "GlobalMap_viewerRefetch")
  @argumentDefinitions(citySlug: { type: "String!" }, maxInt: { type: "Int!" }) {
    city(slug: $citySlug) {
      name
      slug
      coordinates {
        lat
        lng
      }
      upcomingShows: showsConnection(
        includeStubShows: true
        status: UPCOMING
        dayThreshold: 14
        first: $maxInt
        sort: START_AT_ASC
      ) {
        edges {
          node {
            slug
            internalID
            id
            isStubShow
            name
            status
            href
            is_followed: isFollowed
            exhibition_period: exhibitionPeriod(format: SHORT)
            cover_image: coverImage {
              url
            }
            location {
              coordinates {
                lat
                lng
              }
            }
            type
            start_at: startAt
            end_at: endAt
            partner {
              ... on Partner {
                name
                type
                profile {
                  image {
                    url(version: "square")
                  }
                }
              }
            }
          }
        }
      }
      shows: showsConnection(
        includeStubShows: true
        status: RUNNING
        first: $maxInt
        sort: PARTNER_ASC
      ) {
        edges {
          node {
            ...ShowItemRow_show
            slug
            internalID
            id
            isStubShow
            name
            status
            href
            is_followed: isFollowed
            exhibition_period: exhibitionPeriod(format: SHORT)
            cover_image: coverImage {
              url
            }
            location {
              coordinates {
                lat
                lng
              }
            }
            type
            start_at: startAt
            end_at: endAt
            partner {
              ... on Partner {
                name
                type
                profile {
                  image {
                    url(version: "square")
                  }
                }
              }
            }
          }
        }
      }
      fairs: fairsConnection(first: $maxInt, status: CURRENT, sort: START_AT_ASC) {
        edges {
          node {
            id
            slug
            name
            exhibition_period: exhibitionPeriod(format: SHORT)
            counts {
              partners
            }
            location {
              coordinates {
                lat
                lng
              }
            }
            image {
              image_url: imageURL
              aspect_ratio: aspectRatio
              url
            }
            profile {
              icon {
                internalID
                href
                height
                width
                url(version: "square140")
              }
              id
              slug
              name
            }
            start_at: startAt
            end_at: endAt
          }
        }
      }
    }
  }
`
