import { ArtworkDetails_artwork$data } from "__generated__/ArtworkDetails_artwork.graphql"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Theme } from "palette"
import React from "react"
import { ArtworkDetails } from "./ArtworkDetails"

jest.unmock("react-relay")

describe("Artwork Details", () => {
  const mountArtworkDetails = (artwork: ArtworkDetails_artwork$data) =>
    mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkDetails artwork={artwork} />
        </Theme>
      </GlobalStoreProvider>
    )

  it("renders the data if available", () => {
    const testArtwork: ArtworkDetails_artwork$data = {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
      canRequestLotConditionsReport: false,
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
    const testArtwork: ArtworkDetails_artwork$data = {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
      canRequestLotConditionsReport: false,
    }

    const artworkDetailsInfo = {
      artwork: testArtwork,
    }

    const component = mountArtworkDetails(artworkDetailsInfo.artwork)
    expect(component.text()).not.toContain("Certificate of Authenticity")
    expect(component.text()).not.toContain("Frame")
    expect(component.text()).not.toContain("Signature")
  })

  it("shows condition description if present and lot condition report disabled", () => {
    const testArtwork: ArtworkDetails_artwork$data = {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
      canRequestLotConditionsReport: false,
    }

    const artworkDetailsInfo = {
      artwork: testArtwork,
    }

    const component = mountArtworkDetails(artworkDetailsInfo.artwork)
    expect(component.text()).toContain("Condition")
    expect(component.text()).toContain("Amazing condition")
  })

  it("shows request condition report if lot condition report enabled and feature flag is enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsLotConditionReport: true })

    const testArtwork: ArtworkDetails_artwork$data = {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
      canRequestLotConditionsReport: true,
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

  it("does not show request condition report if lot condition report enabled and feature flag is disabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsLotConditionReport: false })

    const testArtwork: ArtworkDetails_artwork$data = {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
      canRequestLotConditionsReport: true,
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
