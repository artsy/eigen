import { Sans } from "@artsy/palette"
import { shallow } from "enzyme"
import { ReadMore } from "lib/Components/ReadMore"
import React from "react"
import { AboutWork } from "../AboutWork"

describe("AboutWork", () => {
  it("renders the AboutWork correctly if all info is present", () => {
    const component = shallow(<AboutWork artwork={aboutWorkArtwork} />)
    expect(component.find(Sans).length).toEqual(2)
    expect(
      component
        .find(Sans)
        .at(0)
        .text()
    ).toMatchInlineSnapshot(`"About the work"`)
    expect(
      component
        .find(Sans)
        .at(1)
        .text()
    ).toMatchInlineSnapshot(`"From Artsy Specialist:"`)

    expect(component.find(ReadMore).length).toEqual(2)
  })

  it("renders the AboutWork correctly if only additional information is present", () => {
    const artworkNoDescription = { ...aboutWorkArtwork, description: null }

    const component = shallow(<AboutWork artwork={artworkNoDescription} />)
    expect(component.find(Sans).length).toEqual(1)
    expect(
      component
        .find(Sans)
        .at(0)
        .text()
    ).toMatchInlineSnapshot(`"About the work"`)

    expect(component.find(ReadMore).length).toEqual(1)
  })

  it("renders the AboutWork correctly if only description is present", () => {
    const artworkNoAdditionalInfo = { ...aboutWorkArtwork, additional_information: null }

    const component = shallow(<AboutWork artwork={artworkNoAdditionalInfo} />)
    expect(component.find(Sans).length).toEqual(2)
    expect(
      component
        .find(Sans)
        .at(0)
        .text()
    ).toMatchInlineSnapshot(`"About the work"`)

    expect(
      component
        .find(Sans)
        .at(1)
        .text()
    ).toMatchInlineSnapshot(`"From Artsy Specialist:"`)

    expect(component.find(ReadMore).length).toEqual(1)
  })

  it("renders nothing if no information is present", () => {
    const artworkNoInfo = { ...aboutWorkArtwork, additional_information: null, description: null }

    const component = shallow(<AboutWork artwork={artworkNoInfo} />)
    expect(component.find(Sans).length).toEqual(0)
  })
})

const aboutWorkArtwork = {
  additional_information: "This is some information about the artwork by the gallery.",
  description: "This is some information about the artwork by Artsy.",
  " $refType": null,
}
