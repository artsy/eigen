// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { ArtworkInfoSection_artwork } from "__generated__/ArtworkInfoSection_artwork.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { ArtworkInfoSection } from "../OrderDetails/ArtworkInfoSection"

describe("ArtworkTileRailCard", () => {
  const defaultProps = {
    lineItems: {
      edges: [
        {
          node: {
            artwork: {
              image: {
                resized: {
                  url: "http://placekitten.com/200/200",
                },
              },
              title: "CoronaCats",
              artist_names: "Andy Goldsworthy",
            },
          },
        },
      ],
    },
  }

  it("renders a Text components", () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const tree = renderWithWrappers(<ArtworkInfoSection artwork={defaultProps} />)
    const textFileds = tree.root.findAllByType(Text)
    expect(textFileds.length).toBe(3)
  })
  it("check  Image component props", () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const tree = renderWithWrappers(<ArtworkInfoSection artwork={defaultProps} />)
    const image = tree.root.findByType(Image)
    expect(image.props.source.uri).toEqual("http://placekitten.com/200/200")
  })

  it("renders Image component", () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const tree = renderWithWrappers(<ArtworkInfoSection artwork={defaultProps} />)
    const image = tree.root.findAllByType(Image)
    expect(image.length).toBe(1)
  })
})
