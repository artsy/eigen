import { sizeToFit } from "app/utils/useSizeToFit"

describe(sizeToFit, () => {
  it("keeps size if the box can be contained already", () => {
    const toBeContained = { width: 100, height: 100 }
    const container = { width: 200, height: 200 }

    const output = sizeToFit(toBeContained, container)
    expect(output).toEqual({ width: 100, height: 100 })
  })

  it("resizes if the box is wider than the container", () => {
    const toBeContained = { width: 400, height: 100 }
    const container = { width: 200, height: 200 }

    const output = sizeToFit(toBeContained, container)
    expect(output).toEqual({
      width: 200, // equal to the container width, since that's the biggest dimension
      height: 50, // the toBeContained height but resized so that the aspect ratio is maintained
    })
  })

  it("resizes if the box is taller than the container", () => {
    const toBeContained = { width: 100, height: 400 }
    const container = { width: 200, height: 200 }

    const output = sizeToFit(toBeContained, container)
    expect(output).toEqual({
      width: 50, // the toBeContained width but resized so that the aspect ratio is maintained
      height: 200, // equal to the container height, since that's the biggest dimension
    })
  })

  it("resizes if the box is bigger than the container", () => {
    const toBeContained = { width: 300, height: 400 }
    const container = { width: 200, height: 200 }

    const output = sizeToFit(toBeContained, container)
    expect(output).toEqual({
      width: 150, // the toBeContained width but resized so that the aspect ratio is maintained
      height: 200, // equal to the container height, since that's the biggest dimension
    })
  })

  it("works for edge cases", () => {
    expect(sizeToFit({ width: 400, height: 300 }, { width: 200, height: 200 })).toEqual({
      width: 200,
      height: 150,
    })
    expect(sizeToFit({ width: 600, height: 300 }, { width: 200, height: 200 })).toEqual({
      width: 200,
      height: 100,
    })
    expect(sizeToFit({ width: 600, height: 300 }, { width: 200, height: 100 })).toEqual({
      width: 200,
      height: 100,
    })
    expect(sizeToFit({ width: 600, height: 300 }, { width: 100, height: 200 })).toEqual({
      width: 100,
      height: 50,
    })
    expect(sizeToFit({ width: 600, height: 300 }, { width: 200, height: 50 })).toEqual({
      width: 100,
      height: 50,
    })
    expect(sizeToFit({ width: 1000, height: 2000 }, { width: 400, height: 844 })).toEqual({
      width: 400,
      height: 800,
    })
  })
})
