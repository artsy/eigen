import MapboxGL, { CircleLayerStyle, SymbolLayerStyle } from "@rnmapbox/maps"
import { ItineraryFeatureCollection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { StyleProp } from "react-native"

/** Same highlight the City Guide map uses for a tapped pin (CityGuideMapPins.tsx:8). */
const SELECTED_PIN_COLOR = "#6E1EFF"
const PIN_COLOR = "black"
const PIN_RADIUS = 14
/**
 * Deliberately far below Mapbox's default of 50. Stops are numbered and the sequence is
 * the content, so pins should only merge when they genuinely sit on top of each other —
 * two fairs sharing Somerset House, say — not merely when they are nearby.
 */
const CLUSTER_RADIUS = 20

/** Matches only clustered points. */
const IS_CLUSTER = ["has", "point_count"] as any
/** Matches only real stops. */
const IS_STOP = ["!", ["has", "point_count"]] as any

const numberStyle: StyleProp<SymbolLayerStyle> = {
  textField: ["get", "number"],
  textSize: 14,
  textColor: "white",
  textFont: ["Unica77 LL Medium"],
  textPitchAlignment: "map",
  textAllowOverlap: true,
  textIgnorePlacement: true,
}

const clusterCircleStyle: StyleProp<CircleLayerStyle> = {
  circleRadius: PIN_RADIUS,
  // Same black as a stop pin: purple stays reserved for "selected".
  circleColor: PIN_COLOR,
  circleStrokeWidth: 2,
  circleStrokeColor: "white",
  circlePitchAlignment: "map",
}

const clusterCountStyle: StyleProp<SymbolLayerStyle> = {
  // "2+" rather than "2": a bare count would be indistinguishable from the stop numbered
  // 2. The suffix marks it as a group.
  textField: ["concat", ["to-string", ["get", "point_count"]], "+"],
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
  /** Fired when a cluster is tapped, so the map can zoom in until it splits apart. */
  onSelectCluster: (coordinates: [number, number]) => void
}

/**
 * Renders one numbered pin per stop, merging only pins that genuinely overlap.
 *
 * The layer filters here are always set, never undefined. That matters: rnmapbox maps an
 * undefined filter to `[]` (utils/filterUtils.js) rather than to a reset, so a filter set
 * once can never be cleared. Section filtering is therefore done on the collection, not
 * here — only the cluster/stop split uses layer filters, and those never change.
 */
export const ItineraryMapPins: React.FC<Props> = ({
  collection,
  selectedStopId,
  onSelectStop,
  onSelectCluster,
}) => {
  const stopCircleStyle: StyleProp<CircleLayerStyle> = {
    circleRadius: PIN_RADIUS,
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
      cluster
      clusterRadius={CLUSTER_RADIUS}
      onPress={(event) => {
        const feature = event?.features?.[0]

        if (!feature) return

        if (feature.properties?.point_count) {
          const { latitude, longitude } = event.coordinates
          onSelectCluster([longitude, latitude])
          return
        }

        const stopId = feature.properties?.id

        if (stopId) {
          onSelectStop(stopId)
        }
      }}
    >
      <MapboxGL.CircleLayer id="stopCircles" style={stopCircleStyle} filter={IS_STOP} />
      <MapboxGL.SymbolLayer
        id="stopNumbers"
        aboveLayerID="stopCircles"
        style={numberStyle}
        filter={IS_STOP}
      />

      <MapboxGL.CircleLayer
        id="stopClusters"
        style={clusterCircleStyle}
        filter={IS_CLUSTER}
        aboveLayerID="stopNumbers"
      />
      <MapboxGL.SymbolLayer
        id="stopClusterCounts"
        aboveLayerID="stopClusters"
        style={clusterCountStyle}
        filter={IS_CLUSTER}
      />
    </MapboxGL.ShapeSource>
  )
}
