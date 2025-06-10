import { Flex, Text } from "@artsy/palette-mobile"
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

  if (cluster) {
    const { properties, geometry } = nearestFeature
    const [clusterLat, clusterLng] = geometry.coordinates

    const clusterId = properties.cluster_id.toString()
    let pointCount = properties.point_count

    const diameter = pointCount < 4 ? 40 : pointCount < 21 ? 50 : 65
    pointCount = pointCount.toString()

    return (
      clusterId &&
      clusterLat &&
      clusterLng &&
      pointCount && (
        <MapboxGL.PointAnnotation
          key={clusterId}
          id={clusterId}
          selected
          coordinate={[clusterLat, clusterLng]}
        >
          <Flex
            backgroundColor="blue100"
            borderRadius={diameter / 2}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            width={diameter}
            height={diameter}
          >
            <Text variant="sm" weight="medium" color="mono0">
              {pointCount}
            </Text>
          </Flex>
        </MapboxGL.PointAnnotation>
      )
    )
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
