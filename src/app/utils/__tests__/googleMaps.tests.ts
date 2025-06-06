import { getLocationPredictions, getLocationDetails } from "app/utils/googleMaps"
import { fetchMockResponseOnce } from "app/utils/tests/fetchMockHelpers"

describe(getLocationPredictions, () => {
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
    })
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
