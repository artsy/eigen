import { DateTime } from "luxon"
import { getDateLabel } from "./getDateLabel"

describe("getDateLabel", () => {
  it("returns 'Today' label", () => {
    const result1 = getDateLabel(DateTime.now().startOf("day").toString())
    expect(result1).toEqual("Today")

    const result2 = getDateLabel(DateTime.now().endOf("day").toString())
    expect(result2).toEqual("Today")

    const result3 = getDateLabel(DateTime.now().toString())
    expect(result3).toEqual("Today")
  })

  it("returns 'x days ago' label", () => {
    const result1 = getDateLabel(DateTime.now().minus({ days: 1 }).toString())
    expect(result1).toEqual("1 day ago")

    const result2 = getDateLabel(DateTime.now().minus({ days: 2 }).toString())
    expect(result2).toEqual("2 days ago")

    const result3 = getDateLabel(DateTime.now().minus({ days: 31 }).toString())
    expect(result3).toEqual("31 days ago")

    const result4 = getDateLabel(DateTime.now().minus({ days: 365 }).toString())
    expect(result4).toEqual("365 days ago")
  })
})
