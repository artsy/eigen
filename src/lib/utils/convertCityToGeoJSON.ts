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
