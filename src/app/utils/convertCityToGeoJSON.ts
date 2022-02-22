import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"

import { Fair, Show } from "app/Scenes/Map/types"

// Here is a sample GeoJSON document
// {
//   "type": "FeatureCollection",
//     "features": [
//       {
//         "type": "Feature",
//         "geometry": {
//           "type": "Point",
//           "coordinates": [102.0, 0.5]
//         },
//         "properties": {
//           "prop0": "value0"
//         }
//       },
// }

export type FairsEdge = NonNullable<
  NonNullable<NonNullable<GlobalMap_viewer["city"]>["fairs"]>["edges"]
>
export type ShowsEdge = NonNullable<
  NonNullable<NonNullable<GlobalMap_viewer["city"]>["shows"]>["edges"]
>

export const showsToGeoCityShow = (edges: Show[]): Show[] =>
  edges.map((node) => {
    return {
      ...node,
      icon: node.is_followed ? "pin-saved" : "pin",
    }
  })

export const fairToGeoCityFairs = (edges: Fair[]): Fair[] =>
  edges.map((node) => {
    return {
      ...node,
      icon: "pin-fair",
      type: "Fair",
    }
  })

export const convertCityToGeoJSON = (data: any /* STRICTNESS_MIGRATION */) => {
  return {
    type: "FeatureCollection",
    features: data
      // The API has (at least once) given us back shows without locations
      // so we should protect against runtime errors.
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      .filter((feature) => feature.location && feature.location.coordinates)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      .map((node) => {
        const {
          coordinates: { lat, lng },
        } = node.location

        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          properties: {
            ...node,
          },
        }
      }),
  } as any
}
