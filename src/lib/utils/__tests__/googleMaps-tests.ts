import { getLocationPredictions } from "../googleMaps"

jest.mock("react-native-config", () => ({
  GOOGLE_MAPS_API_KEY: "keykey",
}))

describe("queryLocation()", () => {
  let realFetch: typeof fetch
  beforeEach(() => {
    realFetch = (global as any).fetch!
    ;(global as any).fetch = jest.fn()
  })
  afterEach(() => {
    ;(global as any).fetch = realFetch
  })

  it("queries the google maps api and returns some formatted results", async () => {
    ;((global as any).fetch as jest.Mock).mockImplementation((...args) => {
      expect(args).toEqual([
        "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=keykey&language=en&types=(cities)&input=Cox",
      ])
      return Promise.resolve({
        json: () => ({
          predictions: [
            {
              place_id: "a",
              description: "Coxsackie, NY, USA",
            },
          ],
        }),
      })
    })

    const result = await getLocationPredictions("Cox")

    expect(result).toEqual([
      {
        id: "a",
        name: "Coxsackie, NY, USA",
      },
    ])
  })
})
