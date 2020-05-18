import { Theme } from "@artsy/palette"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import React from "react"
import { ArtworkTileRailCard } from "../ArtworkTileRailCard"

describe("ArtworkTileRailCard", () => {
  const defaultProps = {
    onPress: jest.fn(),
    imageURL: "http://placekitten.com/200/200",
    artistNames: "Andy Goldsworthy",
    saleMessage: "Sold for $1,200",
  }

  it("renders an image with an imageURL", () => {
    const props = defaultProps

    const result = mount(
      <Theme>
        <ArtworkTileRailCard {...props} />
      </Theme>
    )

    expect(result.find("AROpaqueImageView").length).toBe(1)
  })

  it("renders no image without imageURL", () => {
    const props = {
      ...defaultProps,
      imageURL: "",
    }

    const result = mount(
      <Theme>
        <ArtworkTileRailCard {...props} />
      </Theme>
    )

    expect(result.find("AROpaqueImageView").length).toBe(0)
  })

  it("renders without artistNames", () => {
    const props = {
      ...defaultProps,
      artistNames: undefined,
    }

    mount(
      <Theme>
        <ArtworkTileRailCard {...props} />
      </Theme>
    )
  })

  it("renders without saleMessage", () => {
    const props = {
      ...defaultProps,
      saleMessage: undefined,
    }

    mount(
      <Theme>
        <ArtworkTileRailCard {...props} />
      </Theme>
    )
  })
})
