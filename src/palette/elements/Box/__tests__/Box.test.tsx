import { splitBoxProps } from "../index"

describe("splitBoxProps", () => {
  it("splits props into valid and invalid BoxProps", () => {
    const [boxProps, nonBoxProps] = splitBoxProps({
      position: "absolute",
      foo: "bar",
      bar: { baz: "qux" },
      m: 1,
      px: 4,
      textAlign: "center",
    })

    expect(boxProps).toStrictEqual({
      m: 1,
      position: "absolute",
      px: 4,
      textAlign: "center",
    })

    expect(nonBoxProps).toStrictEqual({ bar: { baz: "qux" }, foo: "bar" })
  })
})
