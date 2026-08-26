import MapboxGL, { LineLayerStyle } from "@rnmapbox/maps"
import { ItineraryRouteCollection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { StyleProp } from "react-native"

const routeStyle: StyleProp<LineLayerStyle> = {
  lineColor: "black",
  lineWidth: 2,
  lineOpacity: 0.4,
  lineCap: "round",
  lineJoin: "round",
}

/**
 * The path between a section's stops, in order. Rendered under the pins so numbers stay
 * legible where the line passes beneath them.
 */
export const ItineraryMapRoute: React.FC<{ collection: ItineraryRouteCollection }> = ({
  collection,
}) => {
  if (!collection.features.length) {
    return null
  }

  return (
    <MapboxGL.ShapeSource id="itineraryRoute" shape={collection as any}>
      <MapboxGL.LineLayer id="itineraryRouteLine" style={routeStyle} belowLayerID="stopCircles" />
    </MapboxGL.ShapeSource>
  )
}
