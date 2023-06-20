import { sortByDistance } from "app/Scenes/GalleriesForYou/helpers"

describe("sortByDistance", () => {
  const coordinates = [
    { lat: 5, lng: 6 },
    { lat: 7, lng: 8 },
    { lat: 1, lng: 2 },
    { lat: 3, lng: 4 },
  ]

  const target = { lat: 0, lng: 0 }

  it("returns an array sorted by distance to the target", () => {
    expect(sortByDistance(coordinates, target)).toMatchInlineSnapshot(`
      [
        {
          "lat": 1,
          "lng": 2,
        },
        {
          "lat": 3,
          "lng": 4,
        },
        {
          "lat": 5,
          "lng": 6,
        },
        {
          "lat": 7,
          "lng": 8,
        },
      ]
    `)
  })
})
