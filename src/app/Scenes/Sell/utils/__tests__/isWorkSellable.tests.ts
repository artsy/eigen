import { isWorkSellable } from "app/Scenes/Sell/utils/isWorkSellable"

describe("isWorkSellable", () => {
  it("treats an even last hex digit as sellable", () => {
    expect(isWorkSellable("id-a2")).toBe(true)
    expect(isWorkSellable("id-ae")).toBe(true)
  })

  it("treats an odd last hex digit as not sellable", () => {
    expect(isWorkSellable("id-a3")).toBe(false)
    expect(isWorkSellable("id-af")).toBe(false)
  })
})
