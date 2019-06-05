import { mount } from "enzyme"
import React from "react"
import { ArtworkDetails } from "../ArtworkDetails"

jest.unmock("react-relay")

describe("Artwork Details", () => {
  it("renders fields correctly", () => {
    const component = mount(<ArtworkDetails artwork={artworkDetailsInfo.artwork} />)
    expect(component.text()).toContain("Artwork Details")
    expect(component.text()).toContain("MediumOil")
    expect(component.text()).toContain("Certificate of AuthenticityNot Included")
    expect(component.text()).toContain("FrameIncluded")
  })
})

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
