import { findClosestIndex, fitInside, getMeasurements } from "../geometry"

describe(fitInside, () => {
  it("returns one of the given boxes if they are the same", () => {
    expect(fitInside({ width: 10, height: 10 }, { width: 10, height: 10 })).toMatchObject({
      width: 10,
      height: 10,
      marginHorizontal: 0,
      marginVertical: 0,
    })
  })

  it("constrains the box by height if it is too tall", () => {
    expect(fitInside({ width: 10, height: 10 }, { width: 10, height: 20 })).toMatchObject({
      width: 5,
      height: 10,
      marginHorizontal: 2.5,
      marginVertical: 0,
    })
  })

  it("constrains the box by width if it is too wide", () => {
    expect(fitInside({ width: 10, height: 10 }, { width: 20, height: 10 })).toMatchObject({
      width: 10,
      height: 5,
      marginHorizontal: 0,
      marginVertical: 2.5,
    })
  })
})

describe(getMeasurements, () => {
  it("arranges images on the carousel rail", () => {
    expect(
      getMeasurements({
        images: [
          {
            width: 10,
            height: 10,
          },
          {
            width: 10,
            height: 10,
          },
        ],
        boundingBox: { width: 10, height: 10 },
      })
    ).toMatchObject([
      {
        width: 10,
        height: 10,
        cumulativeScrollOffset: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
      },
      {
        width: 10,
        height: 10,
        cumulativeScrollOffset: 30,
        marginBottom: 0,
        marginLeft: 20,
        marginRight: 0,
        marginTop: 0,
      },
    ])
  })

  it("collapses margins between images", () => {
    expect(
      getMeasurements({
        images: [
          {
            width: 5,
            height: 10,
          },
          {
            width: 5,
            height: 10,
          },
        ],
        boundingBox: { width: 10, height: 10 },
      })
    ).toMatchObject([
      {
        width: 5,
        height: 10,
        cumulativeScrollOffset: 0,
        marginLeft: 2.5,
        marginRight: 2.5,
        marginBottom: 0,
        marginTop: 0,
      },
      {
        width: 5,
        height: 10,
        cumulativeScrollOffset: 27.5,
        marginLeft: 20,
        marginRight: 2.5,
        marginBottom: 0,
        marginTop: 0,
      },
    ])
  })
})

describe(findClosestIndex, () => {
  it("throws with an ampty array", () => {
    expect(() => findClosestIndex([], 10)).toThrow()
  })

  it("always returns 0 for arrays of length 1", () => {
    expect(findClosestIndex([100], -10)).toBe(0)
    expect(findClosestIndex([100], 10)).toBe(0)
    expect(findClosestIndex([100], 101)).toBe(0)
  })

  it("returns the closest index when given more than one offset", () => {
    expect(findClosestIndex([100, 200], -10)).toBe(0)
    expect(findClosestIndex([100, 200], 0)).toBe(0)
    expect(findClosestIndex([100, 200], 99)).toBe(0)
    expect(findClosestIndex([100, 200], 149)).toBe(0)
    expect(findClosestIndex([100, 200], 150)).toBe(1)
    expect(findClosestIndex([100, 200], 390)).toBe(1)

    expect(findClosestIndex([100, 200, 400], -10)).toBe(0)
    expect(findClosestIndex([100, 200, 400], 0)).toBe(0)
    expect(findClosestIndex([100, 200, 400], 99)).toBe(0)
    expect(findClosestIndex([100, 200, 400], 149)).toBe(0)
    expect(findClosestIndex([100, 200, 400], 150)).toBe(1)
    expect(findClosestIndex([100, 200, 400], 390)).toBe(2)
    expect(findClosestIndex([100, 200, 400], 459)).toBe(2)
  })
})
