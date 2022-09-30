import { DateTime, Settings } from "luxon"
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
    const result2 = getDateLabel(DateTime.now().minus({ days: 2 }).toString())
    expect(result2).toEqual("2 days ago")

    const result3 = getDateLabel(DateTime.now().minus({ days: 31 }).toString())
    expect(result3).toEqual("31 days ago")

    const result4 = getDateLabel(DateTime.now().minus({ days: 365 }).toString())
    expect(result4).toEqual("365 days ago")
  })

  it("returns 'Yesterday' label", () => {
    const result1 = getDateLabel(DateTime.now().minus({ days: 1 }).toString())
    expect(result1).toEqual("Yesterday")

    // 00:00:00 today
    const startOfToday = DateTime.now().startOf("day").toMillis()
    Settings.now = () => startOfToday

    // 23:59:59 yesterday
    const endOfPrevDay = DateTime.now().endOf("day").minus({ days: 1 })
    const result2 = getDateLabel(endOfPrevDay.toString())
    expect(result2).toEqual("Yesterday")
  })
})
