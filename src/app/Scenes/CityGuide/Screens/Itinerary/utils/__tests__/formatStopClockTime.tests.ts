import { formatStopClockTime } from "app/Scenes/CityGuide/Screens/Itinerary/utils/formatStopClockTime"

describe("formatStopClockTime", () => {
  it("drops a zero minute", () => {
    expect(formatStopClockTime("8:00pm")).toEqual("8pm")
  })

  it("keeps a non-zero minute", () => {
    expect(formatStopClockTime("6:40pm")).toEqual("6:40pm")
  })

  it("leaves a time with no minutes alone", () => {
    expect(formatStopClockTime("11am")).toEqual("11am")
  })
})
