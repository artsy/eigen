import MapboxGL, { MapViewProps, ShapeSourceProps } from "@react-native-mapbox-gl/maps"
import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import colors from "lib/data/colors"
import { Pin } from "lib/Icons/Pin"
import PinFairSelected from "lib/Icons/PinFairSelected"
import PinSavedSelected from "lib/Icons/PinSavedSelected"
import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import { convertCityToGeoJSON, fairToGeoCityFairs, showsToGeoCityShow } from "lib/utils/convertCityToGeoJSON"
import { extractNodes } from "lib/utils/extractNodes"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { get, uniq } from "lodash"
import { Box, color, Flex, Sans, Theme } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, Easing, Image, NativeModules, View } from "react-native"
import Config from "react-native-config"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
// @ts-ignore
import { animated, config, Spring } from "react-spring/renderprops-native.cjs"
import styled from "styled-components/native"
import Supercluster, { AnyProps, ClusterProperties, PointFeature } from "supercluster"
import { cityTabs } from "../City/cityTabs"
import { bucketCityResults, BucketKey, BucketResults, emptyBucketResults } from "./bucketCityResults"
import { CitySwitcherButton } from "./Components/CitySwitcherButton"
import { PinsShapeLayer } from "./Components/PinsShapeLayer"
import { ShowCard } from "./Components/ShowCard"
import { UserPositionButton } from "./Components/UserPositionButton"
import { EventEmitter } from "./EventEmitter"
import { Fair, FilterData, RelayErrorState, Show } from "./types"
import { useTracking } from "react-tracking"

MapboxGL.setAccessToken(Config.MAPBOX_API_CLIENT_KEY)

const AnimatedView = animated(View)

const ShowCardContainer = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200;
`

const LoadingScreen = styled(Image)`
  position: absolute;
  left: 0;
  top: 0;
`

const TopButtonsContainer = styled(Box)`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  width: 100%;
  height: 100;
`

interface Props {
  /** Where to center the map initially?  */
  initialCoordinates?: { lat: number; lng: number }
  /** Should the map buttons be hidden...  */
  hideMapButtons: boolean
  /** The map API entry-point */
  viewer?: GlobalMap_viewer
  /** API stuff */
  relay?: RelayProp
  /** Tracking */
  tracking?: any
  /** city slug */
  citySlug: string
  /** Whether the bottom sheet drawer is opened */
  isDrawerOpen?: boolean
  /** Whether the user is geographically within the city we're currently rendering. */
  userLocationWithinCity: boolean
  /** Reflects the area not covered by navigation bars, tab bars, toolbars, and other ancestors  */
  safeAreaInsets: SafeAreaInsets
  /** Error from Relay (MapRenderer.tsx). Needed here to send over the EventEmitter. */
  relayErrorState?: RelayErrorState
}

interface State {
  /** The index from the City selector */
  activeIndex: number
  /** Shows which are selected and should show as highlights above the map */
  activeShows: Array<Fair | Show>
  /** An object of objects describing all the artsy elements we want to map */
  bucketResults: BucketResults
  /** The center location for the map right now */
  currentLocation?: { lat: number; lng: number }
  /** The users's location from core location */
  userLocation: { lat: number; lng: number } | null
  /** A set of GeoJSON features, which right now is our show clusters */
  featureCollections: { [key in BucketKey]: FilterData } | {}
  /** Has the map fully rendered? */
  mapLoaded: boolean
  /** In the process of saving a show */
  isSavingShow: boolean
  /** Cluster map data used to populate selected cluster annotation */
  nearestFeature: PointFeature<ClusterProperties & AnyProps> | PointFeature<AnyProps> | null
  /** Cluster map data used currently in view window */
  activePin: GeoJSON.Feature | null
}

export const ArtsyMapStyleURL = "mapbox://styles/artsyit/cjrb59mjb2tsq2tqxl17pfoak"

const DefaultZoomLevel = 11
const MinZoomLevel = 9
const MaxZoomLevel = 17.5

const ButtonAnimation = {
  yDelta: -300,
  duration: 350,
  easing: {
    moveOut: Easing.in(Easing.cubic),
    moveIn: Easing.out(Easing.cubic),
  },
}

enum DrawerPosition {
  open = "open",
  closed = "closed",
  collapsed = "collapsed",
  partiallyRevealed = "partiallyRevealed",
}

/** Makes sure we're consistently using { lat, lng } internally */
const longCoordsToLocation = (coords: { longitude: number; latitude: number }) => {
  return { lat: coords.latitude, lng: coords.longitude }
}

export const GlobalMap: React.FC<Props> = (props) => {
  const currentLocation = props.initialCoordinates || get(props, "viewer.city.coordinates")
  const [state, setState] = useState<State>({
    activeShows: [],
    activeIndex: 0,
    currentLocation,
    userLocation: null,
    bucketResults: emptyBucketResults,
    featureCollections: {},
    mapLoaded: false,
    isSavingShow: false,
    nearestFeature: null,
    activePin: null,
  })

  const mapRef = useRef<MapboxGL.MapView>(null)
  const cameraRef = useRef<MapboxGL.Camera>(null)

  useEffect(() => {
    updateShowIdMap()
  }, [])

  const hideButtons = useRef(new Animated.Value(0)).current
  const shows: { [id: string]: Show } = {}
  const fairs: { [id: string]: Fair } = {}

  const handleFilterChange = (activeIndex: any) => {
    setState((prev) => ({ ...prev, activeIndex, activePin: null, activeShows: [] }))
  }

  useEffect(() => {
    EventEmitter.subscribe("filters:change", handleFilterChange)
    return () => EventEmitter.unsubscribe("filters:change", handleFilterChange)
  }, [])

  useEffect(() => {
    // Update the clusterMap if new bucket results
    if (state.bucketResults) {
      updateClusterMap()
    }
  }, [state.bucketResults])

  useEffect(() => {
    // If there is a new city, enity it and update our map.
    if (props.viewer) {
      // TODO: This is currently really inefficient.
      const bucketResults = bucketCityResults(props.viewer)

      setState((prev) => ({ ...prev, bucketResults }))
      emitFilteredBucketResults()
      updateShowIdMap()
      updateClusterMap()
    }
  }, [props.viewer])

  useEffect(() => {
    // If the relayErrorState changes, emit a new event.
    EventEmitter.dispatch("map:error", { relayErrorState: props.relayErrorState })
  }, [props.relayErrorState])

  useEffect(() => {
    if (props.hideMapButtons) {
      Animated.timing(hideButtons, {
        toValue: 1,
        duration: ButtonAnimation.duration,
        easing: ButtonAnimation.easing.moveOut,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(hideButtons, {
        toValue: 0,
        duration: ButtonAnimation.duration,
        easing: ButtonAnimation.easing.moveIn,
        useNativeDriver: true,
      }).start()
    }
  }, [props.hideMapButtons])

  const { trackEvent } = useTracking()

  const trackPinTap = (actionName: any, show: any, type: any) => {
    trackEvent({
      action_name: actionName,
      action_type: Schema.ActionTypes.Tap,
      owner_id: !!show ? show[0].internalID : "",
      owner_slug: !!show ? show[0].id : "",
      owner_type: !!type ? type : "",
    })
    return null
  }

  const updateClusterMap = () => {
    if (!props.viewer) {
      return
    }

    const featureCollections: State["featureCollections"] = {}

    cityTabs.forEach((tab) => {
      const shows = tab.getShows(state.bucketResults)
      const fairs = tab.getFairs(state.bucketResults)
      const showData = showsToGeoCityShow(shows)
      const fairData = fairToGeoCityFairs(fairs)
      const data = showData.concat((fairData as any) as Show[])
      const geoJSONFeature = convertCityToGeoJSON(data)

      const clusterEngine = new Supercluster({
        radius: 50,
        minZoom: Math.floor(MinZoomLevel),
        maxZoom: Math.floor(MaxZoomLevel),
      })

      clusterEngine.load(geoJSONFeature.features as any)

      // @ts-ignore
      featureCollections[tab.id] = {
        featureCollection: geoJSONFeature,
        filter: tab.id,
        clusterEngine,
      }
    })
    setState((prev) => ({ ...prev, featureCollections }))
  }

  const emitFilteredBucketResults = () => {
    if (!props.viewer) {
      return
    }

    const filter = cityTabs[state.activeIndex]
    const { city } = props.viewer
    const { name: cityName, slug: citySlug, sponsoredContent } = city ?? {}

    EventEmitter.dispatch("map:change", {
      filter,
      buckets: state.bucketResults,
      cityName,
      citySlug,
      sponsoredContent,
      relay: props.relay,
    })
  }

  const updateShowIdMap = () => {
    if (!props.viewer) {
      return
    }

    const { city } = props.viewer
    if (city) {
      const savedUpcomingShows = extractNodes(city.upcomingShows).filter((node) => node.is_followed)
      const shows = extractNodes(city.shows)
      const concatedShows = uniq(shows.concat(savedUpcomingShows))

      concatedShows.forEach((node) => {
        if (!node || !node.location || !node.location.coordinates) {
          return null
        }

        // @ts-ignore
        shows[node.slug] = node
      })

      extractNodes(city.fairs).forEach((node) => {
        if (!node || !node.location || !node.location.coordinates) {
          return null
        }

        fairs[node.slug] = {
          ...node,
          type: "Fair",
        }
      })
    }
  }

  const renderSelectedPin = () => {
    const { activeShows, activePin } = state
    const { properties } = activePin ?? {}
    const { cluster, type } = properties ?? {}

    if (cluster) {
      const { nearestFeature } = state
      const { properties, geometry } = nearestFeature ?? {
        properties: {},
        geometry: { type: "Point", coordinates: [0, 0] },
      }
      const [clusterLat, clusterLng] = geometry.coordinates

      const clusterId = properties.cluster_id.toString()
      let pointCount = properties.point_count

      const radius = pointCount < 4 ? 40 : pointCount < 21 ? 50 : 65
      pointCount = pointCount.toString()

      return (
        clusterId &&
        clusterLat &&
        clusterLng &&
        pointCount && (
          <MapboxGL.PointAnnotation
            key={clusterId}
            id={clusterId}
            selected={true}
            coordinate={[clusterLat, clusterLng]}
          >
            <SelectedCluster width={radius} height={radius}>
              <Sans size="3" weight="medium" color={color("white100")}>
                {pointCount}
              </Sans>
            </SelectedCluster>
          </MapboxGL.PointAnnotation>
        )
      )
    }

    const item = activeShows[0]

    if (!item || !item.location) {
      return null
    }

    const lat = item.location.coordinates!.lat
    const lng = item.location.coordinates!.lng
    const id = item.slug

    if (type === "Fair") {
      return (
        lat &&
        lng &&
        id && (
          <MapboxGL.PointAnnotation key={id} id={id} coordinate={[lng, lat]}>
            <PinFairSelected />
          </MapboxGL.PointAnnotation>
        )
      )
    } else if (type === "Show") {
      const isSaved = (item as Show).is_followed

      return (
        lat &&
        lng &&
        id && (
          <MapboxGL.PointAnnotation key={id} id={id} selected={true} coordinate={[lng, lat]}>
            {isSaved ? (
              <PinSavedSelected pinHeight={45} pinWidth={45} />
            ) : (
              <Pin pinHeight={45} pinWidth={45} selected={true} />
            )}
          </MapboxGL.PointAnnotation>
        )
      )
    }
  }

  const renderShowCard = () => {
    const { activeShows } = state
    const hasShows = activeShows.length > 0

    // Check if it's an iPhone with ears (iPhone X, Xr, Xs, etc...)

    const iPhoneHasEars = props.safeAreaInsets.top > 20
    // We need to update activeShows in case of a mutation (save show)
    const updatedShows: Array<Fair | Show> = activeShows.map((item: any) => {
      if (item.type === "Show") {
        return shows[item.slug]
      } else if (item.type === "Fair") {
        return fairs[item.slug]
      }
      return item
    })

    return (
      <Spring
        native
        from={{ bottom: -150, progress: 0, opacity: 0 }}
        to={
          hasShows
            ? { bottom: iPhoneHasEars ? 80 : 45, progress: 1, opacity: 1.0 }
            : { bottom: -150, progress: 0, opacity: 0 }
        }
        config={config.stiff}
        precision={1}
      >
        {({ bottom, opacity }: any /* STRICTNESS_MIGRATION */) => (
          <AnimatedView
            style={{
              bottom,
              left: 0,
              right: 0,
              opacity,
              position: "absolute",
              height: 150,
            }}
          >
            <Theme>
              {!!hasShows && (
                <ShowCard
                  shows={updatedShows}
                  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                  relay={props.relay}
                  onSaveStarted={() => {
                    setState((prev) => ({ ...prev, isSavingShow: true }))
                  }}
                  onSaveEnded={() => {
                    setState((prev) => ({ ...prev, isSavingShow: false }))
                  }}
                />
              )}
            </Theme>
          </AnimatedView>
        )}
      </Spring>
    )
  }

  const onUserLocationUpdate = (location: MapboxGL.Location) => {
    if (location === null) {
      return
    }
    setState((prev) => ({ ...prev, userLocation: location?.coords && longCoordsToLocation(location.coords) }))
  }

  const onRegionIsChanging = async () => {
    if (!mapRef.current) {
      return
    }

    setState((prev) => ({
      ...prev,
      activePin: null,
    }))
  }

  const onDidFinishRenderingMapFully = () => {
    NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryMapHasRendered", {})
    setState((prev) => ({ ...prev, mapLoaded: true }))
  }

  const onPressMap = () => {
    if (!state.isSavingShow) {
      setState((prev) => ({ ...prev, activeShows: [], activePin: null }))
    }
  }

  const onPressCitySwitcherButton = () => {
    setState((prev) => ({
      ...prev,
      activeShows: [],
      activePin: null,
    }))
  }

  const onPressUserPositionButton = () => {
    const { lat = 0, lng = 0 } = state.userLocation ?? {}
    cameraRef.current?.setCamera({
      centerCoordinate: [lng, lat],
      zoomLevel: DefaultZoomLevel,
      animationDuration: 500,
    })
  }

  const currentFeatureCollection = (): FilterData => {
    const filterID = cityTabs[state.activeIndex].id
    // @ts-ignore
    return state.featureCollections[filterID as BucketKey]
  }

  const city = get(props, "viewer.city")
  const { relayErrorState, userLocationWithinCity } = props
  const { mapLoaded, activeShows, activePin } = state
  const mapProps: MapViewProps = {
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
  const handleFeaturePress: ShapeSourceProps["onPress"] = async (event) => {
    if (!mapRef.current) {
      return
    }

    const {
      // @ts-ignore
      properties: { slug, cluster, type },
      // @ts-ignore
      geometry: { coordinates },
    } = event.features[0]
    console.log("gamooo", { slug, type, coordinates })

    updateDrawerPosition(DrawerPosition.collapsed)
    let activeShows: Array<Fair | Show> = []

    // If the user only taps on the pin we can use the
    // id directly to retrieve the corresponding show
    // @TODO: Adding active Fairs to state only to handle Selecting Fairs
    // The rest of the logic for displaying active show shows and fairs in the
    // maps pins and cards will remain the same for now.
    if (!cluster) {
      if (type === "Show") {
        activeShows = [shows[slug]]
        trackPinTap(Schema.ActionNames.SingleMapPin, activeShows, Schema.OwnerEntityTypes.Show)
      } else if (type === "Fair") {
        activeShows = [fairs[slug]]
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
      const visibleFeatures = clusterEngine.getClusters([westLng, southLat, eastLng, northLat], zoom)
      const nearestFeature = getNearestPointToLatLongInCollection({ lat, lng }, visibleFeatures)
      const points = clusterEngine.getLeaves(nearestFeature.properties.cluster_id, Infinity)
      activeShows = points.map((a) => a.properties) as any
      setState((prev) => ({
        ...prev,
        nearestFeature,
      }))
    }

    setState((prev) => ({
      ...prev,
      activeShows,
      activePin: event.features[0],
    }))
  }

  const getNearestPointToLatLongInCollection = (
    values: { lat: number; lng: number },
    features: Array<PointFeature<ClusterProperties & AnyProps> | PointFeature<AnyProps>>
  ) => {
    // https://stackoverflow.com/a/21623206
    function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
      const p = 0.017453292519943295 // Math.PI / 180
      const c = Math.cos
      const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2

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
    const notificationName = "ARLocalDiscoveryUpdateDrawerPosition"
    NativeModules.ARNotificationsManager.postNotificationName(notificationName, {
      position,
    })
  }

  const backgroundImageSize = () => {
    const { width, height } = Dimensions.get("window")
    return { width, height }
  }

  const { lat: centerLat, lng: centerLng } = props.initialCoordinates || get(city, "coordinates")

  // @TODO: Implement tests for this component https://artsyproduct.atlassian.net/browse/LD-564
  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.CityGuideMap,
        context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
        context_screen_owner_slug: props.citySlug,
        context_screen_owner_id: props.citySlug,
      }}
    >
      <Flex mb={0.5} flexDirection="column" style={{ backgroundColor: colors["gray-light"] }}>
        <LoadingScreen
          source={require("../../../../images/map-bg.png")}
          resizeMode="cover"
          style={{ ...backgroundImageSize }}
        />
        <TopButtonsContainer style={{ top: props.safeAreaInsets.top + 12 }}>
          <Animated.View
            style={{
              transform: [
                {
                  translateY: hideButtons.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -(props.safeAreaInsets.top + 12 + 50)],
                  }),
                },
              ],
            }}
          >
            <Flex flexDirection="row" justifyContent="flex-end" alignContent="flex-end" px={3}>
              <CitySwitcherButton
                sponsoredContentUrl={(props.viewer && props.viewer.city?.sponsoredContent?.artGuideUrl) ?? undefined}
                city={city}
                isLoading={!city && !(relayErrorState && !relayErrorState.isRetrying)}
                onPress={onPressCitySwitcherButton}
              />
              {!!(state.userLocation && userLocationWithinCity) && (
                <Box style={{ marginLeft: 10 }}>
                  <UserPositionButton
                    highlight={state.userLocation === state.currentLocation}
                    onPress={onPressUserPositionButton}
                  />
                </Box>
              )}
            </Flex>
          </Animated.View>
        </TopButtonsContainer>
        <Spring
          native
          from={{ opacity: 0 }}
          to={mapLoaded ? { opacity: 1.0 } : { opacity: 0 }}
          config={{
            duration: 300,
          }}
          precision={1}
        >
          {({ opacity }: { opacity: number }) => (
            <AnimatedView style={{ flex: 1, opacity }}>
              <MapboxGL.MapView
                style={{ width: "100%", height: Dimensions.get("window").height }}
                {...mapProps}
                onRegionIsChanging={onRegionIsChanging}
                onDidFinishRenderingMapFully={onDidFinishRenderingMapFully}
                onPress={onPressMap}
                ref={mapRef}
              >
                <MapboxGL.Camera
                  ref={cameraRef}
                  animationMode="flyTo"
                  minZoomLevel={MinZoomLevel}
                  maxZoomLevel={MaxZoomLevel}
                  centerCoordinate={[centerLng, centerLat]}
                />
                <MapboxGL.UserLocation onUpdate={onUserLocationUpdate} />
                {!!city && (
                  <>
                    {!!state.featureCollections && (
                      <PinsShapeLayer
                        filterID={cityTabs[state.activeIndex].id as BucketKey}
                        // @ts-ignore
                        featureCollections={state.featureCollections}
                        onPress={(e) => handleFeaturePress(e)}
                      />
                    )}
                    <ShowCardContainer>{renderShowCard()}</ShowCardContainer>
                    {!!mapLoaded && !!activeShows && !!activePin && renderSelectedPin()}
                  </>
                )}
              </MapboxGL.MapView>
            </AnimatedView>
          )}
        </Spring>
      </Flex>
    </ProvideScreenTracking>
  )
}

const SelectedCluster = styled(Flex)`
  background-color: ${colors["purple-regular"]};
  border-radius: 60;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

// FIXME:
// * This should not take the Query type but just City.
// * Use fragments to reduce the size of this fragment.
// * Test if there are unnused field selections.
//
// NOTE: Not renamed the prop from `viewer` becuase there's too much indirection in how the city data is used and it's
//       too easy to miss a place that needs to be updated. This should be cleaned up when the above FIXME is addressed.
export const GlobalMapContainer = createFragmentContainer(GlobalMap, {
  viewer: graphql`
    fragment GlobalMap_viewer on Query @argumentDefinitions(citySlug: { type: "String!" }, maxInt: { type: "Int!" }) {
      city(slug: $citySlug) {
        name
        slug
        coordinates {
          lat
          lng
        }
        sponsoredContent {
          introText
          artGuideUrl
          featuredShows {
            slug
            internalID
            id
            name
            status
            isStubShow
            href
            is_followed: isFollowed
            exhibition_period: exhibitionPeriod
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
              }
            }
          }
          shows: showsConnection(first: 1, sort: START_AT_ASC) {
            totalCount
          }
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
              exhibition_period: exhibitionPeriod
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
        shows: showsConnection(includeStubShows: true, status: RUNNING, first: $maxInt, sort: PARTNER_ASC) {
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
              exhibition_period: exhibitionPeriod
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
              exhibition_period: exhibitionPeriod
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
  `,
})
