import { CityData } from "app/Scenes/City/CityPicker"
import { cityNearLocation } from "./cityNearLocation"

const cities = [
  { name: "Paris", coordinates: { lat: 48.8566, lng: 2.3522 } },
  { name: "London", coordinates: { lat: 51.5074, lng: -0.1278 } },
  { name: "Berlin", coordinates: { lat: 52.52, lng: 13.405 } },
] as CityData[]

describe("cityNearLocation", () => {
  it("returns the closest city within 100km", () => {
    const location = { lat: 48.85, lng: 2.35 } // Near Paris
    const result = cityNearLocation(cities, location)
    expect(result?.name).toBe("Paris")
  })

  it("returns null if no city is within 100km", () => {
    const location = { lat: 0, lng: 0 } // Far from all cities
    const result = cityNearLocation(cities, location)
    expect(result).toBeNull()
  })

  it("returns the closest city if multiple are within 100km", () => {
    const closeCities = [
      { name: "A", coordinates: { lat: 10, lng: 10 } },
      { name: "B", coordinates: { lat: 10.5, lng: 10.5 } },
    ] as CityData[]
    const location = { lat: 10.4, lng: 10.4 }
    const result = cityNearLocation(closeCities, location)
    expect(result?.name).toBe("B")
  })

  it("returns null if cities array is empty", () => {
    const location = { lat: 48.85, lng: 2.35 }
    const result = cityNearLocation([], location)
    expect(result).toBeNull()
  })
})
