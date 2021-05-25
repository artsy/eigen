import { localizeDimension, parseRange } from "../helpers"

describe("parseRange", () => {
  it("parses a default range string", () => {
    expect(parseRange("*-*")).toEqual({ min: "*", max: "*" })
  })

  it("parses a range string with a whole number max", () => {
    expect(parseRange("*-1")).toEqual({ min: "*", max: 1 })
  })

  it("parses a range string with a whole number min", () => {
    expect(parseRange("1-*")).toEqual({ min: 1, max: "*" })
  })

  it("parses a range string with a whole number min and max", () => {
    expect(parseRange("1-2")).toEqual({ min: 1, max: 2 })
  })

  it("parses a range string with a float min and max", () => {
    expect(parseRange("1.333-99.1234")).toEqual({ min: 1.333, max: 99.1234 })
  })

  it("rejects garbage input", () => {
    expect(parseRange("whatever")).toEqual({ min: "*", max: "*" })
  })

  it("handles zero correctly", () => {
    expect(parseRange("0-*")).toEqual({ min: 0, max: "*" })
    expect(parseRange("*-0")).toEqual({ min: "*", max: 0 })
    expect(parseRange("0-0")).toEqual({ min: 0, max: 0 })
  })
})

describe("localizeDimension", () => {
  describe("in the USA", () => {
    it("accepts inches and returns inches", () => {
      expect(localizeDimension(10, "in")).toEqual({ value: 10, unit: "in" })
    })

    it("accepts centimeters and returns inches", () => {
      expect(localizeDimension(10, "cm")).toEqual({ value: 3.937007874015748, unit: "in" })
    })
  })

  // TODO: How to mock constants?
  xdescribe("outside the USA", () => {
    it("accepts centimeters and returns centimeters", () => {
      expect(localizeDimension(10, "cm")).toEqual({ value: 10, unit: "cm" })
    })

    it("accepts inches and returns centimeters", () => {
      expect(localizeDimension(10, "in")).toEqual({ value: 25.4, unit: "cm" })
    })
  })
})
