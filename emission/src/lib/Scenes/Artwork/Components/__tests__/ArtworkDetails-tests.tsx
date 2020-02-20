import { Theme } from "@artsy/palette"
import { ArtworkDetails_artwork } from "__generated__/ArtworkDetails_artwork.graphql"
import { mount } from "enzyme"
import React from "react"
import { NativeModules } from "react-native"
import { ArtworkDetails } from "../ArtworkDetails"

jest.unmock("react-relay")

describe("Artwork Details", () => {
  const mountArtworkDetails = (artwork: ArtworkDetails_artwork) =>
    mount(
      <Theme>
        <ArtworkDetails artwork={artwork} />
      </Theme>
    )

  it("renders the data if available", () => {
    const testArtwork: ArtworkDetails_artwork = {
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
      slug: "some-slug",
      isBiddable: false,
      saleArtwork: {
        internalID: "some-id",
      },
    }

    const artworkDetailsInfo = {
      artwork: testArtwork,
    }

    const component = mountArtworkDetails(artworkDetailsInfo.artwork)
    expect(component.text()).toContain("Artwork details")
    expect(component.text()).toContain("SignatureSigned by artist")
    expect(component.text()).toContain("MediumOil")
    expect(component.text()).toContain("Certificate of AuthenticityNot included")
    expect(component.text()).toContain("FrameIncluded")
  })

  it("hides certificate of authenticity, framed, and signature fields if null", () => {
    const testArtwork: ArtworkDetails_artwork = {
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
      slug: "some-slug",
      isBiddable: false,
      saleArtwork: {
        internalID: "some-id",
      },
    }

    const artworkDetailsInfo = {
      artwork: testArtwork,
    }

    const component = mountArtworkDetails(artworkDetailsInfo.artwork)
    expect(component.text()).not.toContain("Certificate of Authenticity")
    expect(component.text()).not.toContain("Frame")
    expect(component.text()).not.toContain("Signature")
  })

  it("shows condition description if present and not biddable", () => {
    const testArtwork: ArtworkDetails_artwork = {
      " $refType": null,
      category: "Oil on canvas",
      conditionDescription: {
        label: "some label",
        details: "Amazing condition",
      },
      signatureInfo: null,
      certificateOfAuthenticity: null,
      framed: null,
      series: null,
      publisher: null,
      manufacturer: null,
      image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      slug: "some-slug",
      isBiddable: false,
      saleArtwork: {
        internalID: "some-id",
      },
    }

    const artworkDetailsInfo = {
      artwork: testArtwork,
    }

    const component = mountArtworkDetails(artworkDetailsInfo.artwork)
    expect(component.text()).toContain("Condition")
    expect(component.text()).toContain("Amazing condition")
  })

  it("shows request condition report if biddable and feature flag is enabled", () => {
    NativeModules.Emission = {
      options: {
        AROptionsLotConditionReport: true,
      },
    }

    const testArtwork: ArtworkDetails_artwork = {
      " $refType": null,
      category: "Oil on canvas",
      conditionDescription: {
        label: "some label",
        details: "Amazing condition",
      },
      signatureInfo: null,
      certificateOfAuthenticity: null,
      framed: null,
      series: null,
      publisher: null,
      manufacturer: null,
      image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      slug: "some-slug",
      isBiddable: true,
      saleArtwork: {
        internalID: "some-id",
      },
    }

    const artworkDetailsInfo = {
      artwork: testArtwork,
    }

    const component = mountArtworkDetails(artworkDetailsInfo.artwork)
    expect(component.text()).toContain("Condition")
    expect(component.text()).not.toContain("Amazing condition")
    const requestReportQueryRenderer = component.find("RequestConditionReportQueryRenderer")
    expect(requestReportQueryRenderer.length).toEqual(1)
  })

  it("does not show request condition report if biddable and feature flag is disabled", () => {
    NativeModules.Emission = {
      options: {
        AROptionsLotConditionReport: false,
      },
    }

    const testArtwork: ArtworkDetails_artwork = {
      " $refType": null,
      category: "Oil on canvas",
      conditionDescription: {
        label: "some label",
        details: "Amazing condition",
      },
      signatureInfo: null,
      certificateOfAuthenticity: null,
      framed: null,
      series: null,
      publisher: null,
      manufacturer: null,
      image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      slug: "some-slug",
      isBiddable: true,
      saleArtwork: {
        internalID: "some-id",
      },
    }

    const artworkDetailsInfo = {
      artwork: testArtwork,
    }

    const component = mountArtworkDetails(artworkDetailsInfo.artwork)
    expect(component.text()).toContain("Amazing condition")
    const requestReportQueryRenderer = component.find("RequestConditionReportQueryRenderer")
    expect(requestReportQueryRenderer.length).toEqual(0)
  })
})
