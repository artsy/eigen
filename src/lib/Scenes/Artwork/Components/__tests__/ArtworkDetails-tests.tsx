import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { ArtworkDetails } from "../ArtworkDetails"

jest.unmock("react-relay")

describe("Artwork Details", () => {
  const mountArtworkDetails = (artwork: any) =>
    mount(
      <Theme>
        <ArtworkDetails artwork={artwork} />
      </Theme>
    )

  it("renders the data if available", () => {
    const artworkDetailsInfo = {
      artwork: {
        " $refType": null,
        category: "Oil on canvas",
        conditionDescription: null,
        signatureInfo: { label: "Signature", details: "Signed by artist" },
        certificateOfAuthenticity: { label: "Certificate of Authenticity", details: "Not included" },
        framed: { label: "Framed", details: "Included" },
        series: null,
        publisher: null,
        manufacturer: null,
        image_rights: null,
      },
    }

    const component = mountArtworkDetails(artworkDetailsInfo.artwork)
    expect(component.text()).toContain("Artwork details")
    expect(component.text()).toContain("SignatureSigned by artist")
    expect(component.text()).toContain("MediumOil")
    expect(component.text()).toContain("Certificate of AuthenticityNot included")
    expect(component.text()).toContain("FrameIncluded")
  })

  it("hides certificate of authenticity, framed, and signature fields if null", () => {
    const artworkDetailsInfo = {
      artwork: {
        " $refType": null,
        category: "Oil on canvas",
        conditionDescription: null,
        signatureInfo: null,
        certificateOfAuthenticity: null,
        framed: null,
        series: null,
        publisher: null,
        manufacturer: null,
        image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      },
    }

    const component = mountArtworkDetails(artworkDetailsInfo.artwork)
    expect(component.text()).not.toContain("Certificate of Authenticity")
    expect(component.text()).not.toContain("Frame")
    expect(component.text()).not.toContain("Signature")
  })

  it("shows condition description if present and not biddable", () => {
    const artworkDetailsInfo = {
      artwork: {
        " $refType": null,
        category: "Oil on canvas",
        conditionDescription: {
          details: "Amazing condition",
        },
        signatureInfo: null,
        certificateOfAuthenticity: null,
        framed: null,
        series: null,
        publisher: null,
        manufacturer: null,
        image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      },
    }
    const component = mountArtworkDetails(artworkDetailsInfo.artwork)
    expect(component.text()).toContain("Condition")
    expect(component.text()).toContain("Amazing condition")
  })

  it.only("shows request condition report if biddable", () => {
    const artworkDetailsInfo = {
      artwork: {
        " $refType": null,
        category: "Oil on canvas",
        conditionDescription: {
          label: "Condition",
          details: "Amazing condition",
        },
        isBiddable: true,
        signatureInfo: null,
        certificateOfAuthenticity: null,
        framed: null,
        series: null,
        publisher: null,
        manufacturer: null,
        image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      },
    }
    const component = mountArtworkDetails(artworkDetailsInfo.artwork)
    expect(component.text()).toContain("Condition")
    expect(component.text()).not.toContain("Amazing condition")
    const requestReportQueryRenderer = component.find("RequestConditionReportQueryRenderer")
    expect(requestReportQueryRenderer.length).toEqual(1)
  })
})
