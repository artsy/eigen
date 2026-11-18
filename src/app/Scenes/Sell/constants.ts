// Must match MAX_ARTWORK_IDS in Metaphysics’ createResaleSubmissions, which refuses larger requests
export const MAX_SELECTED_WORKS = 30

/** The sales channels the app can show. One the API adds later is treated as unsupported until it’s listed here */
export const SUPPORTED_SELL_CHANNELS = ["AUCTION", "MARKETPLACE"] as const

export type SupportedSellChannel = (typeof SUPPORTED_SELL_CHANNELS)[number]
