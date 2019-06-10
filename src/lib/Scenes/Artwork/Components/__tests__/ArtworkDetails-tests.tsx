import { mount } from "enzyme"
import React from "react"
import { ArtworkDetails } from "../ArtworkDetails"

jest.unmock("react-relay")

describe("Artwork Details", () => {
  it("shows 3 or less fields inline", () => {
    const artworkDetailsInfo = {
      artwork: {
        " $refType": null,
        medium: "Oil on canvas",
        conditionDescription: null,
        signature: null,
        signatureInfo: null,
        certificateOfAuthenticity: null,
        framed: { label: "oh yeah", details: "real nice one" },
        series: null,
        publisher: null,
        manufacturer: null,
        image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      },
    }

    const component = mount(<ArtworkDetails artwork={artworkDetailsInfo.artwork} />)
    expect(component.text()).toContain("Artwork Details")
    expect(component.text()).toContain("MediumOil")
    expect(component.text()).toContain("Certificate of AuthenticityNot Included")
    expect(component.text()).toContain("FrameIncluded")
  })

  it("shows top 3 fields if >3 and show more button to reveal the rest", () => {
    const artworkDetailsInfo = {
      artwork: {
        " $refType": null,
        medium: "Oil on canvas",
        conditionDescription: { label: "nice", details: "real nice one" },
        signature: null,
        signatureInfo: null,
        certificateOfAuthenticity: null,
        framed: { label: "oh yeah", details: "real nice one" },
        series: null,
        publisher: "steve",
        manufacturer: null,
        image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      },
    }

    const component = mount(<ArtworkDetails artwork={artworkDetailsInfo.artwork} />)
    expect(component.text()).toContain("Artwork Details")
    expect(component.text()).toContain("MediumOil")
    expect(component.text()).toContain("Conditionnice")
    expect(component.text()).toContain("Certificate of AuthenticityNot Included")
    expect(component.text()).not.toContain("FrameIncluded")

    expect(
      component
        .find("Sans")
        .last()
        .text()
    ).toEqual("Show more artwork details")

    component
      .find("Text")
      .last()
      .props()
      .onPress()

    expect(component.text()).toContain("FrameIncluded")
    expect(component.text()).not.toContain("Show more artwork details")
  })
})
