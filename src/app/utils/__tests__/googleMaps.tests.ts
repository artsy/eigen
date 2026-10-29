import { getLocationPredictions, getLocationDetails } from "app/utils/googleMaps"
import { fetchMockResponseOnce } from "app/utils/tests/fetchMockHelpers"

describe(getLocationPredictions, () => {
  beforeEach(() => {
    fetchMock.mockClear()
  })

  it("queries the google maps autocomplete api and returns some formatted results", async () => {
    fetchMockResponseOnce(
      JSON.stringify({
        predictions: [
          {
            place_id: "a",
            description: "Coxsackie, NY, USA",
          },
        ],
      })
    )

    const result = await getLocationPredictions("Cox")

    expect(result).toEqual([
      {
        id: "a",
        name: "Coxsackie, NY, USA",
      },
    ])
    expect(fetchMock.mock.calls[0][0]).toContain("types=%28cities%29")
    expect(fetchMock.mock.calls[0][0]).not.toContain("components=")
  })

  it("searches addresses in one country when asked to", async () => {
    fetchMockResponseOnce(JSON.stringify({ predictions: [] }))

    await getLocationPredictions("401 Broad", { types: "address", country: "us" })

    expect(fetchMock.mock.calls[0][0]).toContain("types=address")
    expect(fetchMock.mock.calls[0][0]).toContain("components=country%3Aus")
  })
})

describe(getLocationDetails, () => {
  it("queries the google maps place details api and returns some formatted results", async () => {
    fetchMockResponseOnce(JSON.stringify(placeDetailsResponse))

    const result = await getLocationDetails({
      id: "sydney_place_id_4242",
      name: "Sydney",
    })

    expect(result).toEqual({
      city: "Sydney",
      coordinates: [-33.8688197, 151.2092955],
      country: "Australia",
      countryCode: "AU",
      id: "sydney_place_id_4242",
      name: "Sydney",
      postalCode: undefined,
      state: "New South Wales",
      stateCode: "NSW",
      street: undefined,
    })
  })

  it("builds the street from the street number and route", async () => {
    fetchMockResponseOnce(JSON.stringify(addressDetailsResponse))

    const result = await getLocationDetails({
      id: "address_place_id",
      name: "401 Broadway, New York, NY, USA",
    })

    expect(result.street).toBe("401 Broadway")
    expect(result.postalCode).toBe("10013")
  })
})

const placeDetailsResponse = {
  result: {
    place_id: "sydney_place_id_4242",
    name: "Sydney",
    address_components: [
      {
        long_name: "Sydney",
        short_name: "Sydney",
        types: ["colloquial_area", "locality", "political"],
      },
      {
        long_name: "New South Wales",
        short_name: "NSW",
        types: ["administrative_area_level_1", "political"],
      },
      {
        long_name: "Australia",
        short_name: "AU",
        types: ["country", "political"],
      },
    ],
    geometry: {
      location: {
        lat: -33.8688197,
        lng: 151.2092955,
      },
    },
  },
}

const addressDetailsResponse = {
  result: {
    address_components: [
      { long_name: "401", short_name: "401", types: ["street_number"] },
      { long_name: "Broadway", short_name: "Broadway", types: ["route"] },
      { long_name: "New York", short_name: "New York", types: ["locality", "political"] },
      { long_name: "10013", short_name: "10013", types: ["postal_code"] },
    ],
    geometry: { location: { lat: 40.72, lng: -74.0 } },
  },
}
