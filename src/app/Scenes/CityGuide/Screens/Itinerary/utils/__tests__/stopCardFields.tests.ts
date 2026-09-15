import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import { stopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
import { DateTime } from "luxon"

const stop = (overrides: Record<string, unknown> = {}) => makeItineraryStop(overrides)

const showEvent = (kind: string, startAt: string | null) => ({
  __typename: "ShowEventType" as const,
  title: null,
  eventType: kind,
  startAtISO: startAt,
})

describe("stopCardFields", () => {
  describe("a show with a reception", () => {
    const show = {
      __typename: "Show",
      name: "Georg Baselitz: Back Again",
      partner: { name: "White Cube" },
    }

    it("calls out a reception happening today", () => {
      const fields = stopCardFields(
        stop({ event: showEvent("Opening Reception", DateTime.local().toISO()) }),
        show
      )

      expect(fields.reception).toEqual("Opening Reception today")
    })

    it("says closing too", () => {
      const fields = stopCardFields(
        stop({ event: showEvent("Closing Reception", DateTime.local().toISO()) }),
        show
      )

      expect(fields.reception).toEqual("Closing Reception today")
    })

    // "today" is the whole point of the line, so another day earns none.
    it("says nothing for a reception on another day", () => {
      const fields = stopCardFields(
        stop({
          event: showEvent("Opening Reception", DateTime.local().plus({ days: 3 }).toISO()),
        }),
        show
      )

      expect(fields.reception).toBeUndefined()
    })

    // Gravity has eight event kinds; only the two receptions earn the line.
    it("says nothing for an event that is not a reception", () => {
      const fields = stopCardFields(
        stop({ event: showEvent("Screening", DateTime.local().toISO()) }),
        show
      )

      expect(fields.reception).toBeUndefined()
    })
  })

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

    // A blank line tells you nothing; the show's own dates at least say it's on.
    it("falls back to the show's exhibition period when the stop has no hours of its own", () => {
      const fields = stopCardFields(stop({ startTime: null, endTime: null }), {
        ...show,
        exhibitionPeriod: "Feb 25 - May 24",
      })

      expect(fields.hours).toEqual("Feb 25 - May 24")
    })

    it("prefers the stop's own hours over the show's exhibition period", () => {
      const fields = stopCardFields(stop(), { ...show, exhibitionPeriod: "Feb 25 - May 24" })

      expect(fields.hours).toEqual("10am-6pm")
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
      // A custom stop has nothing on Artsy, so it links where the curator found it.
      expect(fields.href).toBeUndefined()
    })

    it("shows the admission the curator set", () => {
      expect(stopCardFields(stop({ isFreeAdmission: true })).admission).toEqual("Free")
      expect(stopCardFields(stop({ isFreeAdmission: false })).admission).toEqual("Paid Entry")
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
    expect(stopCardFields(stop({ startTime: null, endTime: null })).hours).toBeUndefined()
  })

  it("links a custom stop to where the curator found it", () => {
    const fields = stopCardFields(
      stop({ title: "Coffee at London Cafe", sourceURL: "https://londoncafe.example" })
    )

    expect(fields.kind).toEqual("custom")
    expect(fields.href).toEqual("https://londoncafe.example")
  })

  describe("an event", () => {
    // `eventType` is the polymorphic class, so a stop can be known to name an event without
    // anything knowing which kind it is.
    const eventStop = stop({ title: "Artist walkthrough", eventType: "SHOW_EVENT" })

    it("prefers the event's own name when the curator gave no title", () => {
      const fields = stopCardFields(
        stop({
          title: "",
          eventType: "SHOW_EVENT",
          event: {
            __typename: "ShowEventType",
            title: "Baselitz in conversation",
            eventType: null,
            startAtISO: null,
          },
        }),
        { __typename: "Show", name: "Georg Baselitz: Back Again" }
      )

      expect(fields.title).toEqual("Baselitz in conversation")
    })

    it("is an event card even though its item is the parent show", () => {
      const fields = stopCardFields(eventStop, {
        __typename: "Show",
        name: "Georg Baselitz: Back Again",
        href: "/show/white-cube-georg-baselitz-back-again",
        partner: { name: "White Cube" },
      })

      expect(fields.kind).toEqual("event")
      expect(fields.title).toEqual("Artist walkthrough")
      // Its place comes from the show it belongs to.
      expect(fields.subtitle).toEqual("White Cube")
      // No event has an href of its own, so tapping opens the parent.
      expect(fields.href).toEqual("/show/white-cube-georg-baselitz-back-again")
    })

    it("takes a fair event's place from the fair's location", () => {
      const fields = stopCardFields(stop({ eventType: "FAIR_EVENT" }), {
        __typename: "Fair",
        name: "Frieze London",
        href: "/fair/frieze-london-2025",
        location: { name: "The Regent's Park" },
      })

      expect(fields.kind).toEqual("event")
      expect(fields.subtitle).toEqual("The Regent's Park")
    })
  })
})
