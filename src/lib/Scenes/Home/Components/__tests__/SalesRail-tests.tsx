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
import { SectionTitle } from "lib/Components/SectionTitle"
import HomeAnalytics from "../../homeAnalytics"
import { SalesRailFragmentContainer } from "../SalesRail"


const mockTrackEvent = jest.fn()
const mockGetTrackingData = jest.fn()
const mockTracking = { trackEvent: mockTrackEvent, getTrackingData: mockGetTrackingData}

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
        <SalesRailFragmentContainer salesModule={salesModule as any} tracking={mockTracking} />
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
        <SalesRailFragmentContainer salesModule={salesModule as any} tracking={mockTracking}/>
      </Theme>
    )
  ).not.toThrow()
})

it("renders the correct subtitle based on auction type", async () => {


  const tree = renderer.create(
    <Theme>
      <SalesRailFragmentContainer salesModule={salesModule as any} tracking={mockTracking} />
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
      <SalesRailFragmentContainer salesModule={salesModule as any} tracking={mockTracking}/>
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
  it("tracks auction header taps", () => {
    const tree = renderer.create(
      <Theme>
        <SalesRailFragmentContainer salesModule={salesModule as any} tracking={mockTracking}/>
      </Theme>
    )
    tree.root.findByType(SectionTitle as any).props.onPress()
    expect(mockTrackEvent).toHaveBeenCalledWith(
      HomeAnalytics.auctionHeaderTapEvent()
    )
  })

  it("tracks auction thumbnail taps", () => {
    const tree = renderer.create(
      <Theme>
        <SalesRailFragmentContainer salesModule={salesModule as any} tracking={mockTracking}/>
      </Theme>
    )
    const cards =  tree.root.findAllByType(CardRailCard)
    cards[0].props.onPress()
    expect(mockTrackEvent).toHaveBeenCalledWith(
      HomeAnalytics.auctionThumbnailTapEvent("the-sale-internal-id", "the-sales-slug")
    )
  })


})

