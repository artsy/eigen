import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { stopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"

const stop = (overrides: Partial<ItineraryStop> = {}): ItineraryStop => ({
  id: "stop-1",
  title: "Stop title",
  displayTime: "10am-6pm",
  imageUrl: "https://example.com/stop.jpg",
  saveTarget: null,
  ...overrides,
})

describe("stopCardFields", () => {
  describe("a show", () => {
    const show = {
      __typename: "Show",
      name: "Georg Baselitz: Back Again",
      href: "/show/white-cube-georg-baselitz-back-again",
      isFreeAdmission: false,
      partner: { name: "White Cube" },
    }

    it("names the show, locates it by its partner, and links to it", () => {
      const fields = stopCardFields(stop({ title: "" }), show)

      expect(fields.kind).toEqual("show")
      expect(fields.title).toEqual("Georg Baselitz: Back Again")
      expect(fields.subtitle).toEqual("White Cube")
      expect(fields.hours).toEqual("10am-6pm")
      expect(fields.admission).toEqual("Paid Entry")
      expect(fields.href).toEqual("/show/white-cube-georg-baselitz-back-again")
    })

    // Both museums and galleries are Partners, so the stop's category is what distinguishes
    // them.
    it("marks a museum with a building", () => {
      expect(stopCardFields(stop({ category: "MUSEUM" }), show).subtitle).toEqual("🏛 White Cube")
      expect(stopCardFields(stop({ category: "GALLERY" }), show).subtitle).toEqual("White Cube")
    })

    it("prefers the editorial title over the show's own name", () => {
      expect(stopCardFields(stop({ title: "Baselitz, finally" }), show).title).toEqual(
        "Baselitz, finally"
      )
    })

    // An author can override what the entity says.
    it("lets the stop's admission win over the show's", () => {
      expect(stopCardFields(stop({ isFreeAdmission: true }), show).admission).toEqual("Free")
    })
  })

  describe("a fair", () => {
    it("locates it by its location and links to it", () => {
      const fields = stopCardFields(stop({ title: "" }), {
        __typename: "Fair",
        name: "Frieze London",
        href: "/fair/frieze-london-2025",
        location: { name: "The Regent's Park", city: "London" },
      })

      expect(fields.kind).toEqual("fair")
      expect(fields.title).toEqual("Frieze London")
      expect(fields.subtitle).toEqual("The Regent's Park")
      expect(fields.href).toEqual("/fair/frieze-london-2025")
    })
  })

  describe("a museum or gallery", () => {
    it("uses the first of its locations, since Partner.location needs an id", () => {
      const fields = stopCardFields(stop({ title: "" }), {
        __typename: "Partner",
        name: "White Cube",
        href: "/partner/white-cube",
        locations: [{ name: "Bermondsey", city: "London" }],
      })

      expect(fields.kind).toEqual("partner")
      expect(fields.subtitle).toEqual("Bermondsey")
      expect(fields.href).toEqual("/partner/white-cube")
    })

    it("falls back to the city when the location has no name", () => {
      const fields = stopCardFields(stop(), {
        __typename: "Partner",
        name: "White Cube",
        locations: [{ name: null, city: "London" }],
      })

      expect(fields.subtitle).toEqual("London")
    })
  })

  describe("a custom stop", () => {
    it("has no item, so it shows its own title and address and links nowhere", () => {
      const fields = stopCardFields(
        stop({ title: "Coffee at London Cafe", address: "12 Mount Street" })
      )

      expect(fields.kind).toEqual("custom")
      expect(fields.title).toEqual("Coffee at London Cafe")
      expect(fields.subtitle).toEqual("12 Mount Street")
      expect(fields.hours).toEqual("10am-6pm")
      // A custom stop links to its source URL, which Metaphysics does not expose.
      expect(fields.href).toBeUndefined()
    })

    // Relay adds "%other" for a union member the query does not select on.
    it("treats an unknown item type as custom rather than crashing", () => {
      expect(stopCardFields(stop(), { __typename: "%other" }).kind).toEqual("custom")
    })
  })

  it("omits admission entirely when nothing knows it", () => {
    expect(stopCardFields(stop(), { __typename: "Fair", name: "Frieze" }).admission).toBeUndefined()
  })

  it("omits hours when the stop has none", () => {
    expect(stopCardFields(stop({ displayTime: "" })).hours).toBeUndefined()
  })
})
