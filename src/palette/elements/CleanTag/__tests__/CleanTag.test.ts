import { shallow } from "enzyme"
import React from "react"
import { CleanTag } from "../CleanTag"

describe("CleanTag", () => {
  it("omits props", () => {
    const wrap = shallow(
      React.createElement(CleanTag, {
        // @ts-ignore
        id: "hello",
        theme: {},
        m: 2,
        px: 3,
        color: "blue",
      })
    )
    expect(wrap.prop("id")).toBe("hello")
    expect(wrap.prop("theme")).toBeUndefined()
    expect(wrap.prop("m")).toBeUndefined()
    expect(wrap.prop("px")).toBeUndefined()
    expect(wrap.prop("color")).toBeUndefined()
  })

  it("allows the type of element to be specified", () => {
    const wrap = shallow(React.createElement(CleanTag.as("span")))
    expect(wrap.type()).toBe("span")
  })

  it("allows the type of element to be overloaded by props", () => {
    const wrap = shallow(
      React.createElement(CleanTag, {
        is: "section",
      })
    )
    expect(wrap.type()).toBe("section")
  })

  xit("allows customization of which props are omitted", () => {
    const wrap = shallow(
      React.createElement(CleanTag, {
        omitFromProps: ["foo"],
        // @ts-ignore
        foo: "bar",
        theme: [],
      })
    )
    expect(wrap.prop("foo")).toBeUndefined()
    expect(wrap.prop("theme")).toBeDefined()
  })
})
