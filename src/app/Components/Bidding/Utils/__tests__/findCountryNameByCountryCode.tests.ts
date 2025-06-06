import { findCountryNameByCountryCode } from "app/Components/Bidding/Utils/findCountryNameByCountryCode"

describe("findCountryNameByCountryCode util", () => {
  it("correctly returns the full name of country", () => {
    expect(findCountryNameByCountryCode("DE")).toEqual("Germany")
  })

  it("returns null when county not found", () => {
    expect(findCountryNameByCountryCode("x123")).toEqual(null)
  })
})
