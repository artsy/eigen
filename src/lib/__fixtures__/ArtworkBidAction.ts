import { DateTime } from "luxon"

const InAuctionForSale = {
  isInAuction: true,
  isForSale: true,
}

export const ArtworkFromAuctionPreview = {
  ...InAuctionForSale,
  internalID: "artwork_from_preview_auction",
  sale: {
    isAuction: true,
    registrationStatus: null,
    isPreview: true,
    isOpen: false,
    isLiveOpen: false,
    isClosed: false,
    isRegistrationClosed: false,
  },
  saleArtwork: {
    increments: [
      { cents: 400000, display: "CHF4,000" },
      { cents: 425000, display: "CHF4,250" },
      { cents: 450000, display: "CHF4,500" },
      { cents: 475000, display: "CHF4,750" },
    ],
  },
  myLotStanding: null,
}

export const ArtworkFromTimedAuctionRegistrationOpen = {
  ...InAuctionForSale,
  internalID: "artwork_from_open_non_live_auction",
  sale: {
    isAuction: true,
    registrationStatus: null,
    isPreview: false,
    isOpen: true,
    isLiveOpen: false,
    isClosed: false,
    isRegistrationClosed: false,
  },
  saleArtwork: {
    increments: [
      { cents: 90000, display: "$900" },
      { cents: 95000, display: "$950" },
      { cents: 100000, display: "$1,000" },
      { cents: 110000, display: "$1,100" },
    ],
  },
  myLotStanding: null,
}

export const ArtworkFromTimedAuctionRegistrationClosed = {
  ...InAuctionForSale,
  internalID: "artwork_from_open_non_live_auction",
  sale: {
    isAuction: true,
    registrationStatus: null,
    isPreview: false,
    isOpen: true,
    isLiveOpen: false,
    isClosed: false,
    isRegistrationClosed: true,
  },
  saleArtwork: {
    increments: [
      { cents: 750000, display: "$7,500" },
      { cents: 800000, display: "$8,000" },
      { cents: 850000, display: "$8,500" },
      { cents: 900000, display: "$9,000" },
    ],
  },
  myLotStanding: null,
}

export const ArtworkFromLiveAuctionRegistrationOpen = {
  ...InAuctionForSale,
  internalID: "artwork_from_open_live_auction_open_registration",
  sale: {
    isAuction: true,
    registrationStatus: null,
    isPreview: false,
    isOpen: true,
    isLiveOpen: true,
    isClosed: false,
    isRegistrationClosed: false,
    liveStartAt: DateTime.fromMillis(Date.now())
      .minus({ minutes: 1 })
      .toISO(),
    startAt: DateTime.fromMillis(Date.now())
      .minus({ minutes: 10 })
      .toISO(),
    endAt: null,
  },
  saleArtwork: {
    increments: [
      { cents: 320000, display: "€3,200" },
      { cents: 350000, display: "€3,500" },
      { cents: 380000, display: "€3,800" },
      { cents: 400000, display: "€4,000" },
    ],
  },
  myLotStanding: null,
}

export const ArtworkFromLiveAuctionRegistrationClosed = {
  ...InAuctionForSale,
  internalID: "artwork_from_open_live_auction_closed_registration",
  sale: {
    isAuction: true,
    registrationStatus: null,
    isPreview: false,
    isOpen: true,
    isLiveOpen: true,
    isClosed: false,
    isRegistrationClosed: true,
    liveStartAt: DateTime.fromMillis(Date.now())
      .minus({ minutes: 1 })
      .toISO(),
    startAt: DateTime.fromMillis(Date.now())
      .minus({ minutes: 10 })
      .toISO(),
  },
  saleArtwork: {
    increments: [
      { cents: 320000, display: "€3,200" },
      { cents: 350000, display: "€3,500" },
      { cents: 380000, display: "€3,800" },
      { cents: 400000, display: "€4,000" },
    ],
  },
  myLotStanding: null,
}

export const ArtworkFromClosedAuction = {
  ...InAuctionForSale,
  internalID: "artwork_from_closed_auction",
  sale: {
    isAuction: true,
    registrationStatus: null,
    isPreview: false,
    isOpen: false,
    isLiveOpen: false,
    isClosed: true,
    isRegistrationClosed: false,
  },
  saleArtwork: {
    increments: [
      { cents: 425000, display: "£4,250" },
      { cents: 450000, display: "£4,500" },
      { cents: 475000, display: "£4,750" },
      { cents: 500000, display: "£5,000" },
    ],
  },
  myLotStanding: null,
}

export const NotRegisteredToBid = {
  myLotStanding: null,
  sale: {
    registrationStatus: null,
  },
}

export const BidderPendingApproval = {
  myLotStanding: null,
  sale: {
    registrationStatus: {
      id: "bidder_pending_approval",
      qualifiedForBidding: false,
    },
  },
}

export const RegisteredBidder = {
  myLotStanding: null,
  sale: {
    registrationStatus: { id: "bidder_approved", qualifiedForBidding: true },
  },
}

export const RegistedBidderWithBids = {
  myLotStanding: [
    {
      mostRecentBid: {
        maxBid: {
          cents: 30000,
        },
      },
    },
  ],
  sale: {
    registrationStatus: { id: "bidder_approved", qualifiedForBidding: true },
  },
}
