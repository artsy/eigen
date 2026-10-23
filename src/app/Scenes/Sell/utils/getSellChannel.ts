export interface SellChannel {
  name: string
  status: string
  actionLabel: string
}

const AUCTION: SellChannel = {
  name: "Artnet Auction",
  status: "To be reviewed by a specialist",
  actionLabel: "Start Submission",
}

const LISTING: SellChannel = {
  name: "Artsy Listing",
  status: "Estimated Value: US$2,800–3,600",
  actionLabel: "Start Listing",
}

// Placeholder until channel routing exists: picks a channel from the second-last hex digit of the ID
export const getSellChannel = (internalID: string): SellChannel =>
  parseInt(internalID.slice(-2, -1), 16) % 2 === 0 ? LISTING : AUCTION
