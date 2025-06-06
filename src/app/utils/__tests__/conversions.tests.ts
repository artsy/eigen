import { cm2in, in2cm } from "app/utils/conversions"

describe(cm2in, () => {
  it("converts cm to inches correctly", () => {
    expect(cm2in(1)).toBeCloseTo(0.393)
    expect(cm2in(2.54)).toBeCloseTo(1)
  })
})

describe(in2cm, () => {
  it("converts inches to cm correctly", () => {
    expect(in2cm(1)).toBeCloseTo(2.54)
    expect(in2cm(0.393)).toBeCloseTo(1)
  })
})
