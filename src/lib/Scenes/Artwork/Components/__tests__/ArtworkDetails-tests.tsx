import { mount } from "enzyme"
import React from "react"
import { ArtworkDetails } from "../ArtworkDetails"

jest.unmock("react-relay")

describe("Artwork Details", () => {
  it("shows 3 or less fields inline", () => {
    const artworkDetailsInfo = {
      artwork: {
        " $refType": null,
        category: "Oil on canvas",
        conditionDescription: null,
        signature: null,
        signatureInfo: null,
        certificateOfAuthenticity: { label: "Certificate of Authenticity", details: "Not included" },
        framed: { label: "Framed", details: "Included" },
        series: null,
        publisher: null,
        manufacturer: null,
        image_rights: null,
      },
    }

    const component = mount(<ArtworkDetails artwork={artworkDetailsInfo.artwork} />)
    expect(component.text()).toContain("Artwork Details")
    expect(component.text()).toContain("MediumOil")
    expect(component.text()).toContain("Certificate of AuthenticityNot included")
    expect(component.text()).toContain("FrameIncluded")
  })

  it("truncated fields when there are more than 3", () => {
    const artworkDetailsInfo = {
      artwork: {
        " $refType": null,
        category: "Oil on canvas",
        conditionDescription: { label: "nice", details: "Included" },
        signature: null,
        signatureInfo: null,
        certificateOfAuthenticity: { label: "Certificate of Authenticity", details: "Not included" },
        framed: { label: "Framed", details: "Included" },
        series: null,
        publisher: null,
        manufacturer: null,
        image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      },
    }

    const component = mount(<ArtworkDetails artwork={artworkDetailsInfo.artwork} />)
    expect(component.text()).toContain("Artwork Details")
    expect(component.text()).toContain("MediumOil")
    expect(component.text()).toContain("Conditionnice")
    expect(component.text()).toContain("Certificate of AuthenticityNot included")
    expect(component.text()).not.toContain("FrameIncluded")
    expect(component.text()).not.toContain("Image Rights")
    expect(component.text()).toContain("Show more artwork details")
  })

  it("shows top 3 fields if >3 and show more button to reveal the rest", () => {
    const artworkDetailsInfo = {
      artwork: {
        " $refType": null,
        category: "Oil on canvas",
        conditionDescription: { label: "nice", details: "Included" },
        signature: null,
        signatureInfo: null,
        certificateOfAuthenticity: { label: "Certificate of Authenticity", details: "Not included" },
        framed: { label: "Framed", details: "Included" },
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
    expect(component.text()).toContain("Certificate of AuthenticityNot included")
    expect(component.text()).not.toContain("FrameIncluded")

    expect(
      component
        .find("Sans")
        .last()
        .text()
    ).toEqual("Show more artwork details")

    component
      .findWhere(c => c.props().onPress !== undefined)
      .last()
      .props()
      .onPress()

    expect(component.text()).toContain("FrameIncluded")
    expect(component.text()).not.toContain("Show more artwork details")
  })

  it("hides certificate of authenticity and framed fields if null", () => {
    const artworkDetailsInfo = {
      artwork: {
        " $refType": null,
        category: "Oil on canvas",
        conditionDescription: null,
        signature: null,
        signatureInfo: null,
        certificateOfAuthenticity: null,
        framed: null,
        series: null,
        publisher: null,
        manufacturer: null,
        image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      },
    }

    const component = mount(<ArtworkDetails artwork={artworkDetailsInfo.artwork} />)
    expect(component.text()).not.toContain("Certificate of Authenticity")
    expect(component.text()).not.toContain("Frame")
  })

  it("shows certificate of authenticity and framed fields if data is present", () => {
    const artworkDetailsInfo = {
      artwork: {
        " $refType": null,
        category: "Oil on canvas",
        conditionDescription: null,
        signature: null,
        signatureInfo: null,
        certificateOfAuthenticity: { label: "Certificate of Authenticity", details: "Included" },
        framed: { label: "Framed", details: "Not included" },
        series: null,
        publisher: null,
        manufacturer: null,
        image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      },
    }

    const component = mount(<ArtworkDetails artwork={artworkDetailsInfo.artwork} />)
    expect(component.text()).toContain("Certificate of AuthenticityIncluded")
    expect(component.text()).toContain("FrameNot included")
  })
})
