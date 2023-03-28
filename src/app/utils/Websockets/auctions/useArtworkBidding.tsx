import { DateTime } from "luxon"
import { useState } from "react"
import { useAuctionWebsocket } from "./useAuctionWebsocket"

export interface UseArtworkBiddingProps {
  lotID?: string | null
  lotEndAt?: string | null
  biddingEndAt?: string | null
  onDataReceived?: () => void
}
export const useArtworkBidding = (props: UseArtworkBiddingProps) => {
  const { lotID, lotEndAt, biddingEndAt, onDataReceived } = props

  if (!lotID) {
    return { currentBiddingEndAt: null, lotSaleExtended: false }
  }
  const biddingEndTime = biddingEndAt ?? lotEndAt

  const [currentBiddingEndAt, setCurrentBiddingEndAt] = useState(biddingEndTime)

  const isExtended =
    !!currentBiddingEndAt &&
    !!lotEndAt &&
    DateTime.fromISO(currentBiddingEndAt) > DateTime.fromISO(lotEndAt)

  const [lotSaleExtended, setLotSaleExtended] = useState(isExtended)

  useAuctionWebsocket({
    lotID,
    onChange: ({ extended_bidding_end_at }) => {
      if (extended_bidding_end_at) {
        setCurrentBiddingEndAt(extended_bidding_end_at)
        setLotSaleExtended(true)
      }
      onDataReceived?.()
    },
  })

  return { currentBiddingEndAt, lotSaleExtended }
}
