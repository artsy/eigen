import MapboxGL, { CircleLayerStyle, ShapeSource, SymbolLayerStyle } from "@rnmapbox/maps"
import { BucketKey } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { ClusterRadius } from "app/Scenes/CityGuide/utils/mapZoomLevels"
import { FilterData } from "app/Scenes/CityGuide/utils/types"
import { memo, RefObject } from "react"
import { StyleProp } from "react-native"

const SELECTED_CLUSTER_COLOR = "#6E1EFF"

const CLUSTER_CIRCLE_RADIUS = 28
interface Props {
  featureCollections: { [key in BucketKey]: FilterData } | {}
  onPress?: (event: any) => void
  duration?: number
  filterID: string
  activePinSlug?: string | null
  activeClusterId?: number | null
  /** Lets the map ask Mapbox which points a tapped cluster contains. */
  shapeSourceRef?: RefObject<ShapeSource | null>
}

export const CityGuideMapPins: React.FC<Props> = memo(
  ({ featureCollections, onPress, filterID, activePinSlug, activeClusterId, shapeSourceRef }) => {
    const singleShowStyle: StyleProp<SymbolLayerStyle> = {
      iconImage: activePinSlug
        ? [
            "case",
            ["==", ["get", "slug"], activePinSlug],
            ["concat", ["get", "icon"], "-selected"],
            ["get", "icon"],
          ]
        : ["get", "icon"],
      iconSize: 0.7,
    }

    const clusteredPointsStyle: StyleProp<CircleLayerStyle> = {
      circlePitchAlignment: "map",
      // Recolor the tapped cluster's own circle instead of drawing a highlight on top of it.
      circleColor:
        activeClusterId != null
          ? [
              "case",
              ["==", ["get", "cluster_id"], activeClusterId],
              SELECTED_CLUSTER_COLOR,
              "black",
            ]
          : "black",

      // prettier-ignore
      circleRadius: [
            "step",
            ["get", "point_count"],
                CLUSTER_CIRCLE_RADIUS / 2,
             CLUSTER_CIRCLE_RADIUS / 3, CLUSTER_CIRCLE_RADIUS * 2 / 3,
            CLUSTER_CIRCLE_RADIUS, CLUSTER_CIRCLE_RADIUS,
          ],
    }

    const clusterCountStyle: StyleProp<SymbolLayerStyle> = {
      textField: "{point_count}",
      textSize: 14,
      textColor: "white",
      textFont: ["Unica77 LL Medium"],
      textPitchAlignment: "map",
    }

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const collection: MapGeoFeatureCollection = featureCollections[filterID].featureCollection

    return (
      <MapboxGL.ShapeSource
        ref={shapeSourceRef}
        id="shows"
        shape={collection}
        cluster
        clusterRadius={ClusterRadius}
        onPress={onPress}
      >
        <MapboxGL.SymbolLayer
          id="singleShow"
          filter={["!", ["has", "point_count"]]}
          style={singleShowStyle}
        />
        <MapboxGL.SymbolLayer id="pointCount" style={clusterCountStyle} />
        <MapboxGL.CircleLayer
          id="clusteredPoints"
          belowLayerID="pointCount"
          filter={["has", "point_count"]}
          style={clusteredPointsStyle}
        />
      </MapboxGL.ShapeSource>
    )
  }
)
