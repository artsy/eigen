import MapboxGL, { LineLayerStyle } from "@rnmapbox/maps"
import { MapRouteCollection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { StyleProp } from "react-native"

const routeStyle: StyleProp<LineLayerStyle> = {
  lineColor: "black",
  lineWidth: 2,
  lineOpacity: 0.4,
  lineCap: "round",
  lineJoin: "round",
}

/**
 * The path between a section's places, in order. Rendered under the pins so numbers stay
 * legible where the line passes beneath them. Itinerary-only — see `MapView`'s `showRoute`.
 */
export const MapRoute: React.FC<{ collection: MapRouteCollection }> = ({ collection }) => {
  if (!collection.features.length) {
    return null
  }

  return (
    <MapboxGL.ShapeSource id="mapRoute" shape={collection as any}>
      <MapboxGL.LineLayer id="mapRouteLine" style={routeStyle} belowLayerID="stopCircles" />
    </MapboxGL.ShapeSource>
  )
}
