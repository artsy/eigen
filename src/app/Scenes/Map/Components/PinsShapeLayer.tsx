import MapboxGL, { CircleLayerStyle, SymbolLayerStyle } from "@rnmapbox/maps"
import { BucketKey } from "app/Scenes/Map/bucketCityResults"
import { FilterData } from "app/Scenes/Map/types"
import { memo } from "react"
import { StyleProp } from "react-native"

const SELECTED_CLUSTER_COLOR = "#6E1EFF"

interface Props {
  featureCollections: { [key in BucketKey]: FilterData } | {}
  onPress?: (event: any) => void
  duration?: number
  filterID: string
  activePinSlug?: string | null
  activeClusterId?: number | null
}

export const PinsShapeLayer: React.FC<Props> = memo(
  ({ featureCollections, onPress, filterID, activePinSlug, activeClusterId }) => {
    const singleShowStyle: StyleProp<SymbolLayerStyle> = {
      iconImage: activePinSlug
        ? [
            "case",
            ["==", ["get", "slug"], activePinSlug],
            ["concat", ["get", "icon"], "-selected"],
            ["get", "icon"],
          ]
        : ["get", "icon"],
      iconSize: 0.8,
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
                15,
             5, 20,
            30, 30,
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
      <MapboxGL.Animated.ShapeSource
        id="shows"
        shape={collection}
        cluster
        clusterRadius={50}
        onPress={onPress}
      >
        <MapboxGL.Animated.SymbolLayer
          id="singleShow"
          filter={["!", ["has", "point_count"]]}
          style={[singleShowStyle]}
        />
        <MapboxGL.Animated.SymbolLayer id="pointCount" style={clusterCountStyle} />
        <MapboxGL.Animated.CircleLayer
          id="clusteredPoints"
          belowLayerID="pointCount"
          filter={["has", "point_count"]}
          style={[clusteredPointsStyle]}
        />
      </MapboxGL.Animated.ShapeSource>
    )
  }
)
