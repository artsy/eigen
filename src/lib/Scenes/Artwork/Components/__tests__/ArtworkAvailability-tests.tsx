import { Sans } from "@artsy/palette"
import { shallow } from "enzyme"
import React from "react"
import { ArtworkAvailability } from "../ArtworkAvailability"

describe("ArtworkAvailability", () => {
  it("renders artwork availability correctly", () => {
    const component = shallow(<ArtworkAvailability artwork={artworkAvailabilityArtwork} />)
    expect(component.find(Sans).length).toEqual(1)

    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"On Loan"`)
  })
})

const artworkAvailabilityArtwork = {
  availability: "on Loan",
  " $refType": null,
}
