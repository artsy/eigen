import { SupportedSellChannel } from "app/Scenes/Sell/constants"

export interface SellChannel {
  kind: SupportedSellChannel
  name: string
  actionLabel: string
}

const CHANNELS: Record<SupportedSellChannel, SellChannel> = {
  AUCTION: { kind: "AUCTION", name: "Artnet Auction", actionLabel: "Start Submission" },
  MARKETPLACE: { kind: "MARKETPLACE", name: "Artsy Listing", actionLabel: "Start Listing" },
}

export const getSellChannel = (kind: SupportedSellChannel): SellChannel => CHANNELS[kind]
