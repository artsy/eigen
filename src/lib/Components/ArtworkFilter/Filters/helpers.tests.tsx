import { cmToIn, inToCm, parseRange } from "./helpers"

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

describe("cmToIn", () => {
  it("should correctly convert from centimeters to inches", () => {
    expect(cmToIn(1)).toBe(0.39)
    expect(cmToIn(100)).toBe(39.37)
    expect(cmToIn(199)).toBe(78.35)
  })

  it("should correctly convert from centimeters to inches when the shouldRound param is set to false", () => {
    expect(cmToIn(1, false)).toBe(0.39370078740157477)
    expect(cmToIn(100, false)).toBe(39.37007874015748)
    expect(cmToIn(199, false)).toBe(78.34645669291338)
  })

  it('should return "*" if it is passed', () => {
    expect(cmToIn("*")).toBe("*")
  })
})

describe("inToCm", () => {
  it("should correctly convert from inches to centimeters", () => {
    expect(inToCm(1)).toBe(2.54)
    expect(inToCm(10)).toBe(25.4)
    expect(inToCm(10.12345)).toBe(25.71)
    expect(inToCm(10.6789)).toBe(27.12)
    expect(inToCm(45)).toBe(114.3)
    expect(inToCm(50)).toBe(127)
    expect(inToCm(99)).toBe(251.46)
  })

  it("should correctly convert from inches to centimeters when the shouldRound param is set to false", () => {
    expect(inToCm(1, false)).toBe(2.54)
    expect(inToCm(10, false)).toBe(25.4)
    expect(inToCm(10.12345, false)).toBe(25.713563)
    expect(inToCm(10.6789, false)).toBe(27.124406)
    expect(inToCm(45, false)).toBe(114.3)
    expect(inToCm(50, false)).toBe(127)
    expect(inToCm(99, false)).toBe(251.46)
  })

  it('should return "*" if it is passed', () => {
    expect(inToCm("*")).toBe("*")
  })
})
