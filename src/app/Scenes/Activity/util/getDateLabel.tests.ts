import { DateTime } from "luxon"
import { getDateLabel } from "./getDateLabel"

describe("getDateLabel", () => {
  it("returns 'Today' label", () => {
    const result1 = getDateLabel(DateTime.utc().minus({ hours: 1 }).toString())
    expect(result1).toEqual("Today")

    const result2 = getDateLabel(DateTime.utc().minus({ hours: 5 }).toString())
    expect(result2).toEqual("Today")

    const result3 = getDateLabel(
      DateTime.utc().minus({ hours: 23, minutes: 59, seconds: 59 }).toString()
    )
    expect(result3).toEqual("Today")
  })

  it("returns 'x days ago' label", () => {
    const result1 = getDateLabel(DateTime.utc().minus({ days: 1 }).toString())
    expect(result1).toEqual("1 days ago")

    const result2 = getDateLabel(DateTime.utc().minus({ days: 2 }).toString())
    expect(result2).toEqual("2 days ago")

    const result3 = getDateLabel(DateTime.utc().minus({ days: 31 }).toString())
    expect(result3).toEqual("31 days ago")

    const result4 = getDateLabel(DateTime.utc().minus({ days: 365 }).toString())
    expect(result4).toEqual("365 days ago")
  })
})
