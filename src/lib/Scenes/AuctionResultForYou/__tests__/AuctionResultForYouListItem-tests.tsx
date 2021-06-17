import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { capitalize } from "lodash"
import { NoArtworkIcon } from "palette"
import React from "react"
import { AuctionResultForYouListItem } from "../AuctionResultForYouListItem"

jest.unmock("react-relay")

const mockAuctionResultForYouListItemData = {
  currency: "GBP",
  dateText: "2002",
  id: "QXVjdGlvblJlc3VsdDozMjM0OTE=",
  internalID: "323491",
  images: {
    thumbnail: {
      url: "https://d2v80f5yrouhh2.cloudfront.net/h5FmZDNX7NsABDszxsFRGQ/thumbnail.jpg",
      height: null,
      width: null,
      aspectRatio: 1,
    },
  },
  estimate: {
    low: 40000000,
  },
  mediumText: "spray paint on canvas",
  organization: "Sotheby's",
  boughtIn: false,
  performance: {
    mid: "72%",
  },
  priceRealized: {
    display: "£862,000",
    cents: 86200000,
  },
  saleDate: "2021-04-07T03:00:00+03:00",
  title: "Laugh Now",
}

const mockAuctionResultForYouListItemDataWithoutThumbnail = {
  currency: "GBP",
  dateText: "2002",
  id: "QXVjdGlvblJlc3VsdDozMjM0OTE=",
  internalID: "323491",
  images: {
    thumbnail: {
      url: null,
      height: null,
      width: null,
      aspectRatio: 1,
    },
  },
  estimate: {
    low: 40000000,
  },
  mediumText: "spray paint on canvas",
  organization: "Sotheby's",
  boughtIn: false,
  performance: {
    mid: "72%",
  },
  priceRealized: {
    display: "£862,000",
    cents: 86200000,
  },
  saleDate: "2021-04-07T03:00:00+03:00",
  title: "Laugh Now",
}

const mockAuctionResultForYouListItemDataWithoutPrice = {
  currency: "GBP",
  dateText: "2002",
  id: "QXVjdGlvblJlc3VsdDozMjM0OTE=",
  internalID: "323491",
  images: {
    thumbnail: {
      url: "https://d2v80f5yrouhh2.cloudfront.net/h5FmZDNX7NsABDszxsFRGQ/thumbnail.jpg",
      height: null,
      width: null,
      aspectRatio: 1,
    },
  },
  estimate: {
    low: 40000000,
  },
  mediumText: "spray paint on canvas",
  organization: "Sotheby's",
  boughtIn: false,
  performance: {
    mid: "72%",
  },
  priceRealized: {
    display: null,
    cents: null,
  },
  saleDate: "2021-04-07T03:00:00+03:00",
  title: "Laugh Now",
}

describe("AuctionResultForYouListItem", () => {
  const renderAuctionResult = (mockData: any = mockAuctionResultForYouListItemData) => {
    const tree = renderWithWrappers(<AuctionResultForYouListItem auctionResult={mockData} />)

    return tree
  }

  it("renders without throwing an error", () => {
    const tree = renderAuctionResult()

    expect(tree.root.findByType(AuctionResultForYouListItem)).toBeDefined()
  })

  it("renders with a thumbnail", () => {
    const tree = renderAuctionResult()

    expect(tree.root.findByType(OpaqueImageView)).toBeDefined()
  })

  it("renders without a thumbnail", () => {
    const tree = renderAuctionResult(mockAuctionResultForYouListItemDataWithoutThumbnail)

    expect(tree.root.findByType(NoArtworkIcon)).toBeDefined()
  })

  it("displaying data in an auction result item", () => {
    const tree = renderAuctionResult()

    expect(extractText(tree.root)).toContain(capitalize(mockAuctionResultForYouListItemData.mediumText))
    expect(extractText(tree.root)).toContain(mockAuctionResultForYouListItemData.organization)
    expect(extractText(tree.root)).toContain(mockAuctionResultForYouListItemData.priceRealized.display)
    expect(extractText(tree.root)).toContain(mockAuctionResultForYouListItemData.performance.mid)
  })

  it("renders Not available label in the case rendering a component without a price", () => {
    const tree = renderAuctionResult(mockAuctionResultForYouListItemDataWithoutPrice)

    expect(extractText(tree.root)).toContain("Not available")
  })
})
