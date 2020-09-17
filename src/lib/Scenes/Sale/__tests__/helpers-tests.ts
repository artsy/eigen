import moment from "moment"

import { saleStatus } from "../helpers"

const dAdd = (date: number, amount: number, type: "day" | "days") => moment(date).add(amount, type).toISOString()
const dSub = (date: number, amount: number, type: "day" | "days") => moment(date).subtract(amount, type).toISOString()

describe(saleStatus, () => {
  it("calculates correctly", () => {
    const now = Date.now()
    expect(saleStatus(dAdd(now, 1, "day"), dAdd(now, 2, "days"))).toBe("notYetOpen")
    expect(saleStatus(dSub(now, 1, "day"), dAdd(now, 2, "days"))).toBe("active")
    expect(saleStatus(dSub(now, 3, "days"), dSub(now, 2, "days"))).toBe("closed")
  })
})
