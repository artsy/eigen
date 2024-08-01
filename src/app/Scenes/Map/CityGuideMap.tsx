import { Flex, useTheme } from "@artsy/palette-mobile"
import MapboxGL from "@react-native-mapbox-gl/maps"
import { CityGuideMapQuery } from "__generated__/CityGuideMapQuery.graphql"
import { ArtsyMapStyleURL } from "app/Scenes/Map/GlobalMap"
import { FilterData } from "app/Scenes/Map/types"
import { convertCityToGeoJSON } from "app/utils/convertCityToGeoJSON"
import React, { useEffect, useRef } from "react"
import { Dimensions } from "react-native"
import Config from "react-native-config"
import { graphql, useLazyLoadQuery } from "react-relay"
import Supercluster from "supercluster"

MapboxGL.setAccessToken(Config.MAPBOX_API_CLIENT_KEY)

interface CityGuideMapProps {
  citySlug: string
}

export const CityGuideMap: React.FC<CityGuideMapProps> = ({ citySlug }) => {
  const data = useLazyLoadQuery<CityGuideMapQuery>(cityGuideMapQuery, {
    citySlug,
  })

  const mapRef = useRef<MapboxGL.MapView>(null)
  const cameraRef = useRef<MapboxGL.Camera>(null)

  const [pinsToRender, setPinsToRender] = React.useState<FilterData | undefined>(undefined)

  useEffect(() => {
    if (!data) {
      return
    }

    if (data.city?.shows?.edges?.length) {
      /** Add an icon field to indicate how each show should be rendered */
      const showData = data.city.shows.edges.map((edge) => {
        if (!edge?.node) {
          return null
        }

        return {
          ...edge.node,
          icon: edge.node.isFollowed ? "pin-saved" : "pin",
        }
      })

      /** Get a GeoJSON-formatted list of show locations */
      const showLocations = convertCityToGeoJSON(showData)

      /** Create a Supercluster instance to cluster show locations */
      const clusterEngine = new Supercluster({
        radius: 50,
        minZoom: Math.floor(MIN_ZOOM_LEVEL),
        maxZoom: Math.floor(MAX_ZOOM_LEVEL),
      })

      clusterEngine.load(showLocations.features)

      setPinsToRender({
        featureCollection: showLocations,
        filter: "all",
        clusterEngine,
      })
    }
  }, [data])

  const { color } = useTheme()

  return (
    <Flex mb={0.5} flexDirection="column" style={{ backgroundColor: color("black5") }}>
      <Flex flex={1}>
        <MapboxGL.MapView
          ref={mapRef}
          style={{ width: "100%", height: Dimensions.get("window").height }}
          styleURL={ArtsyMapStyleURL}
          userTrackingMode={MapboxGL.UserTrackingModes.Follow}
          logoEnabled={!!data?.city}
          attributionEnabled={false}
          compassEnabled={false}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            animationMode="flyTo"
            zoomLevel={DEFAULT_ZOOM_LEVEL}
            minZoomLevel={MIN_ZOOM_LEVEL}
            maxZoomLevel={MAX_ZOOM_LEVEL}
            centerCoordinate={[NEW_YORK_COORDINATES.lng, NEW_YORK_COORDINATES.lat]}
          />
          {!!pinsToRender && (
            <MapboxGL.Animated.ShapeSource
              id="shows"
              shape={pinsToRender.featureCollection}
              cluster
              clusterRadius={50}
            >
              <MapboxGL.Animated.SymbolLayer
                id="singleShow"
                filter={["!", ["has", "point_count"]]}
                style={{ iconImage: ["get", "icon"], iconSize: 0.8, iconOpacity: 1 }}
              />
              <MapboxGL.Animated.SymbolLayer
                id="pointCount"
                style={{
                  textField: "{point_count}",
                  textSize: 14,
                  textColor: "white",
                  textFont: ["Unica77 LL Medium"],
                  textPitchAlignment: "map",
                }}
              />
              <MapboxGL.Animated.CircleLayer
                id="clusteredPoints"
                belowLayerID="pointCount"
                filter={["has", "point_count"]}
                style={{
                  circlePitchAlignment: "map",
                  circleColor: "black",
                  circleRadius: ["step", ["get", "point_count"], 15, 5, 20, 30, 30],
                  circleOpacity: 1,
                }}
              />
            </MapboxGL.Animated.ShapeSource>
          )}
        </MapboxGL.MapView>
      </Flex>
    </Flex>
  )
}

const cityGuideMapQuery = graphql`
  query CityGuideMapQuery($citySlug: String!) {
    city(slug: $citySlug) @required(action: NONE) {
      coordinates {
        lat
        lng
      }
      shows: showsConnection(
        includeStubShows: true
        status: RUNNING
        first: 2147483647
        sort: PARTNER_ASC
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
            isFollowed
            exhibitionPeriod(format: SHORT)
            coverImage {
              url
            }
            location {
              coordinates {
                lat
                lng
              }
            }
            type
            startAt
            endAt
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
    }
  }
`

const NEW_YORK_COORDINATES = { lat: 40.713, lng: -74.006 }
const DEFAULT_ZOOM_LEVEL = 11
const MIN_ZOOM_LEVEL = 9
const MAX_ZOOM_LEVEL = 17.5
