import { useLiveAuction } from "app/Scenes/LiveSale/hooks/useLiveAuction"
import { deriveLotEventFeed } from "app/Scenes/LiveSale/utils/deriveLotEventFeed"
import type { LiveAuctionFeedEvent } from "app/Scenes/LiveSale/types/liveAuction"

export function useLiveAuctionEventFeed(lotId: string): LiveAuctionFeedEvent[] {
  const state = useLiveAuction()
  const lot = state.lots.get(lotId)

  if (!lot) return []

  return deriveLotEventFeed(
    lot.eventHistory,
    state.credentials.bidderId,
    lot.derivedState.sellingToBidderId,
    state.currencySymbol
  )
}
