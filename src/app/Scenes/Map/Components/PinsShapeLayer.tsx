import MapboxGL, { CircleLayerStyle, SymbolLayerStyle } from "@rnmapbox/maps"
import { OnPressEvent } from "@rnmapbox/maps/lib/typescript/src/types/OnPressEvent"
import { BucketKey } from "app/Scenes/Map/bucketCityResults"
import { FilterData } from "app/Scenes/Map/types"
import { memo, useEffect, useRef } from "react"
import { Animated, StyleProp } from "react-native"

interface Props {
  featureCollections: { [key in BucketKey]: FilterData } | {}
  onPress?: (event: OnPressEvent) => void
  duration?: number
  filterID: string
}

export const PinsShapeLayer: React.FC<Props> = memo(({ featureCollections, onPress, filterID }) => {
  const pinOpacity = useRef(new Animated.Value(0)).current
  const clusterOpacity = useRef(new Animated.Value(0)).current

  const singleShowStyle: StyleProp<SymbolLayerStyle> = {
    iconImage: ["get", "icon"],
    iconSize: 0.8,
  }

  const clusteredPointsStyle: StyleProp<CircleLayerStyle> = {
    circlePitchAlignment: "map",
    circleColor: "black",

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

  useEffect(() => {
    fadeInAnimations()
  }, [])

  const fadeInAnimations = () => {
    requestAnimationFrame(() => {
      pinOpacity.setValue(1)
      clusterOpacity.setValue(1)
    })
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
        style={[singleShowStyle, { iconOpacity: pinOpacity }]}
      />
      <MapboxGL.Animated.SymbolLayer id="pointCount" style={clusterCountStyle} />
      <MapboxGL.Animated.CircleLayer
        id="clusteredPoints"
        belowLayerID="pointCount"
        filter={["has", "point_count"]}
        style={[clusteredPointsStyle, { circleOpacity: clusterOpacity }]}
      />
    </MapboxGL.Animated.ShapeSource>
  )
})
