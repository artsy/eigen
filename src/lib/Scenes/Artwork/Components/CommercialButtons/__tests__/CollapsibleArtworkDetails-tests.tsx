import { InquiryButtons_artwork } from "__generated__/InquiryButtons_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { CollapsibleArtworkDetails } from "../CollapsibleArtworkDetails"

const testArtwork: InquiryButtons_artwork = {
  title: "Dance",
  date: "n/a",
  medium: "Canvas/Oil",
  internalID: "xyz",
  isPriceHidden: false,
  editionOf: "100",
  dimensions: {
    in: "59 1/10 × 59 1/10 in",
    cm: "150 × 150 cm",
  },
  image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/gpCChJoRzYT3-cpz_R3M_A/medium.jpg",
    width: 801,
    height: 801,
  },
  signatureInfo: {
    details: "Hand-signed by artist",
  },
  artist: {
    name: "Alexey Terenin",
  },
  " $refType": "InquiryButtons_artwork",
}

describe("CollapsibleArtworkDetails", () => {
  it("renders the data if available", () => {
    const component = renderWithWrappers(<CollapsibleArtworkDetails artwork={testArtwork} />)
    expect(component.root.findAllByType(OpaqueImageView)).toHaveLength(1)
    expect(component.root.findAllByType(Text)).toHaveLength(2)
  })

  it("expands component on press", () => {
    const component = renderWithWrappers(<CollapsibleArtworkDetails artwork={testArtwork} />)
    expect(component.root.findAllByType(Text)).toHaveLength(2)
    component.root.findByType(TouchableOpacity).props.onPress()
    expect(component.root.findAllByType(Text)).toHaveLength(10)
  })

  it("doesn't render what it doesn't have", () => {
    const testArtworkNoSig = {
      ...testArtwork,
      signatureInfo: null,
    }
    const component = renderWithWrappers(<CollapsibleArtworkDetails artwork={testArtworkNoSig} />)
    component.root.findByType(TouchableOpacity).props.onPress()
    expect(component.root.findAllByType(Text)).toHaveLength(8)
  })
})
