// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { ArtworkInfoSection_artwork } from "__generated__/ArtworkInfoSection_artwork.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { ShipsToSection } from "../OrderDetails/ShipsToSection"

describe("ArtworkTileRailCard", () => {
  const defaultProps = {
    requestedFulfillment: {
      addressLine1: "first address",
      city: "city",
      region: "me region",
      country: "Brazil",
      phoneNumber: "2000",
    },
  }

  it("renders a Text components", () => {
    const tree = renderWithWrappers(<ShipsToSection address={defaultProps as any} />)
    const textFileds = tree.root.findAllByType(Text)
    expect(textFileds.length).toBe(5)
  })
  it("render addressLine1", () => {
    const tree = renderWithWrappers(<ShipsToSection address={defaultProps as any} />)
    expect(extractText(tree.root.findByProps({ "data-test-id": "addressLine1" }))).toBe("first address")
  })

  it("render region", () => {
    const tree = renderWithWrappers(<ShipsToSection address={defaultProps as any} />)
    expect(extractText(tree.root.findByProps({ "data-test-id": "region" }))).toBe("me region")
  })
  it("render city", () => {
    const tree = renderWithWrappers(<ShipsToSection address={defaultProps as any} />)
    expect(extractText(tree.root.findByProps({ "data-test-id": "city" }))).toBe("city")
  })
  it("render country", () => {
    const tree = renderWithWrappers(<ShipsToSection address={defaultProps as any} />)
    expect(extractText(tree.root.findByProps({ "data-test-id": "country" }))).toBe("Brazil")
  })
  it("render phoneNumber", () => {
    const tree = renderWithWrappers(<ShipsToSection address={defaultProps as any} />)
    expect(extractText(tree.root.findByProps({ "data-test-id": "phoneNumber" }))).toBe("2000")
  })
})
