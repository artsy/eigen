import { Box, Flex, Theme } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import React from "react"
import { Animated, Dimensions, Easing, NativeModules, SafeAreaView, View } from "react-native"
import { createRefetchContainer, graphql, RelayProp } from "react-relay"
import { animated, config, Spring } from "react-spring/dist/native.cjs.js"
import styled from "styled-components/native"
import Supercluster from "supercluster"

import { convertCityToGeoJSON } from "lib/utils/convertCityToGeoJSON"
import { bucketCityResults, BucketResults } from "./Bucket"
import { CitySwitcherButton } from "./Components/CitySwitcherButton"
import { ShowCard } from "./Components/ShowCard"
import { UserPositionButton } from "./Components/UserPositionButton"
import { EventEmitter } from "./EventEmitter"
import { MapTab, Show } from "./types"

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
  height: 250;
`

interface Props {
  initialCoordinates?: { lat: number; lng: number }
  hideMapButtons: boolean
  viewer: GlobalMap_viewer
  relay: RelayProp
}
interface State {
  activeIndex: number
  activeShowID?: string
  bucketResults: BucketResults
  currentLocation?: any
  userLocation?: any
  trackUserLocation?: boolean
}

export const ArtsyMapStyleURL = "mapbox://styles/artsyit/cjrb59mjb2tsq2tqxl17pfoak"

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

export class GlobalMap extends React.Component<Props, State> {
  map: Mapbox.MapView
  clusterEngine: Supercluster
  moveButtons: Animated.Value

  filters: MapTab[] = [
    { id: "all", text: "All" },
    { id: "saved", text: "Saved" },
    { id: "fairs", text: "Fairs" },
    { id: "galleries", text: "Galleries" },
    { id: "museums", text: "Museums" },
  ]
  shows: { [id: string]: Show } = {}
  featureCollection: any

  stylesheet = Mapbox.StyleSheet.create({
    singleShow: {
      iconImage: "pin",
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

    const currentLocation = this.props.initialCoordinates || this.props.viewer.city.coordinates
    const bucketResults = bucketCityResults(props.viewer)
    this.state = {
      activeIndex: 0,
      currentLocation,
      bucketResults,
      trackUserLocation: false,
    }

    this.updateShowIdMap()
    this.generateClusterMap()
  }

  componentDidMount() {
    EventEmitter.subscribe("filters:change", activeIndex =>
      this.setState({ activeIndex }, () => this.emitFilteredBucketResults())
    )
  }

  componentWillReceiveProps(nextProps: Props) {
    this.emitFilteredBucketResults()
    this.updateShowIdMap()
    this.generateClusterMap()

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

  generateClusterMap() {
    const { city } = this.props.viewer
    this.featureCollection = convertCityToGeoJSON(city.shows.edges.filter(({ node }) => node.type === "Show"))
    this.clusterEngine = new Supercluster({
      radius: 50,
      maxZoom: 13,
    })
    this.clusterEngine.load(this.featureCollection)
  }

  emitFilteredBucketResults() {
    // TODO: map region filtering can live here.
    const filter = this.filters[this.state.activeIndex]
    const {
      city: { name: cityName },
    } = this.props.viewer
    EventEmitter.dispatch("map:change", {
      filter,
      buckets: this.state.bucketResults,
      cityName,
      relay: this.props.relay,
    })
  }

  updateShowIdMap() {
    const { city } = this.props.viewer
    if (city) {
      city.shows.edges.forEach(({ node }) => {
        if (!node || !node.location || !node.location.coordinates) {
          return null
        }

        this.shows[node.id] = node
      })
    }
  }

  renderShowCard() {
    const id = this.state.activeShowID
    const show = this.shows[id]

    return (
      <Spring
        native
        from={{ bottom: -150, progress: 0, opacity: 0 }}
        to={!!id ? { bottom: 0, progress: 1, opacity: 1.0 } : { bottom: -150, progress: 0, opacity: 0 }}
        config={config.stiff}
        precision={1}
      >
        {({ bottom, opacity }) => (
          <AnimatedView
            style={{
              bottom,
              left: 0,
              right: 0,
              height: 106,
              opacity,
            }}
          >
            <Theme>
              <ShowCard show={show as any} />
            </Theme>
          </AnimatedView>
        )}
      </Spring>
    )
  }

  render() {
    const { city } = this.props.viewer
    const { lat: centerLat, lng: centerLng } = this.props.initialCoordinates || city.coordinates

    return (
      <Flex mb={0.5} flexDirection="column">
        <Map
          ref={(c: any) => {
            if (c) {
              this.map = c.root
            }
          }}
          showUserLocation={true}
          styleURL={ArtsyMapStyleURL}
          userTrackingMode={Mapbox.UserTrackingModes.Follow}
          centerCoordinate={[centerLng, centerLat]}
          zoomLevel={13}
          logoEnabled={false}
          attributionEnabled={true}
          onRegionDidChange={location => {
            this.emitFilteredBucketResults()
            this.setState({
              trackUserLocation: false,
              currentLocation: location.geometry.coordinate,
            })
          }}
          onUserLocationUpdate={location => {
            this.setState({
              userLocation: location,
              currentLocation: location,
              trackUserLocation: true,
            })
          }}
          onPress={() => {
            this.setState({
              activeShowID: null,
            })
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <Animated.View style={this.moveButtons && { transform: [{ translateY: this.moveButtons }] }}>
              <Flex flexDirection="row" justifyContent="flex-start" alignContent="flex-start" px={3} pt={1}>
                <CitySwitcherButton city={city} />
                <Box style={{ marginLeft: "auto" }}>
                  <UserPositionButton
                    highlight={this.state.userLocation === this.state.currentLocation}
                    onPress={() => {
                      const { latitude, longitude } = this.state.userLocation.coords
                      this.map.moveTo([longitude, latitude], 500)
                    }}
                  />
                </Box>
              </Flex>
            </Animated.View>
            <ShowCardContainer>{this.renderShowCard()}</ShowCardContainer>
          </SafeAreaView>
          <Mapbox.ShapeSource
            id="shows"
            shape={this.featureCollection}
            cluster
            clusterRadius={50}
            clusterMaxZoom={14}
            onPress={async ({ nativeEvent }) => {
              await this.handleFeaturePress(nativeEvent)
            }}
          >
            <Mapbox.SymbolLayer id="singleShow" filter={["!has", "point_count"]} style={this.stylesheet.singleShow} />
            <Mapbox.SymbolLayer id="pointCount" style={this.stylesheet.clusterCount} />

            <Mapbox.CircleLayer
              id="clusteredPoints"
              belowLayerID="pointCount"
              filter={["has", "point_count"]}
              style={this.stylesheet.clusteredPoints}
            />
          </Mapbox.ShapeSource>
        </Map>
      </Flex>
    )
  }

  async handleFeaturePress(nativeEvent: any) {
    const {
      payload: {
        properties: { id },
      },
    } = nativeEvent

    this.updateDrawerPosition(DrawerPosition.collapsed)

    this.setState({
      activeShowID: id,
    })

    // TODO: finish setting getting points (shows) within a cluster
    // In order to show multiple cards in scroll view when a user taps
    // on a cluster
  }

  updateDrawerPosition(position: DrawerPosition) {
    const notificationName = "ARLocalDiscoveryUpdateDrawerPosition"
    NativeModules.ARNotificationsManager.postNotificationName(notificationName, {
      position,
    })
  }
}

export const GlobalMapContainer = createRefetchContainer(
  GlobalMap,
  graphql`
    fragment GlobalMap_viewer on Viewer @argumentDefinitions(near: { type: "Near!" }) {
      city(near: $near) {
        name
        coordinates {
          lat
          lng
        }

        shows(discoverable: true, first: 50, sort: START_AT_ASC) {
          edges {
            node {
              id
              _id
              __id
              name
              status
              href
              is_followed
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
                ... on ExternalPartner {
                  name
                }
              }
            }
          }
        }

        fairs(first: 10) {
          edges {
            node {
              id
              name

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
  `,
  graphql`
    query GlobalMapRefetchQuery($near: Near) {
      viewer {
        ...GlobalMap_viewer @arguments(near: $near)
      }
    }
  `
)
