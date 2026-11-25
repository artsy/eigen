import { SELL_CHANNEL_NAMES, SupportedSellChannel } from "app/utils/sellChannels"

export interface SellChannel {
  kind: SupportedSellChannel
  name: string
  actionLabel: string
}

const CHANNELS: Record<SupportedSellChannel, SellChannel> = {
  AUCTION: { kind: "AUCTION", name: SELL_CHANNEL_NAMES.AUCTION, actionLabel: "Start Submission" },
  MARKETPLACE: {
    kind: "MARKETPLACE",
    name: SELL_CHANNEL_NAMES.MARKETPLACE,
    actionLabel: "Start Listing",
  },
}

export const getSellChannel = (kind: SupportedSellChannel): SellChannel => CHANNELS[kind]
