import MapboxGL, { ShapeSource } from "@rnmapbox/maps"
import { MapFeatureCollection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import {
  CLUSTER_RADIUS,
  getClusterCircleStyle,
  getClusterCountStyle,
  getStopCircleStyle,
  getStopSymbolStyle,
  numberStyle,
} from "app/Scenes/CityGuide/utils/constants"
import { RefObject } from "react"

/** Matches only clustered points. */
const IS_CLUSTER = ["has", "point_count"] as any
/** Matches only real places. */
const IS_STOP = ["!", ["has", "point_count"]] as any

interface Props {
  /** Already filtered to the places that should be visible. */
  collection: MapFeatureCollection
  selectedPlaceId: string | null
  onSelectPlace: (placeId: string) => void
  /**
   * Fired when a cluster is tapped, with the raw feature so the caller can ask the shape
   * source (via `shapeSourceRef`) which points it contains.
   */
  onSelectCluster: (feature: any) => void
  /**
   * Off by default. When on, pins are numbered and clusters read "2+"; the itinerary is
   * the only map that turns it on. When off, the number symbol layer is skipped entirely
   * rather than rendered with an empty label, and clusters read a plain count.
   */
  numbered?: boolean
  /** Lets the map ask Mapbox which points a tapped cluster contains, mirroring
   * `CityGuideMapPins`'s `shapeSourceRef` (copied, since that map is frozen). */
  shapeSourceRef?: RefObject<ShapeSource | null>
  /**
   * The `cluster_id` of the tapped cluster, so its own circle can recolour the same way a
   * selected pin does (mirrors `CityGuideMapPins`'s `activeClusterId`, copied since that
   * map is frozen).
   */
  activeClusterId?: number | null
}

/**
 * Renders one pin per place — numbered when asked to — merging only pins that genuinely
 * overlap.
 *
 * The layer filters here are always set, never undefined. That matters: rnmapbox maps an
 * undefined filter to `[]` (utils/filterUtils.js) rather than to a reset, so a filter set
 * once can never be cleared. Section filtering is therefore done on the collection, not
 * here — only the cluster/stop split uses layer filters, and those never change.
 */
export const MapPins: React.FC<Props> = ({
  collection,
  selectedPlaceId,
  onSelectPlace,
  onSelectCluster,
  numbered = false,
  shapeSourceRef,
  activeClusterId,
}) => {
  const clusterCircleStyle = getClusterCircleStyle(activeClusterId)
  const stopCircleStyle = getStopCircleStyle(selectedPlaceId)
  // Event maps: the app's teardrop pin sprites instead of a plain circle, per icon on
  // each place (CityGuideMapPins.tsx's pattern, copied since that map is frozen).
  const stopSymbolStyle = getStopSymbolStyle(selectedPlaceId)
  const clusterCountStyle = getClusterCountStyle(numbered)

  /*
    Handed to the ShapeSource as one flat array rather than as conditional JSX children.
    Two constraints meet here. ShapeSource passes its `sourceID` down by cloning its
    children, and `cloneReactChildrenWithProps` returns a `React.Fragment` child untouched,
    without adding props (@rnmapbox/maps utils/index.ts:71) — so a layer grouped inside a
    fragment binds to no source and silently draws nothing, which is what hid the
    itinerary's numbered pins. Its `children` prop is typed `ReactElement | ReactElement[]`
    too, which rejects the `{cond && <Layer/>}` form a fragment would otherwise be swapped
    for. An array satisfies both: `React.Children.map` flattens it, so every layer is
    cloned and gets its `sourceID`.

    Order is load-bearing — each layer's `aboveLayerID` names the one before it.
  */
  const layers = [
    ...(numbered
      ? [
          <MapboxGL.CircleLayer
            key="stopCircles"
            id="stopCircles"
            style={stopCircleStyle}
            filter={IS_STOP}
          />,
          <MapboxGL.SymbolLayer
            key="stopNumbers"
            id="stopNumbers"
            aboveLayerID="stopCircles"
            style={numberStyle}
            filter={IS_STOP}
          />,
        ]
      : [
          <MapboxGL.SymbolLayer
            key="stopIcons"
            id="stopIcons"
            style={stopSymbolStyle}
            filter={IS_STOP}
          />,
        ]),
    <MapboxGL.CircleLayer
      key="stopClusters"
      id="stopClusters"
      style={clusterCircleStyle}
      filter={IS_CLUSTER}
      aboveLayerID={numbered ? "stopNumbers" : "stopIcons"}
    />,
    <MapboxGL.SymbolLayer
      key="stopClusterCounts"
      id="stopClusterCounts"
      aboveLayerID="stopClusters"
      style={clusterCountStyle}
      filter={IS_CLUSTER}
    />,
  ]

  return (
    <MapboxGL.ShapeSource
      ref={shapeSourceRef}
      id="mapPlaces"
      shape={collection as any}
      cluster
      clusterRadius={CLUSTER_RADIUS}
      onPress={(event) => {
        const feature = event?.features?.[0]

        if (!feature) return

        if (feature.properties?.point_count) {
          onSelectCluster(feature)
          return
        }

        const placeId = feature.properties?.id

        if (placeId) {
          onSelectPlace(placeId)
        }
      }}
    >
      {layers}
    </MapboxGL.ShapeSource>
  )
}
