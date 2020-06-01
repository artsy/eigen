import { cloneDeep } from "lodash"
import { first, last } from "lodash"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { SalesRail_salesModule } from "__generated__/SalesRail_salesModule.graphql"
import { extractText } from "lib/tests/extractText"

import { Theme } from "@artsy/palette"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))
import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { CardRailCard } from "lib/Components/Home/CardRailCard"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../../homeAnalytics"
import { SalesRailFragmentContainer } from "../SalesRail"

const trackEvent = jest.fn()
const mockScrollRef = jest.fn()

const artworkNode = {
  node: {
    artwork: {
      image: { url: "https://example.com/image.jpg" },
    },
  },
}
const salesModule: Omit<SalesRail_salesModule, " $refType"> = {
  results: [
    {
      id: "the-sale",
      internalID: "the-sale-internal-id",
      slug: "the-sales-slug",
      name: "The Sale",
      href: "/auction/the-sale",
      liveURLIfOpen: null,
      liveStartAt: null,
      displayTimelyAt: "in 1 day",
      saleArtworksConnection: {
        edges: [artworkNode, artworkNode, artworkNode],
      },
    },
    {
      id: "the-lai-sale",
      internalID: "the-sale-internal-id",
      slug: "the-sales-slug",
      name: "The LAI Sale",
      href: "/auction/the-lai-sale",
      liveURLIfOpen: "https://live.artsy.net/the-lai-sale",
      liveStartAt: "2020-04-09T17:00:00+00:00",
      displayTimelyAt: "live in 1 day",
      saleArtworksConnection: {
        edges: [artworkNode, artworkNode, artworkNode],
      },
    },
  ],
}

it("doesn't throw when rendered", () => {
  expect(() =>
    renderer.create(
      <Theme>
        <SalesRailFragmentContainer salesModule={salesModule as any} scrollRef={mockScrollRef} />
      </Theme>
    )
  ).not.toThrow()
})

it("looks correct when rendered with sales missing artworks", () => {
  const salesCopy = cloneDeep(salesModule)
  salesCopy.results.forEach(result => {
    // @ts-ignore
    result.saleArtworksConnection.edges = []
  })
  expect(() =>
    renderer.create(
      <Theme>
        <SalesRailFragmentContainer salesModule={salesCopy as any} scrollRef={mockScrollRef} />
      </Theme>
    )
  ).not.toThrow()
})

describe("image handling", () => {
  const render = (edges: any[]) => {
    const { results } = cloneDeep(salesModule)
    const sale = results[0]
    // @ts-ignore
    sale!.saleArtworksConnection!.edges = edges
    return renderer.create(
      <Theme>
        <SalesRailFragmentContainer salesModule={{ results: [sale] } as any} scrollRef={mockScrollRef} />
      </Theme>
    )
  }

  it("renders all 3 images", () => {
    const tree = render([
      { node: { artwork: { image: { url: "https://example.com/image-1.jpg" } } } },
      { node: { artwork: { image: { url: "https://example.com/image-2.jpg" } } } },
      { node: { artwork: { image: { url: "https://example.com/image-3.jpg" } } } },
    ])
    expect(tree.root.findAllByType(ImageView).map(({ props }) => props.imageURL)).toEqual([
      "https://example.com/image-1.jpg",
      "https://example.com/image-2.jpg",
      "https://example.com/image-3.jpg",
    ])
  })

  it("renders the 2nd image as a fallback if the 3rd is missing", () => {
    const tree = render([
      { node: { artwork: { image: { url: "https://example.com/image-1.jpg" } } } },
      { node: { artwork: { image: { url: "https://example.com/image-2.jpg" } } } },
    ])
    expect(tree.root.findAllByType(ImageView).map(({ props }) => props.imageURL)).toEqual([
      "https://example.com/image-1.jpg",
      "https://example.com/image-2.jpg",
      "https://example.com/image-2.jpg",
    ])
  })

  it("renders the 1st as a fallback if the 2nd and 3rd are missing", () => {
    const tree = render([{ node: { artwork: { image: { url: "https://example.com/image-1.jpg" } } } }])
    expect(tree.root.findAllByType(ImageView).map(({ props }) => props.imageURL)).toEqual([
      "https://example.com/image-1.jpg",
      "https://example.com/image-1.jpg",
      "https://example.com/image-1.jpg",
    ])
  })
})

it("renders the correct subtitle based on auction type", async () => {
  const tree = renderer.create(
    <Theme>
      <SalesRailFragmentContainer salesModule={salesModule as any} scrollRef={mockScrollRef} />
    </Theme>
  )
  const subtitles = tree.root.findAllByProps({ "data-test-id": "sale-subtitle" })
  // Timed sale
  // @ts-ignore STRICTNESS_MIGRATION
  expect(extractText(first(subtitles))).toMatchInlineSnapshot(`"Timed Auction • In 1 day"`)
  // LAI sale
  // @ts-ignore STRICTNESS_MIGRATION
  expect(extractText(last(subtitles))).toMatchInlineSnapshot(`"Live Auction • Live in 1 day"`)
})

it("routes to live URL if present, otherwise href", () => {
  const tree = renderer.create(
    <Theme>
      <SalesRailFragmentContainer salesModule={salesModule as any} scrollRef={mockScrollRef} />
    </Theme>
  )
  // Timed sale
  // @ts-ignore STRICTNESS_MIGRATION
  first(tree.root.findAllByType(CardRailCard)).props.onPress()
  expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/auction/the-sale")
  // LAI sale
  // @ts-ignore STRICTNESS_MIGRATION
  last(tree.root.findAllByType(CardRailCard)).props.onPress()
  expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
    expect.anything(),
    "https://live.artsy.net/the-lai-sale"
  )
})

describe("analytics", () => {
  beforeEach(() => {
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  it("tracks auction header taps", () => {
    const tree = renderer.create(
      <Theme>
        <SalesRailFragmentContainer salesModule={salesModule as any} scrollRef={mockScrollRef} />
      </Theme>
    )
    tree.root.findByType(SectionTitle as any).props.onPress()
    expect(trackEvent).toHaveBeenCalledWith(HomeAnalytics.auctionHeaderTapEvent())
  })

  it("tracks auction thumbnail taps", () => {
    const tree = renderer.create(
      <Theme>
        <SalesRailFragmentContainer salesModule={salesModule as any} scrollRef={mockScrollRef} />
      </Theme>
    )
    const cards = tree.root.findAllByType(CardRailCard)
    cards[0].props.onPress()
    expect(trackEvent).toHaveBeenCalledWith(
      HomeAnalytics.auctionThumbnailTapEvent("the-sale-internal-id", "the-sales-slug", 0)
    )
  })
})
