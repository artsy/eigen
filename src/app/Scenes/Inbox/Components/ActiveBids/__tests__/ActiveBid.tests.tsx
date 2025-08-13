import ActiveBid from "app/Scenes/Inbox/Components/ActiveBids/ActiveBid"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

it("renders without throwing a error", () => {
  renderWithWrappersLEGACY(<ActiveBid bid={bid()} />)
})

it("looks right for bids in live open auctions", () => {
  const view = renderWithWrappersLEGACY(<ActiveBid bid={bid(true, true)} />)
  expect(extractText(view.root)).toMatch("Live bidding now open")
})

it("looks right for bids in live closed auctions", () => {
  const view = renderWithWrappersLEGACY(<ActiveBid bid={bid(false, true)} />)
  expect(extractText(view.root)).toMatch("Live auction")
})

const bid = (isLiveOpen?: boolean, isLiveOpenHappened?: boolean) => {
  return {
    is_leading_bidder: false,
    sale: {
      isLiveOpen: isLiveOpen,
      isLiveOpenHappened: isLiveOpenHappened,
      href: "/to-the-auction",
    },
    most_recent_bid: {
      gravityID: "bid-most-recent",
      id: "594933e6275b244305851e9c",
      display_max_bid_amount_dollars: "$10,000",
      max_bid: {
        cents: 1000000,
        display: "$10,000",
      },
      sale_artwork: {
        reserve_status: null,
        counts: {
          bidder_positions: 1,
        },
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
          href: "/artwork/robert-longo-untitled-dividing-time",
          artist_names: "Robert Longo",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/4GlhFa7ci5-0W25sjDNFIQ/large.jpg",
            image_url: "https://d32dm0rphc51dk.cloudfront.net/4GlhFa7ci5-0W25sjDNFIQ/:version.jpg",
          },
          artist: {
            name: "Robert Longo",
          },
        },
      },
    },
  } as any
}
