import { Serif } from "@artsy/palette"
import { shallow } from "enzyme"
import React from "react"
import { Header } from "../Header"

describe("ArtworkAvailability", () => {
  it("renders artwork availability correctly", () => {
    const component = shallow(<Header title="This Is A Test" />)
    expect(component.find(Serif).length).toEqual(1)

    expect(
      component
        .find(Serif)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"This Is A Test"`)
  })
})
