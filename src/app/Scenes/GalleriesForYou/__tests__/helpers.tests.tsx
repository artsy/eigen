import { sortByDistance } from "app/Scenes/GalleriesForYou/helpers"

describe("sortByDistance", () => {
  const locations = [
    { coordinates: { lat: 5, lng: 6 } },
    { coordinates: { lat: 7, lng: 8 } },
    { coordinates: { lat: 1, lng: 2 } },
    { coordinates: { lat: 3, lng: 4 } },
  ]

  const target = { lat: 0, lng: 0 }

  it("returns an array sorted by distance to the target", () => {
    expect(sortByDistance(locations, target)).toMatchInlineSnapshot(`
      [
        {
          "coordinates": {
            "lat": 1,
            "lng": 2,
          },
        },
        {
          "coordinates": {
            "lat": 3,
            "lng": 4,
          },
        },
        {
          "coordinates": {
            "lat": 5,
            "lng": 6,
          },
        },
        {
          "coordinates": {
            "lat": 7,
            "lng": 8,
          },
        },
      ]
    `)
  })
})
