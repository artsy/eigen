import { SalesRail_salesModule } from "__generated__/SalesRail_salesModule.graphql"
import { CardRailCard } from "lib/Components/Home/CardRailCard"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { cloneDeep , first, last } from "lodash"
import React from "react"
import "react-native"
import HomeAnalytics from "../homeAnalytics"
import { SalesRailFragmentContainer } from "./SalesRail"

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
    renderWithWrappers(
      <SalesRailFragmentContainer title="Auctions" salesModule={salesModule as any} scrollRef={mockScrollRef} />
    )
  ).not.toThrow()
})

it("looks correct when rendered with sales missing artworks", () => {
  const salesCopy = cloneDeep(salesModule)
  salesCopy.results.forEach((result) => {
    // @ts-ignore
    result.saleArtworksConnection.edges = []
  })
  expect(() =>
    renderWithWrappers(
      <SalesRailFragmentContainer title="Auctions" salesModule={salesCopy as any} scrollRef={mockScrollRef} />
    )
  ).not.toThrow()
})

describe("image handling", () => {
  const render = (edges: any[]) => {
    const { results } = cloneDeep(salesModule)
    const sale = results[0]
    // @ts-ignore
    sale!.saleArtworksConnection!.edges = edges
    return renderWithWrappers(
      <SalesRailFragmentContainer title="Auctions" salesModule={{ results: [sale] } as any} scrollRef={mockScrollRef} />
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
  const tree = renderWithWrappers(
    <SalesRailFragmentContainer title="Auctions" salesModule={salesModule as any} scrollRef={mockScrollRef} />
  )
  const subtitles = tree.root.findAllByProps({ testID: "sale-subtitle" })
  // Timed sale
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  expect(extractText(first(subtitles))).toMatchInlineSnapshot(`"Timed Auction • In 1 day"`)
  // LAI sale
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  expect(extractText(last(subtitles))).toMatchInlineSnapshot(`"Live Auction • Live in 1 day"`)
})

it("routes to live URL if present, otherwise href", () => {
  const tree = renderWithWrappers(
    <SalesRailFragmentContainer title="Auctions" salesModule={salesModule as any} scrollRef={mockScrollRef} />
  )
  // Timed sale
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  first(tree.root.findAllByType(CardRailCard)).props.onPress()
  expect(navigate).toHaveBeenCalledWith("/auction/the-sale")
  // LAI sale
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  last(tree.root.findAllByType(CardRailCard)).props.onPress()
  expect(navigate).toHaveBeenCalledWith("https://live.artsy.net/the-lai-sale")
})

describe("analytics", () => {
  it("tracks auction header taps", () => {
    const tree = renderWithWrappers(
      <SalesRailFragmentContainer title="Auctions" salesModule={salesModule as any} scrollRef={mockScrollRef} />
    )
    tree.root.findByType(SectionTitle as any).props.onPress()
    expect(mockTrackEvent).toHaveBeenCalledWith(HomeAnalytics.auctionHeaderTapEvent())
  })

  it("tracks auction thumbnail taps", () => {
    const tree = renderWithWrappers(
      <SalesRailFragmentContainer title="Auctions" salesModule={salesModule as any} scrollRef={mockScrollRef} />
    )
    const cards = tree.root.findAllByType(CardRailCard)
    cards[0].props.onPress()
    expect(mockTrackEvent).toHaveBeenCalledWith(
      HomeAnalytics.auctionThumbnailTapEvent("the-sale-internal-id", "the-sales-slug", 0)
    )
  })
})
