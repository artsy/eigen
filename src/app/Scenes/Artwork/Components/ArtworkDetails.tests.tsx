import { ArtworkDetails_artwork$data } from "__generated__/ArtworkDetails_artwork.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { ArtworkDetails } from "./ArtworkDetails"
import { RequestConditionReportQueryRenderer } from "./RequestConditionReport"

jest.unmock("react-relay")

describe("Artwork Details", () => {
  it("renders the data if available", () => {
    const testArtwork: ArtworkDetails_artwork$data = {
      " $fragmentType": "ArtworkDetails_artwork",
      mediumType: null,
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

    const { queryByText } = renderWithWrappers(
      <ArtworkDetails artwork={artworkDetailsInfo.artwork} />
    )

    expect(queryByText("Artwork details")).toBeTruthy()
    expect(queryByText("Signature")).toBeTruthy()
    expect(queryByText("Signed by artist")).toBeTruthy()
    expect(queryByText("Medium")).toBeTruthy()
    expect(queryByText("Oil on canvas")).toBeTruthy()
    expect(queryByText("Certificate of Authenticity")).toBeTruthy()
    expect(queryByText("Not included")).toBeTruthy()
    expect(queryByText("Frame")).toBeTruthy()
    expect(queryByText("Included")).toBeTruthy()
  })

  it("hides certificate of authenticity, framed, and signature fields if null", () => {
    const testArtwork: ArtworkDetails_artwork$data = {
      " $fragmentType": "ArtworkDetails_artwork",
      mediumType: null,
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

    const { queryByText } = renderWithWrappers(
      <ArtworkDetails artwork={artworkDetailsInfo.artwork} />
    )

    expect(queryByText("Certificate of Authenticity")).toBeNull()
    expect(queryByText("Frame")).toBeNull()
    expect(queryByText("Signature")).toBeNull()
  })

  it("shows condition description if present and lot condition report disabled", () => {
    const testArtwork: ArtworkDetails_artwork$data = {
      " $fragmentType": "ArtworkDetails_artwork",
      mediumType: null,
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

    const { queryByText } = renderWithWrappers(
      <ArtworkDetails artwork={artworkDetailsInfo.artwork} />
    )
    expect(queryByText("Condition")).toBeTruthy()
    expect(queryByText("Amazing condition")).toBeTruthy()
  })

  it("shows request condition report if lot condition report enabled and feature flag is enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsLotConditionReport: true })

    const testArtwork: ArtworkDetails_artwork$data = {
      " $fragmentType": "ArtworkDetails_artwork",
      mediumType: null,
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

    const { queryByText, UNSAFE_queryByType } = renderWithWrappers(
      <ArtworkDetails artwork={artworkDetailsInfo.artwork} />
    )

    expect(queryByText("Condition")).toBeTruthy()
    expect(queryByText("Amazing condition")).toBeNull()

    const requestReportQueryRenderer = UNSAFE_queryByType(RequestConditionReportQueryRenderer)
    expect(requestReportQueryRenderer).toBeTruthy()
  })

  it("does not show request condition report if lot condition report enabled and feature flag is disabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsLotConditionReport: false })

    const testArtwork: ArtworkDetails_artwork$data = {
      " $fragmentType": "ArtworkDetails_artwork",
      mediumType: null,
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

    const { queryByText, UNSAFE_queryByType } = renderWithWrappers(
      <ArtworkDetails artwork={artworkDetailsInfo.artwork} />
    )

    expect(queryByText("Condition")).toBeTruthy()
    expect(queryByText("Amazing condition")).toBeTruthy()

    const requestReportQueryRenderer = UNSAFE_queryByType(RequestConditionReportQueryRenderer)
    expect(requestReportQueryRenderer).toBeNull()
  })
})
