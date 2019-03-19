import { Box, color, Flex, Sans, Theme } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import colors from "lib/data/colors"
import { Pin } from "lib/Icons/Pin"
import PinFairSelected from "lib/Icons/PinFairSelected"
import PinSavedSelected from "lib/Icons/PinSavedSelected"
import { convertCityToGeoJSON, fairToGeoCityFairs, showsToGeoCityShow } from "lib/utils/convertCityToGeoJSON"
import { Schema, screenTrack, track } from "lib/utils/track"
import { get, uniq } from "lodash"
import React from "react"
import { Animated, Dimensions, Easing, Image, NativeModules, View } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { animated, config, Spring } from "react-spring/dist/native.cjs.js"
import styled from "styled-components/native"
import Supercluster from "supercluster"

import { cityTabs } from "../City/cityTabs"
import { bucketCityResults, BucketResults, emptyBucketResults } from "./bucketCityResults"
import { CitySwitcherButton } from "./Components/CitySwitcherButton"
import { PinsShapeLayer } from "./Components/PinsShapeLayer"
import { ShowCard } from "./Components/ShowCard"
import { UserPositionButton } from "./Components/UserPositionButton"
import { EventEmitter } from "./EventEmitter"
import {
  Fair,
  MapGeoFeature,
  MapGeoFeatureCollection,
  OSCoordsUpdate,
  RelayErrorState,
  SafeAreaInsets,
  Show,
} from "./types"

const Emission = NativeModules.Emission || {}

Mapbox.setAccessToken(Emission.mapBoxAPIClientKey)

const Map = styled(Mapbox.MapView)`
  height: ${Dimensions.get("window").height};
  width: 100%;
`
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
  userLocation?: { lat: number; lng: number }
  /** True when we know that we can get location updates from the OS */
  trackUserLocation?: boolean
  /** A set of GeoJSON features, which right now is our show clusters */
  featureCollection: MapGeoFeatureCollection
  /** Has the map fully rendered? */
  mapLoaded: boolean
  /** In the process of saving a show */
  isSavingShow: boolean
  /** Cluster map data used to populate selected cluster annotation */
  nearestFeature: MapGeoFeature
  /** Cluster map data used currently in view window */
  activePin: MapGeoFeature
  /** Current map zoom level */
  currentZoom: number
}

export const ArtsyMapStyleURL = "mapbox://styles/artsyit/cjrb59mjb2tsq2tqxl17pfoak"

const DefaultZoomLevel = 11
const MinZoomLevel = 9
const MaxZoomLevel = 17.5

const ButtonAnimation = {
  yDelta: -200,
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

@screenTrack<Props>(props => {
  return {
    context_screen: Schema.PageNames.CityGuideMap,
    context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
    context_screen_owner_slug: props.citySlug,
    context_screen_owner_id: props.citySlug,
  }
})
export class GlobalMap extends React.Component<Props, State> {
  /** Makes sure we're consistently using { lat, lng } internally */
  static lngLatArrayToLocation(arr: [number, number] | undefined) {
    if (!arr || arr.length !== 2) {
      return undefined
    }
    return { lng: arr[0], lat: arr[1] }
  }

  /** Makes sure we're consistently using { lat, lng } internally */
  static longCoordsToLocation(coords: { longitude: number; latitude: number }) {
    return { lat: coords.latitude, lng: coords.longitude }
  }

  map: Mapbox.MapView
  clusterEngine: Supercluster
  featureCollection: MapGeoFeatureCollection
  moveButtons: Animated.Value
  currentZoom: number

  shows: { [id: string]: Show } = {}
  fairs: { [id: string]: Fair } = {}

  stylesheet = Mapbox.StyleSheet.create({
    singleShow: {
      iconImage: Mapbox.StyleSheet.identity("icon"),
      iconSize: 0.8,
    },

    clusteredPoints: {
      circlePitchAlignment: "map",
      circleColor: "black",

      circleRadius: Mapbox.StyleSheet.source(
        [[0, 15], [5, 20], [30, 30]],
        "point_count",
        Mapbox.InterpolationMode.Exponential
      ),
    },

    clusterCount: {
      textField: "{point_count}",
      textSize: 14,
      textColor: "white",
      textFont: ["Unica77 LL Medium"],
      textPitchAlignment: "map",
    },
  })

  constructor(props) {
    super(props)

    const currentLocation = this.props.initialCoordinates || get(this.props, "viewer.city.coordinates")
    this.state = {
      activeShows: [],
      activeIndex: 0,
      currentLocation,
      bucketResults: emptyBucketResults,
      trackUserLocation: false,
      featureCollection: undefined,
      mapLoaded: false,
      isSavingShow: false,
      nearestFeature: null,
      activePin: null,
      currentZoom: DefaultZoomLevel,
    }

    this.clusterEngine = new Supercluster({
      radius: 50,
      minZoom: Math.floor(MinZoomLevel),
      maxZoom: Math.floor(MaxZoomLevel),
    })

    this.updateShowIdMap()
    this.updateClusterMap(false)
  }

  handleFilterChange = activeIndex => {
    this.setState({ activeIndex, activePin: null, activeShows: [] }, () => this.emitFilteredBucketResults())
  }

  componentDidMount() {
    EventEmitter.subscribe("filters:change", this.handleFilterChange)
  }

  componentWillUnmount() {
    EventEmitter.unsubscribe("filters:change", this.handleFilterChange)
  }

  componentWillReceiveProps(nextProps: Props) {
    const { citySlug, relayErrorState } = this.props

    if (citySlug && citySlug !== nextProps.citySlug) {
      // Reset zoom level after switching cities
      setTimeout(() => this.map.zoomTo(DefaultZoomLevel, 100), 500)
    }

    if (nextProps.viewer) {
      const bucketResults = bucketCityResults(nextProps.viewer)

      this.setState({ bucketResults }, () => {
        this.emitFilteredBucketResults()
        this.updateShowIdMap()
        this.updateClusterMap()
      })
    } else if (relayErrorState) {
      EventEmitter.dispatch("map:error", { relayErrorState })
    }

    if (nextProps.hideMapButtons !== this.props.hideMapButtons) {
      if (nextProps.hideMapButtons) {
        this.moveButtons = new Animated.Value(0)
        Animated.timing(this.moveButtons, {
          toValue: ButtonAnimation.yDelta,
          duration: ButtonAnimation.duration,
          easing: ButtonAnimation.easing.moveOut,
          useNativeDriver: true,
        }).start()
      } else {
        this.moveButtons = new Animated.Value(ButtonAnimation.yDelta)
        Animated.timing(this.moveButtons, {
          toValue: 0,
          duration: ButtonAnimation.duration,
          easing: ButtonAnimation.easing.moveIn,
          useNativeDriver: true,
        }).start()
      }
    }
  }

  @track((__, _, args) => {
    const actionName = args[0]
    const show = args[1]
    const type = args[2]
    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Tap,
      owner_id: !!show ? show[0]._id : "",
      owner_slug: !!show ? show[0].id : "",
      owner_type: !!type ? type : "",
    } as any
  })
  trackPinTap(_actionName, _show, _type) {
    return null
  }

  updateClusterMap(updateState: boolean = true) {
    if (!this.props.viewer) {
      return
    }

    const tab = cityTabs[this.state.activeIndex]
    const shows = tab.getShows(this.state.bucketResults)
    const fairs = tab.getFairs(this.state.bucketResults)

    const showData = showsToGeoCityShow(shows)
    const fairData = fairToGeoCityFairs(fairs)

    const data = showData.concat((fairData as any) as Show[])
    const geoJSONFeature = convertCityToGeoJSON(data)

    this.featureCollection = geoJSONFeature

    if (updateState) {
      this.setState({
        featureCollection: geoJSONFeature,
      })
    }

    // close but not enough yet
    this.clusterEngine.load(this.featureCollection.features as any)
  }

  emitFilteredBucketResults() {
    if (!this.props.viewer) {
      return
    }

    // TODO: map region filtering can live here.
    const filter = cityTabs[this.state.activeIndex]
    const {
      city: { name: cityName, slug: citySlug, sponsoredContent },
    } = this.props.viewer

    this.updateClusterMap(true)

    EventEmitter.dispatch("map:change", {
      filter,
      buckets: this.state.bucketResults,
      cityName,
      citySlug,
      sponsoredContent,
      relay: this.props.relay,
    })
  }

  updateShowIdMap() {
    if (!this.props.viewer) {
      return
    }

    const { city } = this.props.viewer
    if (city) {
      const savedUpcomingShows = city.upcomingShows.edges.filter(e => e.node.is_followed === true)
      const shows = city.shows.edges
      const concatedShows = uniq(shows.concat(savedUpcomingShows))

      concatedShows.forEach(({ node }) => {
        if (!node || !node.location || !node.location.coordinates) {
          return null
        }

        this.shows[node.id] = node
      })

      city.fairs.edges.forEach(({ node }) => {
        if (!node || !node.location || !node.location.coordinates) {
          return null
        }

        this.fairs[node.id] = {
          ...node,
          type: "Fair",
        }
      })
    }
  }

  renderSelectedPin() {
    const { activeShows, activePin } = this.state
    const {
      properties: { cluster, type },
    } = activePin

    if (cluster) {
      const {
        nearestFeature: { properties, geometry },
      } = this.state
      const [clusterLat, clusterLng] = geometry.coordinates

      const clusterId = properties.cluster_id.toString()
      let pointCount = properties.point_count

      const width = pointCount < 3 ? 35 : pointCount < 21 ? 50 : 60
      const height = pointCount < 3 ? 35 : pointCount < 21 ? 50 : 60
      pointCount = pointCount.toString()

      return (
        clusterId &&
        clusterLat &&
        clusterLng &&
        pointCount && (
          <Mapbox.PointAnnotation key={clusterId} id={clusterId} selected={true} coordinate={[clusterLat, clusterLng]}>
            <SelectedCluster width={width} height={height}>
              <Sans size="3" weight="medium" color={color("white100")}>
                {pointCount}
              </Sans>
            </SelectedCluster>
          </Mapbox.PointAnnotation>
        )
      )
    }

    const item = activeShows[0]

    if (!item || !item.location) {
      return null
    }

    const lat = item.location.coordinates.lat
    const lng = item.location.coordinates.lng
    const id = item.id

    if (type === "Fair") {
      return (
        lat &&
        lng &&
        id && (
          <Mapbox.PointAnnotation key={id} id={id} coordinate={[lng, lat]}>
            <PinFairSelected />
          </Mapbox.PointAnnotation>
        )
      )
    } else if (type === "Show") {
      const isSaved = (item as Show).is_followed

      return (
        lat &&
        lng &&
        id && (
          <Mapbox.PointAnnotation key={id} id={id} selected={true} coordinate={[lng, lat]}>
            {isSaved ? (
              <PinSavedSelected pinHeight={45} pinWidth={45} />
            ) : (
              <Pin pinHeight={45} pinWidth={45} selected={true} />
            )}
          </Mapbox.PointAnnotation>
        )
      )
    }
  }

  renderShowCard() {
    const { activeShows } = this.state
    const hasShows = activeShows.length > 0

    // Check if it's an iPhone with ears (iPhone X, Xr, Xs, etc...)
    const iPhoneHasEars = this.props.safeAreaInsets.top > 20

    // We need to update activeShows in case of a mutation (save show)
    const updatedShows: Array<Fair | Show> = activeShows.map((item: any) => {
      if (item.type === "Show") {
        return this.shows[item.id]
      } else if (item.type === "Fair") {
        return this.fairs[item.id]
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
        {({ bottom, opacity }) => (
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
              {hasShows && (
                <ShowCard
                  shows={updatedShows as any}
                  relay={this.props.relay}
                  onSaveStarted={() => {
                    this.setState({ isSavingShow: true })
                  }}
                  onSaveEnded={() => {
                    this.setState({ isSavingShow: false })
                  }}
                />
              )}
            </Theme>
          </AnimatedView>
        )}
      </Spring>
    )
  }

  onRegionIsChanging = async () => {
    const zoom = Math.floor(await this.map.getZoom())

    if (!this.currentZoom) {
      this.currentZoom = zoom
    }

    if (this.currentZoom !== zoom) {
      this.setState({
        activePin: null,
      })
    }
  }

  onRegionDidChange = (location: MapGeoFeature) => {
    this.setState({
      trackUserLocation: false,
      currentLocation: GlobalMap.lngLatArrayToLocation(location.geometry && location.geometry.coordinates),
    })
  }

  onUserLocationUpdate = (location: OSCoordsUpdate) => {
    this.setState({
      userLocation: location.coords && GlobalMap.longCoordsToLocation(location.coords),
      currentLocation: location.coords && GlobalMap.longCoordsToLocation(location.coords),
      trackUserLocation: true,
    })
  }

  onDidFinishRenderingMapFully = () => {
    NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryMapHasRendered", {})
    this.setState({ mapLoaded: true })
  }

  onPressMap = () => {
    if (!this.state.isSavingShow) {
      this.setState({
        activeShows: [],
        activePin: null,
      })
    }
  }

  onPressCitySwitcherButton = () => {
    this.setState({
      activeShows: [],
      activePin: null,
    })
  }

  onPressUserPositionButton = () => {
    const { lat, lng } = this.state.userLocation
    this.map.moveTo([lng, lat], 500)
  }

  onPressPinShapeLayer = e => this.handleFeaturePress(e.nativeEvent)

  storeMapRef = (c: any) => {
    if (c) {
      this.map = c.root
    }
  }

  render() {
    const city = get(this.props, "viewer.city")
    const { relayErrorState } = this.props
    const { lat: centerLat, lng: centerLng } = this.props.initialCoordinates || get(city, "coordinates")
    const { mapLoaded, activeShows, activePin } = this.state

    const mapProps = {
      showUserLocation: true,
      styleURL: ArtsyMapStyleURL,
      userTrackingMode: Mapbox.UserTrackingModes.Follow,
      centerCoordinate: [centerLng, centerLat],
      zoomLevel: DefaultZoomLevel,
      minZoomLevel: MinZoomLevel,
      maxZoomLevel: MaxZoomLevel,
      logoEnabled: !!city,
      attributionEnabled: false,
      compassEnabled: false,
    }

    return (
      <Flex mb={0.5} flexDirection="column" style={{ backgroundColor: colors["gray-light"] }}>
        <LoadingScreen
          source={require("../../../../images/map-bg.png")}
          resizeMode="cover"
          style={{ ...this.backgroundImageSize }}
        />
        <TopButtonsContainer style={{ top: this.props.safeAreaInsets.top }}>
          <Animated.View style={this.moveButtons && { transform: [{ translateY: this.moveButtons }] }}>
            <Flex flexDirection="row" justifyContent="flex-start" alignContent="flex-start" px={3} pt={1}>
              <CitySwitcherButton
                sponsoredContentUrl={this.props.viewer && this.props.viewer.city.sponsoredContent.artGuideUrl}
                city={city}
                isLoading={!city && !(relayErrorState && !relayErrorState.isRetrying)}
                onPress={this.onPressCitySwitcherButton}
              />
              {this.state.userLocation && (
                <Box style={{ marginLeft: "auto" }}>
                  <UserPositionButton
                    highlight={this.state.userLocation === this.state.currentLocation}
                    onPress={this.onPressUserPositionButton}
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
          {({ opacity }) => (
            <AnimatedView style={{ flex: 1, opacity }}>
              <Map
                {...mapProps}
                onRegionIsChanging={this.onRegionIsChanging}
                onRegionDidChange={this.onRegionDidChange}
                onUserLocationUpdate={this.onUserLocationUpdate}
                onDidFinishRenderingMapFully={this.onDidFinishRenderingMapFully}
                onPress={this.onPressMap}
                ref={this.storeMapRef}
              >
                {city && (
                  <>
                    {this.featureCollection && (
                      <PinsShapeLayer featureCollection={this.featureCollection} onPress={this.onPressPinShapeLayer} />
                    )}
                    <ShowCardContainer>{this.renderShowCard()}</ShowCardContainer>
                    {mapLoaded && activeShows && activePin && this.renderSelectedPin()}
                  </>
                )}
              </Map>
            </AnimatedView>
          )}
        </Spring>
      </Flex>
    )
  }

  get backgroundImageSize() {
    const { width, height } = Dimensions.get("window")
    return {
      width,
      height,
    }
  }

  /**
   * This function is complicated, because the work we have to do is tricky.
   * What's happening is that we have to replicate a subset of the map's clustering algorithm to get
   * access to the shows that the user has tapped on.
   */
  async handleFeaturePress(nativeEvent: any) {
    const {
      payload: {
        properties: { id, cluster, type },
        geometry: { coordinates },
      },
    } = nativeEvent

    this.updateDrawerPosition(DrawerPosition.collapsed)

    let activeShows: Array<Fair | Show> = []

    // If the user only taps on the pin we can use the
    // id directly to retrieve the corresponding show
    // @TODO: Adding active Fairs to state only to handle Selecting Fairs
    // The rest of the logic for displaying active show shows and fairs in the
    // maps pins and cards will remain the same for now.
    if (!cluster) {
      if (type === "Show") {
        activeShows = [this.shows[id]]
        this.trackPinTap(Schema.ActionNames.SingleMapPin, activeShows, Schema.OwnerEntityTypes.Show)
      } else if (type === "Fair") {
        activeShows = [this.fairs[id]]
        this.trackPinTap(Schema.ActionNames.SingleMapPin, activeShows, Schema.OwnerEntityTypes.Fair)
      }
    }

    // Otherwise the logic is as follows
    // We use our clusterEngine which is map of our clusters
    // 1. Fetch all features (pins, clusters) based on the current map visible bounds
    // 2. Sort them by distance to the user tap coordinates
    // 3. Retrieve points within the cluster and map them back to shows
    else {
      this.trackPinTap(Schema.ActionNames.ClusteredMapPin, null, Schema.OwnerEntityTypes.Show)
      // Get map zoom level and coordinates of where the user tapped
      const zoom = Math.floor(await this.map.getZoom())
      const [lat, lng] = coordinates

      // Get coordinates of the map's current viewport bounds
      const visibleBounds = await this.map.getVisibleBounds()
      const [ne, sw] = visibleBounds
      const [eastLng, northLat] = ne
      const [westLng, southLat] = sw

      const visibleFeatures = this.clusterEngine.getClusters([westLng, southLat, eastLng, northLat], zoom)
      const nearestFeature = this.getNearestPointToLatLongInCollection({ lat, lng }, visibleFeatures)
      const points = this.clusterEngine.getLeaves(nearestFeature.properties.cluster_id, Infinity)
      activeShows = points.map(a => a.properties) as any
      this.setState({
        nearestFeature,
      })
    }

    this.setState({
      activeShows,
      activePin: nativeEvent.payload,
    })
  }

  getNearestPointToLatLongInCollection(values: { lat: number; lng: number }, features: any[]) {
    // https://stackoverflow.com/a/21623206
    function distance(lat1, lon1, lat2, lon2) {
      const p = 0.017453292519943295 // Math.PI / 180
      const c = Math.cos
      const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2

      return 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
    }

    const distances = features
      .map(feature => {
        const [featureLat, featureLng] = feature.geometry.coordinates
        return {
          ...feature,
          distance: distance(values.lat, values.lng, featureLat, featureLng),
        }
      })
      .sort((a, b) => a.distance - b.distance)

    return distances[0]
  }

  updateDrawerPosition(position: DrawerPosition) {
    const notificationName = "ARLocalDiscoveryUpdateDrawerPosition"
    NativeModules.ARNotificationsManager.postNotificationName(notificationName, {
      position,
    })
  }
}

const SelectedCluster = styled(Flex)`
  background-color: ${colors["purple-regular"]};
  border-radius: 60;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const GlobalMapContainer = createFragmentContainer(
  GlobalMap,
  graphql`
    fragment GlobalMap_viewer on Viewer @argumentDefinitions(citySlug: { type: "String!" }, maxInt: { type: "Int!" }) {
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
            id
            _id
            __id
            name
            status
            isStubShow
            href
            is_followed
            exhibition_period
            cover_image {
              url
            }
            location {
              coordinates {
                lat
                lng
              }
            }
            type
            start_at
            end_at
            partner {
              ... on Partner {
                name
                type
              }
            }
          }
          shows(first: 1, sort: START_AT_ASC) {
            totalCount
          }
        }
        upcomingShows: shows(
          includeStubShows: true
          status: UPCOMING
          dayThreshold: 30
          first: $maxInt
          sort: START_AT_ASC
        ) {
          edges {
            node {
              id
              _id
              __id
              isStubShow
              name
              status
              href
              is_followed
              exhibition_period
              cover_image {
                url
              }
              location {
                coordinates {
                  lat
                  lng
                }
              }
              type
              start_at
              end_at
              partner {
                ... on Partner {
                  name
                  type
                }
              }
            }
          }
        }

        shows(includeStubShows: true, status: RUNNING, first: $maxInt, sort: PARTNER_ASC) {
          edges {
            node {
              id
              _id
              __id
              isStubShow
              name
              status
              href
              is_followed
              exhibition_period
              cover_image {
                url
              }
              location {
                coordinates {
                  lat
                  lng
                }
              }
              type
              start_at
              end_at
              partner {
                ... on Partner {
                  name
                  type
                  profile {
                    # This is only used for stubbed shows
                    image {
                      url(version: "square")
                    }
                  }
                }
              }
            }
          }
        }

        fairs(first: $maxInt, status: CURRENT, sort: START_AT_ASC) {
          edges {
            node {
              id
              name
              exhibition_period
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
                image_url
                aspect_ratio
                url
              }

              profile {
                icon {
                  id
                  href
                  height
                  width
                  url(version: "square140")
                }
                __id
                id
                name
              }

              start_at
              end_at
            }
          }
        }
      }
    }
  `
)
