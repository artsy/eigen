import { LiveAuctionContext } from "app/Scenes/LiveSale/LiveSaleProvider"
import { useContext } from "react"

/**
 * Hook to access live auction state and actions from the LiveSaleProvider.
 * Must be used within a LiveSaleProvider component.
 *
 * @throws Error if used outside of LiveSaleProvider
 * @returns Live auction state and placeBid function
 */
export const useLiveAuction = () => {
  const context = useContext(LiveAuctionContext)

  if (!context) {
    throw new Error("useLiveAuction must be used within a LiveSaleProvider")
  }

  return context
}
