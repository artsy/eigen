import findCountryNameByCountryCode from "../findCountryNameByCountryCode"

describe("findCountryNameByCountryCode util", () => {
  it("correctly returns the full name of country", () => {
    expect(findCountryNameByCountryCode("DE")).toEqual("Germany")
  })

  it("return an empty string when county not found", () => {
    expect(findCountryNameByCountryCode("x123")).toEqual("")
  })
})
