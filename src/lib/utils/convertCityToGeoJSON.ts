import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"

import { Fair, Show } from "lib/Scenes/Map/types"

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

export type FairsEdge = GlobalMap_viewer["city"]["fairs"]["edges"]
export type ShowsEdge = GlobalMap_viewer["city"]["shows"]["edges"]

export const showsToGeoCityShow = (edges: Show[]): Show[] =>
  edges.map(node => {
    return {
      ...node,
      icon: node.is_followed ? "pin-saved" : "pin",
    }
  })

export const fairToGeoCityFairs = (edges: Fair[]): Fair[] =>
  edges.map(node => {
    return {
      ...node,
      icon: "pin-fair",
      type: "Fair",
    }
  })

export const convertCityToGeoJSON = data => {
  return {
    type: "FeatureCollection",
    features: data
      // The API has (at least once) given us back shows without locations
      // so we should protect against runtime errors.
      .filter(feature => feature.location && feature.location.coordinates)
      .map(node => {
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
