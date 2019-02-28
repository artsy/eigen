import { Box, Flex } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import React from "react"
import { Animated, Dimensions, NativeModules, SafeAreaView } from "react-native"
import { createRefetchContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"

import { Pin } from "lib/Icons/Pin"
import { bucketCityResults, BucketResults } from "./Bucket"
import { CitySwitcherButton } from "./Components/CitySwitcherButton"
import { UserPositionButton } from "./Components/UserPositionButton"
import { EventEmitter } from "./EventEmitter"
import { Tab } from "./types"

const Emission = NativeModules.Emission || {}

Mapbox.setAccessToken(Emission.mapBoxAPIClientKey)

const Map = styled(Mapbox.MapView)`
  height: ${Dimensions.get("window").height};
  width: 100%;
`
interface Props {
  initialCoordinates?: { lat: number; lng: number }
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

export class GlobalMap extends React.Component<Props, State> {
  map: Mapbox.MapView
  scaleIn: Animated.Value
  scaleOut: Animated.Value

  filters: Tab[] = [
    { id: "all", text: "All" },
    { id: "saved", text: "Saved" },
    { id: "fairs", text: "Fairs" },
    { id: "galleries", text: "Galleries" },
    { id: "museums", text: "Museums" },
  ]

  stylesheet = Mapbox.StyleSheet.create({
    symbol: {
      iconImage: "pin",
      iconSize: Mapbox.StyleSheet.composite(
        {
          0: [0, 0],
          5: [0.5, 0.5],
          12: [1, 1],
        },
        "",
        Mapbox.InterpolationMode.Exponential
      ),
      iconAllowOverlap: true,
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
  }

  componentDidMount() {
    EventEmitter.subscribe("filters:change", activeIndex =>
      this.setState({ activeIndex }, () => this.emitFilteredBucketResults())
    )
  }

  componentWillReceiveProps() {
    this.emitFilteredBucketResults()
  }

  emitFilteredBucketResults() {
    // TODO: map region filtering can live here.
    const filter = this.filters[this.state.activeIndex]
    EventEmitter.dispatch("map:change", { filter, buckets: this.state.bucketResults, relay: this.props.relay })
  }

  onAnnotationSelected(showID: string, feature) {
    if (this.state.activeShowID === showID) {
      return
    }
    const previousShowID = this.state.activeShowID
    this.scaleIn = new Animated.Value(0.6)

    Animated.timing(this.scaleIn, { toValue: 1.0, duration: 200 }).start()
    this.setState({ activeShowID: showID })

    if (previousShowID !== showID) {
      this.map.moveTo(feature.geometry.coordinates, 500)
    }
  }

  onAnnotationDeselected(showID: string) {
    const nextState: State = { activeIndex: this.state.activeIndex, bucketResults: this.state.bucketResults }

    if (this.state.activeShowID === showID) {
      nextState.activeShowID = null
    }

    this.scaleOut = new Animated.Value(1)
    Animated.timing(this.scaleOut, { toValue: 0.6, duration: 200 }).start()
    this.setState(nextState)
  }

  renderAnnotations() {
    const { city } = this.props.viewer
    return !!city
      ? city.shows.edges
          .map(({ node }) => {
            if (!node || !node.location || !node.location.coordinates) {
              return null
            }

            const { id, location } = node
            const { lat, lng } = location.coordinates
            const selected = id === this.state.activeShowID
            const animationStyle = selected
              ? {
                  transform: [{ scale: this.scaleIn }],
                }
              : {}

            return (
              <Mapbox.PointAnnotation
                key={id}
                id={id}
                selected={selected}
                onSelected={feature => this.onAnnotationSelected(id, feature)}
                onDeselected={() => this.onAnnotationDeselected(id)}
                coordinate={[lng, lat]}
              >
                <Animated.View style={[animationStyle]}>
                  <Pin selected={selected} />
                </Animated.View>
              </Mapbox.PointAnnotation>
            )
          })
          .filter(Boolean)
      : []
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
          attributionEnabled={false}
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
        >
          <SafeAreaView style={{ flex: 1 }}>
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
          </SafeAreaView>
          {this.renderAnnotations()}
        </Map>
      </Flex>
    )
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
