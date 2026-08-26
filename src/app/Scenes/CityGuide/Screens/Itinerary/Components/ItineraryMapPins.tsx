import MapboxGL, { CircleLayerStyle, SymbolLayerStyle } from "@rnmapbox/maps"
import { ItineraryFeatureCollection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { StyleProp } from "react-native"

/** Same highlight the City Guide map uses for a tapped pin (CityGuideMapPins.tsx:8). */
const SELECTED_PIN_COLOR = "#6E1EFF"
const PIN_COLOR = "black"

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
  selectedStopId: string | null
  onSelectStop: (stopId: string) => void
}

/**
 * Renders one numbered pin per feature. Deliberately has no filter prop: layer
 * filters cannot be cleared once set, because rnmapbox maps an undefined filter to
 * `[]` (utils/filterUtils.js) rather than to a reset, so the previous filter sticks
 * on the native layer. Selecting a section and then "All" would keep showing only
 * that section. Filtering the collection instead is unambiguous, and rebuilding a
 * shape source of 5-15 points costs nothing.
 */
export const ItineraryMapPins: React.FC<Props> = ({ collection, selectedStopId, onSelectStop }) => {
  const circleStyle: StyleProp<CircleLayerStyle> = {
    circleRadius: 14,
    // Recolour the tapped pin itself rather than drawing a highlight over it, matching
    // how the City Guide map treats its selected cluster.
    circleColor: selectedStopId
      ? ["case", ["==", ["get", "id"], selectedStopId], SELECTED_PIN_COLOR, PIN_COLOR]
      : PIN_COLOR,
    circleStrokeWidth: 2,
    circleStrokeColor: "white",
    circlePitchAlignment: "map",
  }

  return (
    <MapboxGL.ShapeSource
      id="itineraryStops"
      shape={collection as any}
      onPress={(event) => {
        const stopId = event?.features?.[0]?.properties?.id

        if (stopId) {
          onSelectStop(stopId)
        }
      }}
    >
      <MapboxGL.CircleLayer id="stopCircles" style={circleStyle} />
      <MapboxGL.SymbolLayer id="stopNumbers" aboveLayerID="stopCircles" style={numberStyle} />
    </MapboxGL.ShapeSource>
  )
}
