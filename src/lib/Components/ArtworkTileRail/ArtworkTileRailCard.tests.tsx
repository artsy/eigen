// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React from "react"
import { ArtworkTileRailCard, ArtworkTileRailCardProps } from "./ArtworkTileRailCard"

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
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTileRailCard {...props} />
        </Theme>
      </GlobalStoreProvider>
    )

    const imageWidth = 295
    const imageHeight = imageWidth / (props.imageAspectRatio ?? 1)

    const image = result.find("AROpaqueImageView")
    expect(image.length).toBe(1)
    expect(image.prop("height")).toBe(imageHeight)
    expect(image.prop("width")).toBe(imageWidth)
  })

  it("renders the title and date together when both are given", () => {
    const props = defaultProps

    const result = mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTileRailCard {...props} />
        </Theme>
      </GlobalStoreProvider>
    )

    const text = result.find("Text")
    expect(text.at(3).prop("children")).toMatch("CoronaCats, 2020")
  })

  it("renders the title when no date is given", () => {
    const props = {
      ...defaultProps,
      date: undefined,
    }

    const result = mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTileRailCard {...props} />
        </Theme>
      </GlobalStoreProvider>
    )

    const text = result.find("Text")
    expect(text.at(3).prop("children")).toMatch("CoronaCats")
  })

  it("renders no image without imageURL", () => {
    const props = {
      ...defaultProps,
      imageURL: "",
    }

    const result = mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTileRailCard {...props} />
        </Theme>
      </GlobalStoreProvider>
    )

    expect(result.find("AROpaqueImageView").length).toBe(0)
  })

  it("renders without artistNames", () => {
    const props = {
      ...defaultProps,
      artistNames: undefined,
    }

    mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTileRailCard {...props} />
        </Theme>
      </GlobalStoreProvider>
    )
  })

  it("renders without saleMessage", () => {
    const props = {
      ...defaultProps,
      saleMessage: undefined,
    }

    mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTileRailCard {...props} />
        </Theme>
      </GlobalStoreProvider>
    )
  })

  it("renders without an artwork date", () => {
    const props = {
      ...defaultProps,
      date: undefined,
    }

    mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTileRailCard {...props} />
        </Theme>
      </GlobalStoreProvider>
    )
  })

  it("renders without a partner", () => {
    const props = {
      ...defaultProps,
      partner: undefined,
    }

    mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTileRailCard {...props} />
        </Theme>
      </GlobalStoreProvider>
    )
  })

  it("renders without a title", () => {
    const props = {
      ...defaultProps,
      title: undefined,
    }

    mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTileRailCard {...props} />
        </Theme>
      </GlobalStoreProvider>
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
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTileRailCard {...props} />
          </Theme>
        </GlobalStoreProvider>
      )
    ).toThrowError(error)
  })

  it("renders a square image when useSquareAspectRatio is true", () => {
    const props = {
      ...defaultProps,
      useSquareAspectRatio: true,
    }

    const result = mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTileRailCard {...props} />
        </Theme>
      </GlobalStoreProvider>
    )

    const image = result.find("AROpaqueImageView")
    expect(image.prop("height")).toBe(295)
    expect(image.prop("width")).toBe(295)
  })
})
