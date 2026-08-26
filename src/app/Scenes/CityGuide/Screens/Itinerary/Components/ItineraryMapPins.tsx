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
  collection: ItineraryFeatureCollection
  /** null shows every stop. */
  selectedSectionId: string | null
}

export const ItineraryMapPins: React.FC<Props> = ({ collection, selectedSectionId }) => {
  // Filter in the layer so switching pills does not rebuild the shape source.
  const filter = selectedSectionId
    ? (["==", ["get", "sectionId"], selectedSectionId] as any)
    : undefined

  return (
    <MapboxGL.ShapeSource id="itineraryStops" shape={collection as any}>
      <MapboxGL.CircleLayer id="stopCircles" style={circleStyle} filter={filter} />
      <MapboxGL.SymbolLayer
        id="stopNumbers"
        aboveLayerID="stopCircles"
        style={numberStyle}
        filter={filter}
      />
    </MapboxGL.ShapeSource>
  )
}
