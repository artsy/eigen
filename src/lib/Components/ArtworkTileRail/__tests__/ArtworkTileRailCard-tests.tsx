// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import { Theme } from "palette"
import React from "react"
import { ArtworkTileRailCard, ArtworkTileRailCardProps } from "../ArtworkTileRailCard"

describe("ArtworkTileRailCard", () => {
  const defaultProps: ArtworkTileRailCardProps = {
    onPress: jest.fn(),
    imageURL: "http://placekitten.com/200/200",
    artistNames: "Andy Goldsworthy",
    saleMessage: "Sold for $1,200",
    title: "CoronaCats",
    date: "2020",
    partner: { name: "Big Cats Unlimited" },
    imageSize: "large",
    imageAspectRatio: 0.9,
  }

  it("renders an image with an imageURL and maintains the aspect ratio", () => {
    const props = defaultProps

    const result = mount(
      <Theme>
        <ArtworkTileRailCard {...props} />
      </Theme>
    )

    const image = result.find("AROpaqueImageView")
    expect(image.length).toBe(1)
    expect(image.prop("height")).toBe(240)
    expect(image.prop("width")).toBe(216)
  })

  it("renders the title and date together when both are given", () => {
    const props = defaultProps

    const result = mount(
      <Theme>
        <ArtworkTileRailCard {...props} />
      </Theme>
    )

    const sans = result.find("Sans")
    expect(sans.at(1).prop("children")).toMatch("CoronaCats, 2020")
  })

  it("renders the title when no date is given", () => {
    const props = {
      ...defaultProps,
      date: undefined,
    }

    const result = mount(
      <Theme>
        <ArtworkTileRailCard {...props} />
      </Theme>
    )

    const sans = result.find("Sans")
    expect(sans.at(1).prop("children")).toMatch("CoronaCats")
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

  it("renders without an artwork date", () => {
    const props = {
      ...defaultProps,
      date: undefined,
    }

    mount(
      <Theme>
        <ArtworkTileRailCard {...props} />
      </Theme>
    )
  })

  it("renders without a partner", () => {
    const props = {
      ...defaultProps,
      partner: undefined,
    }

    mount(
      <Theme>
        <ArtworkTileRailCard {...props} />
      </Theme>
    )
  })

  it("renders without a title", () => {
    const props = {
      ...defaultProps,
      title: undefined,
    }

    mount(
      <Theme>
        <ArtworkTileRailCard {...props} />
      </Theme>
    )
  })

  it("throws an error when trying to render a non-square image without an aspect ratio", () => {
    const props = {
      ...defaultProps,
      imageAspectRatio: undefined,
    }
    const error = new Error("imageAspectRatio is required for non-square images")

    expect(() =>
      mount(
        <Theme>
          <ArtworkTileRailCard {...props} />
        </Theme>
      )
    ).toThrowError(error)
  })

  it("renders a square image when useSquareAspectRatio is true", () => {
    const props = {
      ...defaultProps,
      useSquareAspectRatio: true,
    }

    const result = mount(
      <Theme>
        <ArtworkTileRailCard {...props} />
      </Theme>
    )

    const image = result.find("AROpaqueImageView")
    expect(image.prop("height")).toBe(240)
    expect(image.prop("width")).toBe(240)
  })
})
