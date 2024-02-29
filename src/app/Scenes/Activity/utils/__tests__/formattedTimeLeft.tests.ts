import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"

describe("formattedTimeLeft", () => {
  it("should return correct countdown copy and text color", () => {
    expect(formattedTimeLeft({ days: "2", hours: "2", minutes: "2", seconds: "2" })).toEqual({
      timerCopy: "2 days 2 hours",
      textColor: "blue100",
    })
    expect(formattedTimeLeft({ days: "1", hours: "1", minutes: "1", seconds: "1" })).toEqual({
      timerCopy: "1 day 1 hour",
      textColor: "blue100",
    })
    expect(formattedTimeLeft({ days: "0", hours: "23", minutes: "59", seconds: "59" })).toEqual({
      timerCopy: "23 hours",
      textColor: "blue100",
    })
    expect(formattedTimeLeft({ days: "0", hours: "0", minutes: "59", seconds: "59" })).toEqual({
      timerCopy: "59 minutes",
      textColor: "orange100",
    })
    expect(formattedTimeLeft({ days: "0", hours: "0", minutes: "1", seconds: "59" })).toEqual({
      timerCopy: "1 minute",
      textColor: "orange100",
    })
    expect(formattedTimeLeft({ days: "0", hours: "0", minutes: "0", seconds: "59" })).toEqual({
      timerCopy: "59 seconds",
      textColor: "orange100",
    })
    expect(formattedTimeLeft({ days: "0", hours: "0", minutes: "0", seconds: "1" })).toEqual({
      timerCopy: "1 second",
      textColor: "orange100",
    })
  })
})
