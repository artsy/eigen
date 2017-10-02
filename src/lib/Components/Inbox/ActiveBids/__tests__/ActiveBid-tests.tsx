import * as React from "react"
import * as renderer from "react-test-renderer"

import ActiveBid from "../ActiveBid"

it("renders correctly", () => {
  const tree = renderer.create(<ActiveBid bid={bid()} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it("looks right for bids in live auctions that haven't started yet", () => {
  const tree = renderer.create(<ActiveBid bid={bid(true)} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it("looks right for bids in live open auctions", () => {
  const tree = renderer.create(<ActiveBid bid={bid(true, true)} />).toJSON()
  expect(tree).toMatchSnapshot()
})

const bid = (isLive?: boolean, isOpen?: boolean) => {
  return {
    sale: {
      is_live_open: isOpen,
      href: "/to-the-auction",
    },
    active_bid: {
      id: "594933e6275b244305851e9c",
      display_max_bid_amount_dollars: "$10,000",
      max_bid: {
        cents: 1000000,
        display: "$10,000",
      },
      sale_artwork: {
        lot_label: "8",
        lot_number: "8",
        position: 8,
        highest_bid: {
          cents: 1000000,
          display: "$10,000",
        },
        artwork: {
          id: "robert-longo-untitled-dividing-time",
          title: "Untitled (Dividing Time)",
          image: {
            image_url: "https://d32dm0rphc51dk.cloudfront.net/4GlhFa7ci5-0W25sjDNFIQ/:version.jpg",
          },
          artist: {
            name: "Robert Longo",
          },
        },
      },
    },
  }
}
