import { Sans } from "@artsy/palette"
// @ts-ignore STRICTNESS_MIGRATION
import { shallow } from "enzyme"
import React from "react"
import { Header } from "../Header"

describe("ArtworkAvailability", () => {
  it("renders artwork availability correctly", () => {
    const component = shallow(<Header title="This Is A Test" />)
    expect(component.find(Sans).length).toEqual(1)

    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"This Is A Test"`)
  })
})
