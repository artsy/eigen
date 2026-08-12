import MapboxGL from "@rnmapbox/maps"
import { Pin } from "app/Components/Icons/Pin"
import PinFairSelected from "app/Components/Icons/PinFairSelected"
import PinSavedSelected from "app/Components/Icons/PinSavedSelected"
import { Fair, Show } from "app/Scenes/Map/types"
import { AnyProps, ClusterProperties, PointFeature } from "supercluster"

export const SelectedPin: React.FC<{
  activePin: GeoJSON.Feature
  nearestFeature: PointFeature<ClusterProperties & AnyProps> | PointFeature<AnyProps> | null
  activeShows: Array<Fair | Show>
}> = ({ activePin, nearestFeature, activeShows }) => {
  if (!activePin.properties || !nearestFeature?.properties) {
    return null
  }

  const {
    properties: { cluster, type },
  } = activePin

  // Clusters are highlighted by recoloring their existing circle in PinsShapeLayer
  // (see activeClusterId), not by drawing a second annotation on top of them.
  if (cluster) {
    return null
  }

  const item = activeShows[0]

  if (!item || !item.location) {
    return null
  }

  const lat = item.location.coordinates?.lat
  const lng = item.location.coordinates?.lng
  const id = item.slug

  if (type === "Fair") {
    return (
      lat &&
      lng &&
      id && (
        <MapboxGL.PointAnnotation key={id} id={id} coordinate={[lng, lat]}>
          <PinFairSelected />
        </MapboxGL.PointAnnotation>
      )
    )
  } else if (type === "Show") {
    const isSaved = (item as Show).is_followed

    return (
      lat &&
      lng &&
      id && (
        <MapboxGL.PointAnnotation key={id} id={id} selected coordinate={[lng, lat]}>
          {isSaved ? (
            <PinSavedSelected pinHeight={45} pinWidth={45} />
          ) : (
            <Pin pinHeight={45} pinWidth={45} selected />
          )}
        </MapboxGL.PointAnnotation>
      )
    )
  }
}
