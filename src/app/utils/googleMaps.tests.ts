import { fetchMockResponseOnce } from "app/tests/fetchMockHelpers"
import { getLocationPredictions } from "./googleMaps"

describe("queryLocation()", () => {
  it("queries the google maps api and returns some formatted results", async () => {
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
