import React from "react"
import { Collapse } from "./Collapse"

describe("Collapse", () => {
  it("is visible (height: auto) when open is true", () => {
    const component = __deprecated_mountWithWrappers(
      <Collapse open>The elegant spiral of the Nautilus shell, ...</Collapse>
    )
    expect(component.find("div").prop("style")).toHaveProperty("height", "auto")
  })

  it("is not visible (height: 0) when open is false", () => {
    const component = __deprecated_mountWithWrappers(
      <Collapse open={false}>The elegant spiral of the Nautilus ...</Collapse>
    )

    expect(component.find("div").prop("style")).toHaveProperty("height", "0px")
  })
})
