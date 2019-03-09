import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"

import { MapGeoFeatureCollection } from "lib/Scenes/Map/types"

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

export const showsToGeoCityShow = (edges: ShowsEdge) =>
  edges.filter(a => a.node.type === "Show").map(({ node }) => {
    return {
      node: {
        ...node,
        icon: node.is_followed ? "pin-saved" : "pin",
      },
    }
  })

export const fairToGeoCityFairs = (edges: FairsEdge) =>
  edges.map(({ node }) => {
    return {
      node: {
        ...node,
        icon: "pin",
      },
    }
  })

export const convertCityToGeoJSON = data => {
  return {
    type: "FeatureCollection",
    features: data
      .map(({ node }) => node)
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
  } as MapGeoFeatureCollection
}
