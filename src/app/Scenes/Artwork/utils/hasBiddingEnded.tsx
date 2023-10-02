import { useTimer } from "app/utils/useTimer"
interface SaleAttributes {
  startAt: string | null
}

interface SaleArtworkAttributes {
  extendedBiddingEndAt: string | null
  endAt: string | null
}

// TODO: consider moving this logic to Metaphysics
//       error prone, LotCloseInfo uses fields other than Force.
export const hasBiddingEnded = (
  sale: SaleAttributes | null,
  saleArtwork: SaleArtworkAttributes | null
): boolean => {
  if (!sale || !saleArtwork) return true

  const biddingEndAt = saleArtwork?.extendedBiddingEndAt ?? saleArtwork?.endAt
  const { hasEnded } = useTimer(biddingEndAt!, sale?.startAt!)

  return hasEnded
}
