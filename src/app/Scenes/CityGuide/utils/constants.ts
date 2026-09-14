import { CircleLayerStyle, SymbolLayerStyle } from "@rnmapbox/maps"

/**
 * Same highlight the City Guide map uses for a tapped pin and a tapped cluster
 * (CityGuideMapPins.tsx's SELECTED_CLUSTER_COLOR — both are "#6E1EFF", so one constant
 * covers both here too).
 */
export const SELECTED_COLOR = "#6E1EFF"
export const PIN_COLOR = "black"
export const PIN_RADIUS = 14
/**
 * Deliberately far below Mapbox's default of 50. On the itinerary, stops are numbered and
 * the sequence is the content, so pins should only merge when they genuinely sit on top of
 * each other — two fairs sharing Somerset House, say — not merely when they are nearby. The
 * event maps keep the same radius so clustering behaves the same everywhere.
 */
export const CLUSTER_RADIUS = 20

export const ICON_SIZE = 0.7

/** "2+" when numbered rather than "2": a bare count would be indistinguishable from the
 * pin numbered 2. Unnumbered maps have no such pin to confuse it with, so the developer
 * chose a plain count there.
 */
export const NUMBERED_CLUSTER_COUNT_FIELD = [
  "concat",
  ["to-string", ["get", "point_count"]],
  "+",
] as any
export const PLAIN_CLUSTER_COUNT_FIELD = ["to-string", ["get", "point_count"]] as any

export const BOUNDS_PADDING = 60

/** Clears the floating list/map toggle, which sits ~10pt off the bottom. */
export const PREVIEW_BOTTOM_OFFSET = 70

/** Numbers the itinerary's pins; unlike the styles below, this depends on no runtime
 * props — it reads the `number` feature property straight from the data. */
export const numberStyle: SymbolLayerStyle = {
  textField: ["get", "number"],
  textSize: 14,
  textColor: "white",
  textFont: ["Unica77 LL Medium"],
  textPitchAlignment: "map",
  textAllowOverlap: true,
  textIgnorePlacement: true,
}

export const getClusterCountStyle = (numbered: boolean): SymbolLayerStyle => ({
  textField: numbered ? NUMBERED_CLUSTER_COUNT_FIELD : PLAIN_CLUSTER_COUNT_FIELD,
  textSize: 14,
  textColor: "white",
  textFont: ["Unica77 LL Medium"],
  textPitchAlignment: "map",
  textAllowOverlap: true,
  textIgnorePlacement: true,
})

// Same teardrop sprites as CityGuideMapPins.tsx:24-34, copied rather than shared since
// that map is frozen. Suffixing "-selected" for the tapped pin matches its convention too.
export const getStopSymbolStyle = (selectedPlaceId: string | null): SymbolLayerStyle => ({
  iconImage: selectedPlaceId
    ? [
        "case",
        ["==", ["get", "id"], selectedPlaceId],
        ["concat", ["get", "icon"], "-selected"],
        ["get", "icon"],
      ]
    : ["get", "icon"],
  iconSize: ICON_SIZE,
  iconAllowOverlap: true,
  iconIgnorePlacement: true,
})

export const getStopCircleStyle = (selectedPlaceId: string | null): CircleLayerStyle => ({
  circleRadius: PIN_RADIUS,
  // Recolour the tapped pin itself rather than drawing a highlight over it, matching
  // how the City Guide map treats its selected cluster.
  circleColor: selectedPlaceId
    ? ["case", ["==", ["get", "id"], selectedPlaceId], SELECTED_COLOR, PIN_COLOR]
    : PIN_COLOR,
  circleStrokeWidth: 2,
  circleStrokeColor: "white",
  circlePitchAlignment: "map",
})

export const getClusterCircleStyle = (activeClusterId?: number | null): CircleLayerStyle => ({
  circleRadius: PIN_RADIUS,
  // Recolour the tapped cluster's own circle instead of drawing a highlight on top of
  // it, matching how a selected pin recolours (CityGuideMapPins.tsx's pattern).
  circleColor:
    activeClusterId != null
      ? ["case", ["==", ["get", "cluster_id"], activeClusterId], SELECTED_COLOR, PIN_COLOR]
      : PIN_COLOR,
  circleStrokeWidth: 2,
  circleStrokeColor: "white",
  circlePitchAlignment: "map",
})
