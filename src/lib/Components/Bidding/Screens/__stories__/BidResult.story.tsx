import { storiesOf } from "@storybook/react-native"
import React from "react"

import { BidResult_sale_artwork } from "__generated__/BidResult_sale_artwork.graphql"
import { BidderPositionResult } from "../../types"
import { BidResult } from "../BidResult"

storiesOf("Bidding")
  .add("Bid Result (winning)", () => {
    return <BidResult sale_artwork={saleArtwork} bidderPositionResult={Statuses.winning} navigator={{} as any} />
  })
  .add("Bid Result (outbid)", () => {
    return <BidResult sale_artwork={saleArtwork} bidderPositionResult={Statuses.outbid} navigator={{} as any} />
  })
  .add("Bid Result (live bidding started)", () => {
    return (
      <BidResult
        sale_artwork={saleArtwork}
        bidderPositionResult={Statuses.live_bidding_started}
        navigator={{} as any}
      />
    )
  })
  .add("Bid Result (timeout)", () => {
    return <BidResult sale_artwork={saleArtwork} bidderPositionResult={Statuses.pending} navigator={{} as any} />
  })

const saleArtwork = ({
  increments: [
    {
      display: "$10,000",
      cents: 1000000,
    },
  ],
  minimum_next_bid: {
    amount: "CHF10,000",
    cents: 1000000,
    display: "CHF 10,000",
  },
  sale: {
    live_start_at: "2022-01-01T00:03:00+00:00",
    end_at: "2022-05-01T00:03:00+00:00",
    id: "sale-id",
  },
} as any) as BidResult_sale_artwork

const Statuses = {
  winning: {
    status: "WINNING",
    message_header: null,
    message_description_md: null,
  } as BidderPositionResult,
  outbid: {
    status: "OUTBID",
    message_header: "Your bid wasn’t high enough",
    message_description_md: `Another bidder placed a higher max bid\nor the same max bid before you did.`,
  } as BidderPositionResult,
  live_bidding_started: {
    status: "LIVE_BIDDING_STARTED",
    message_header: "Live bidding has started",
    message_description_md: `Sorry, your bid wasn’t received before\nlive bidding started. To continue\nbidding, please [join the live auction](http://live-staging.artsy.net/).`,
  } as BidderPositionResult,
  pending: {
    status: "PENDING",
  } as BidderPositionResult,
}
