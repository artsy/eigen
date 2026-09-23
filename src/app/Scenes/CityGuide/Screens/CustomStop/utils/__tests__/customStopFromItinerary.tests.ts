import {
  customStopFromItinerary,
  customStopInput,
} from "app/Scenes/CityGuide/Screens/CustomStop/utils/customStopFromItinerary"

const stop = (overrides: object = {}) => ({
  internalID: "stop-2",
  title: "Coffee at London Cafe",
  address: "12 Bermondsey Street",
  category: "GALLERY",
  note: "Small place, good pastries.",
  sourceURL: "https://timeout.com/london-cafe",
  isFreeAdmission: true,
  latitude: 51.5,
  longitude: -0.1,
  startTime: "10am",
  endTime: "6pm",
  image: { url: "https://example.com/cafe.jpg" },
  item: null,
  ...overrides,
})

const itinerary = (stops: object[]) => ({
  sections: [{ stops: [stop({ internalID: "stop-1", title: "First" })] }, { stops }],
})

describe("customStopFromItinerary", () => {
  it("passes the source ID for image copying, without sending a rendered image URL", () => {
    const input = customStopInput({
      id: "source-stop",
      title: "Cafe",
      imageUrl: "https://example.com/image.jpg",
    })
    expect(input.sourceStopID).toBe("source-stop")
    expect(input).not.toHaveProperty("imageURL")
  })
  // The screen is addressed by itinerary plus stop: Metaphysics has no root lookup for a stop.
  it("finds a stop in any section", () => {
    const result = customStopFromItinerary(itinerary([stop()]) as any, "stop-2")

    expect(result).toEqual({
      id: "stop-2",
      title: "Coffee at London Cafe",
      address: "12 Bermondsey Street",
      category: "GALLERY",
      description: "Small place, good pastries.",
      sourceURL: "https://timeout.com/london-cafe",
      isFreeAdmission: true,
      hours: "10am-6pm",
      imageUrl: "https://example.com/cafe.jpg",
      coordinates: { lat: 51.5, lng: -0.1 },
    })
  })

  it("returns null for a stop that is not there", () => {
    expect(customStopFromItinerary(itinerary([stop()]) as any, "nope")).toBeNull()
  })

  // A stop with an entity has its own page, so this screen is the wrong place for it.
  it("returns null for a stop backed by an Artsy entity", () => {
    const result = customStopFromItinerary(
      itinerary([stop({ item: { __typename: "Show" } })]) as any,
      "stop-2"
    )

    expect(result).toBeNull()
  })

  it("returns null without an itinerary", () => {
    expect(customStopFromItinerary(null, "stop-2")).toBeNull()
  })

  it("leaves out what the stop does not carry", () => {
    const result = customStopFromItinerary(
      itinerary([
        stop({
          address: null,
          category: null,
          note: null,
          sourceURL: null,
          isFreeAdmission: null,
          image: null,
          startTime: null,
          endTime: null,
          latitude: null,
          longitude: null,
        }),
      ]) as any,
      "stop-2"
    )

    expect(result).toEqual({
      id: "stop-2",
      title: "Coffee at London Cafe",
      address: undefined,
      category: undefined,
      description: undefined,
      sourceURL: undefined,
      isFreeAdmission: undefined,
      hours: undefined,
      imageUrl: undefined,
      coordinates: undefined,
    })
  })

  // A category added server-side arrives as "%future added value", which has no styling.
  it("drops a category it does not know", () => {
    const result = customStopFromItinerary(
      itinerary([stop({ category: "%future added value" })]) as any,
      "stop-2"
    )

    expect(result?.category).toBeUndefined()
  })

  it("shows a single time when only one end is set", () => {
    const result = customStopFromItinerary(itinerary([stop({ endTime: null })]) as any, "stop-2")

    expect(result?.hours).toBe("10am")
  })

  it("trims a zero minute off each end, but keeps a non-zero one", () => {
    const result = customStopFromItinerary(
      itinerary([stop({ startTime: "11:00am", endTime: "6:40pm" })]) as any,
      "stop-2"
    )

    expect(result?.hours).toBe("11am-6:40pm")
  })

  it("trims a zero minute for both ends of a whole-hour range", () => {
    const result = customStopFromItinerary(
      itinerary([stop({ startTime: "8:00pm", endTime: "11:00pm" })]) as any,
      "stop-2"
    )

    expect(result?.hours).toBe("8pm-11pm")
  })

  // Left undefined rather than defaulted to 0,0 — a half-placed stop is not mappable.
  it("leaves a half-placed stop unmapped", () => {
    const result = customStopFromItinerary(itinerary([stop({ longitude: null })]) as any, "stop-2")

    expect(result?.coordinates).toBeUndefined()
  })
})
