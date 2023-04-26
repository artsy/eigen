import { getShowCity } from "app/Components/ShowCard"

describe("getShowCity", () => {
  it("returns showCity when a showCity is specifed", () => {
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: "Berlin",
        partnerCities: ["New York", "London"],
        externalPartnerCity: null,
      })
    ).toEqual("Berlin")
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: "Berlin",
        partnerCities: ["New York", "London"],
        externalPartnerCity: "Paris",
      })
    ).toEqual("Berlin")
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: "Berlin",
        partnerCities: null,
        externalPartnerCity: null,
      })
    ).toEqual("Berlin")
  })

  it("returns city from partner cities when no showCity is specifed", () => {
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: null,
        partnerCities: ["Berlin", "New York", "London"],
        externalPartnerCity: null,
      })
    ).toEqual("Berlin")
    expect(
      getShowCity({
        showName: "Berghain Art Show in berlin",
        showCity: null,
        partnerCities: ["berlin", "New York", "London"],
        externalPartnerCity: null,
      })
    ).toEqual("Berlin")
  })

  it("returns city from external partner city when no showCity is specifed", () => {
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: null,
        partnerCities: null,
        externalPartnerCity: "Berlin",
      })
    ).toEqual("Berlin")
    expect(
      getShowCity({
        showName: "Berghain Art Show in berlin",
        showCity: null,
        partnerCities: null,
        externalPartnerCity: "berlin",
      })
    ).toEqual("Berlin")
  })

  it("returns null when no show city is specifed and none of the partner cities are included in the show name", () => {
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: null,
        partnerCities: ["New York", "London"],
        externalPartnerCity: null,
      })
    ).toEqual(null)
    expect(
      getShowCity({
        showName: "Berghain Art Show in berlin",
        showCity: null,
        partnerCities: null,
        externalPartnerCity: null,
      })
    ).toEqual(null)
    expect(
      getShowCity({
        showName: "Berghain Art Show in berlin",
        showCity: null,
        partnerCities: null,
        externalPartnerCity: "Paris",
      })
    ).toEqual(null)
  })
})
