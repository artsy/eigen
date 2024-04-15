import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"

describe("formattedTimeLeft", () => {
  it("should return correct countdown copy and text color", () => {
    expect(formattedTimeLeft({ days: "2", hours: "23", minutes: "2", seconds: "2" })).toEqual({
      timerCopy: "2d 23h",
      textColor: "blue100",
    })
    expect(formattedTimeLeft({ days: "2", hours: "0", minutes: "2", seconds: "2" })).toEqual({
      timerCopy: "2d",
      textColor: "blue100",
    })
    expect(formattedTimeLeft({ days: "1", hours: "0", minutes: "1", seconds: "1" })).toEqual({
      timerCopy: "1d",
      textColor: "blue100",
    })
    expect(formattedTimeLeft({ days: "0", hours: "23", minutes: "59", seconds: "59" })).toEqual({
      timerCopy: "23h",
      textColor: "blue100",
    })
    expect(formattedTimeLeft({ days: "0", hours: "1", minutes: "59", seconds: "59" })).toEqual({
      timerCopy: "1h",
      textColor: "blue100",
    })
    expect(formattedTimeLeft({ days: "0", hours: "0", minutes: "59", seconds: "59" })).toEqual({
      timerCopy: "59m",
      textColor: "orange100",
    })
    expect(formattedTimeLeft({ days: "0", hours: "0", minutes: "1", seconds: "59" })).toEqual({
      timerCopy: "1m",
      textColor: "orange100",
    })
    expect(formattedTimeLeft({ days: "0", hours: "0", minutes: "0", seconds: "59" })).toEqual({
      timerCopy: "59s",
      textColor: "orange100",
    })
    expect(formattedTimeLeft({ days: "0", hours: "0", minutes: "0", seconds: "1" })).toEqual({
      timerCopy: "1s",
      textColor: "orange100",
    })
  })
})
