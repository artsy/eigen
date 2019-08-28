export const ClosedAuctionArtwork = {
  slug: "artwork_from_closed_auction",
  sale: {
    isClosed: true,
    isLiveOpen: false,
  },
  saleArtwork: {
    isWithReserve: true,
    reserveMessage: "This work has a reserve",
    reserveStatus: "reserve_not_met",
    currentBid: {
      display: "$3,000",
    },
    counts: {
      bidderPositions: 0,
    },
  },
  myLotStanding: null,
}

export const AuctionPreview = {
  slug: "artwork_from_auction_preview",
  sale: {
    isClosed: false,
    isLiveOpen: false,
  },
  saleArtwork: {
    isWithReserve: false,
    reserveMessage: null,
    reserveStatus: "no_reserve",
    currentBid: {
      display: "CHF 4,000",
    },
    counts: {
      bidderPositions: 0,
    },
  },
  myLotStanding: null,
}

export const AuctionPreviewNoStartingBid = {
  slug: "artwork_from_auction_preview",
  sale: {
    isClosed: false,
    isLiveOpen: false,
  },
  saleArtwork: {
    isWithReserve: false,
    reserveMessage: null,
    reserveStatus: "no_reserve",
    currentBid: null,
    counts: {
      bidderPositions: 0,
    },
  },
  myLotStanding: null,
}

export const OpenAuctionNoReserveNoBids = {
  slug: "open_auction_no_reserve_no_bids",
  sale: {
    isClosed: false,
    isLiveOpen: false,
  },
  saleArtwork: {
    isWithReserve: false,
    reserveMessage: null,
    reserveStatus: "no_reserve",
    currentBid: {
      display: "$500",
    },
    counts: {
      bidderPositions: 0,
    },
  },
  myLotStanding: null,
}

export const OpenAuctionNoReserveWithBids = {
  slug: "artwork_from_open_auction",

  sale: {
    isClosed: false,
    isLiveOpen: false,
  },
  saleArtwork: {
    isWithReserve: false,
    reserveMessage: null,
    reserveStatus: "no_reserve",
    currentBid: {
      display: "$850",
    },
    counts: {
      bidderPositions: 11,
    },
  },
  myLotStanding: null,
}

export const OpenAuctionReserveNoBids = {
  slug: "open_auction_reserve_no_bids",
  sale: {
    isClosed: false,
    isLiveOpen: false,
  },
  saleArtwork: {
    isWithReserve: true,
    reserveMessage: "This work has a reserve",
    reserveStatus: "reserve_not_met",
    currentBid: {
      display: "$3,000",
    },
    counts: {
      bidderPositions: 0,
    },
  },
  myLotStanding: null,
}

export const OpenAuctionReserveNotMetWithBids = {
  slug: "open_auction_reserve_not_met_with_bids",
  sale: {
    isClosed: false,
    isLiveOpen: false,
  },
  saleArtwork: {
    isWithReserve: true,
    reserveMessage: "Reserve not met",
    reserveStatus: "reserve_not_met",
    currentBid: {
      display: "$10,000",
    },
    counts: {
      bidderPositions: 2,
    },
  },
  myLotStanding: null,
}

export const OpenAuctionReserveMetWithBids = {
  slug: "open_auction_reserve_met_with_bids",
  sale: {
    isClosed: false,
    isLiveOpen: false,
  },
  saleArtwork: {
    isWithReserve: true,
    reserveMessage: "Reserve met",
    reserveStatus: "reserve_met",
    currentBid: {
      display: "$500",
    },
    counts: {
      bidderPositions: 2,
    },
  },
  myLotStanding: null,
}

export const OpenAuctionReserveNotMetIncreasingOwnBid = {
  slug: "open_auction_reserve_not_met_increading_own_bid",
  ...OpenAuctionReserveNotMetWithBids,
  myLotStanding: [
    {
      mostRecentBid: {
        isWinning: false,
        maxBid: { display: "$15,000" },
      },
      activeBid: {
        isWinning: true,
      },
    },
  ],
}

export const OpenAuctionReserveMetWithMyWinningBid = {
  slug: "open_auction_reserve_met_my_winning_bid",
  ...OpenAuctionReserveMetWithBids,
  myLotStanding: [
    {
      mostRecentBid: { isWinning: true, maxBid: { display: "$15,000" } },
      activeBid: { isWinning: true },
    },
  ],
}

export const OpenAuctionReserveMetWithMyLosingBid = {
  slug: "open_auction_reserve_met_my_losing_bid",
  ...OpenAuctionReserveMetWithBids,
  myLotStanding: [
    {
      mostRecentBid: { isWinning: false, maxBid: { display: "$400" } },
      activeBid: null,
    },
  ],
}

export const LiveAuctionInProgeress = {
  slug: "artwork_from_live_auction",
  sale: { isClosed: false, isLiveOpen: true },
  saleArtwork: {
    isWithReserve: false,
    reserveMessage: null,
    reserveStatus: "no_reserve",
    currentBid: { display: "€3,200" },
    counts: { bidderPositions: 0 },
  },
  myLotStanding: null,
}
