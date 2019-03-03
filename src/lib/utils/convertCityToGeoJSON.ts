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
    features: data.map(({ node }) => {
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
  }
}
