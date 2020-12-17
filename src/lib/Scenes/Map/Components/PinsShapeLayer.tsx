import MapboxGL, { CircleLayerStyle, ShapeSourceProps, SymbolLayerStyle } from "@react-native-mapbox-gl/maps"
import React, { useEffect, useRef, useState } from "react"
import { Animated, StyleProp } from "react-native"
import { BucketKey } from "../bucketCityResults"
import { FilterData } from "../types"

interface Props {
  featureCollections: { [key in BucketKey]: FilterData }
  onPress?: ShapeSourceProps["onPress"]
  duration?: number
  filterID: BucketKey
}

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

export const PinsShapeLayer: React.FC<Props> = ({ duration = 300, ...props }) => {
  const [rendered, setRendered] = useState(false)
  const pinOpacity = useRef(new Animated.Value(0)).current
  const clusterOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    fadeInAnimations()
  }, [])

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { filterID } = this.props

    const getFeatures = (props: Props) =>
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      props.featureCollections[filterID].featureCollection.features.map((g) => g.is_followed)

    return (
      !isEqual(getFeatures(nextProps), getFeatures(this.props)) ||
      this.state.rendered !== nextState.rendered ||
      this.props.filterID !== nextProps.filterID
    )
  const fadeInAnimations = () => {
    setRendered(true)
    Animated.timing(pinOpacity, {
      toValue: 1,
      duration,
      // mapbox opacities are not animatable with native driver for some reason
      useNativeDriver: false,
    }).start()

    Animated.timing(clusterOpacity, {
      toValue: 1,
      duration,
      // mapbox opacities are not animatable with native driver for some reason
      useNativeDriver: false,
    }).start()
  }

  const { featureCollections, filterID } = props
  if (Object.keys(featureCollections).length === 0) {
    return null
  }
  const collection = featureCollections[filterID].featureCollection

  return (
    <MapboxGL.Animated.ShapeSource
      id="shows"
      shape={collection}
      cluster
      clusterRadius={50}
      clusterMaxZoomLevel={14}
      onPress={props.onPress}
    >
      <MapboxGL.Animated.SymbolLayer
        id="singleShow"
        filter={["!", ["has", "point_count"]]}
        // @ts-ignore
        style={[singleShowStyle, { iconOpacity: pinOpacity }]}
      />
      <MapboxGL.Animated.SymbolLayer id="pointCount" style={clusterCountStyle} />
      <MapboxGL.Animated.CircleLayer
        id="clusteredPoints"
        belowLayerID="pointCount"
        filter={["has", "point_count"]}
        // @ts-ignore
        style={[clusteredPointsStyle, { circleOpacity: clusterOpacity }]}
      />
    </MapboxGL.Animated.ShapeSource>
  )
}

