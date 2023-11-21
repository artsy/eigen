import { getTimer } from "app/utils/getTimer"
interface SaleAttributes {
  startAt: string | null | undefined
}

interface SaleArtworkAttributes {
  extendedBiddingEndAt: string | null | undefined
  endAt: string | null | undefined
}

// TODO: consider moving this logic to Metaphysics
//       error prone, LotCloseInfo uses fields other than Force.
export const hasBiddingEnded = (
  sale: SaleAttributes | null | undefined,
  saleArtwork: SaleArtworkAttributes | null | undefined
): boolean => {
  if (!sale || !saleArtwork) return true

  const biddingEndAt = saleArtwork?.extendedBiddingEndAt ?? saleArtwork?.endAt
  const { hasEnded } = getTimer(biddingEndAt!, sale?.startAt!)

  return hasEnded
}
