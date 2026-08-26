import MapboxGL, { CircleLayerStyle, SymbolLayerStyle } from "@rnmapbox/maps"
import { ItineraryFeatureCollection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { StyleProp } from "react-native"

const circleStyle: StyleProp<CircleLayerStyle> = {
  circleRadius: 14,
  circleColor: "black",
  circleStrokeWidth: 2,
  circleStrokeColor: "white",
  circlePitchAlignment: "map",
}

const numberStyle: StyleProp<SymbolLayerStyle> = {
  textField: ["get", "number"],
  textSize: 14,
  textColor: "white",
  textFont: ["Unica77 LL Medium"],
  textPitchAlignment: "map",
  textAllowOverlap: true,
  textIgnorePlacement: true,
}

interface Props {
  /** Already filtered to the stops that should be visible. */
  collection: ItineraryFeatureCollection
}

/**
 * Renders one numbered pin per feature. Deliberately has no filter prop: layer
 * filters cannot be cleared once set, because rnmapbox maps an undefined filter to
 * `[]` (utils/filterUtils.js) rather than to a reset, so the previous filter sticks
 * on the native layer. Selecting a section and then "All" would keep showing only
 * that section. Filtering the collection instead is unambiguous, and rebuilding a
 * shape source of 5-15 points costs nothing.
 */
export const ItineraryMapPins: React.FC<Props> = ({ collection }) => {
  return (
    <MapboxGL.ShapeSource id="itineraryStops" shape={collection as any}>
      <MapboxGL.CircleLayer id="stopCircles" style={circleStyle} />
      <MapboxGL.SymbolLayer id="stopNumbers" aboveLayerID="stopCircles" style={numberStyle} />
    </MapboxGL.ShapeSource>
  )
}
