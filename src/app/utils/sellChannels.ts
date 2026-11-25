/** The sales channels the app can show. One the API adds later is treated as unsupported until it’s listed here */
export const SUPPORTED_SELL_CHANNELS = ["AUCTION", "MARKETPLACE"] as const

export type SupportedSellChannel = (typeof SUPPORTED_SELL_CHANNELS)[number]

export const SELL_CHANNEL_NAMES: Record<SupportedSellChannel, string> = {
  AUCTION: "Artnet Auction",
  MARKETPLACE: "Artsy Listing",
}

export const getSellChannelName = (channel: string | null | undefined): string | undefined =>
  SELL_CHANNEL_NAMES[channel as SupportedSellChannel]
