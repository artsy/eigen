import { saleStatus } from "app/Scenes/Sale/helpers"
import moment from "moment"

const dAdd = (date: number, amount: number, type: "day" | "days") =>
  moment(date).add(amount, type).toISOString()
const dSub = (date: number, amount: number, type: "day" | "days") =>
  moment(date).subtract(amount, type).toISOString()

describe(saleStatus, () => {
  it("returns the right sale status", () => {
    const now = Date.now()
    expect(saleStatus(dAdd(now, 1, "day"), dAdd(now, 2, "days"), dAdd(now, 1, "day"))).toBe(
      "notYetOpen"
    )
    expect(saleStatus(dAdd(now, 1, "day"), dAdd(now, 2, "days"), null)).toBe("notYetOpen")
    expect(saleStatus(dSub(now, 1, "day"), dAdd(now, 2, "days"), dAdd(now, 1, "day"))).toBe(
      "active"
    )
    expect(saleStatus(dSub(now, 1, "day"), dAdd(now, 2, "days"), null)).toBe("active")
    expect(saleStatus(dSub(now, 3, "days"), dAdd(now, 2, "days"), dSub(now, 1, "day"))).toBe(
      "closed"
    )
    expect(saleStatus(dSub(now, 3, "days"), dSub(now, 2, "days"), null)).toBe("closed")
  })
})
