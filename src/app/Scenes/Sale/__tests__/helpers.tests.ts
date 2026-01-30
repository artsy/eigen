import { saleStatus } from "app/Scenes/Sale/helpers"
import { DateTime } from "luxon"

const dAdd = (date: number, amount: number) =>
  DateTime.fromMillis(date).plus({ days: amount }).toISO()
const dSub = (date: number, amount: number) =>
  DateTime.fromMillis(date).minus({ days: amount }).toISO()

describe(saleStatus, () => {
  it("returns the right sale status", () => {
    const now = Date.now()
    expect(saleStatus(dAdd(now, 1), dAdd(now, 2), dAdd(now, 1))).toBe("notYetOpen")
    expect(saleStatus(dAdd(now, 1), dAdd(now, 2), null)).toBe("notYetOpen")
    expect(saleStatus(dSub(now, 1), dAdd(now, 2), dAdd(now, 1))).toBe("active")
    expect(saleStatus(dSub(now, 1), dAdd(now, 2), null)).toBe("active")
    expect(saleStatus(dSub(now, 3), dAdd(now, 2), dSub(now, 1))).toBe("closed")
    expect(saleStatus(dSub(now, 3), dSub(now, 2), null)).toBe("closed")
  })
})
