interface SaleAttributes {
  isClosed: boolean | null | undefined
}

interface SaleArtworkAttributes {
  endedAt: string | null | undefined
}

// TODO: duplites Force's logic
//       consider moving this to Metaphysics
export const isLotClosed = (
  sale: SaleAttributes | null | undefined,
  saleArtwork: SaleArtworkAttributes | null | undefined
): boolean => {
  // If there is no sale or saleArtwork, we can't determine if the lot is closed
  // so we return true to be safe.
  if (!sale || !saleArtwork) return true

  if ("isClosed" in sale && sale.isClosed) return true
  if (saleArtwork.endedAt) return true

  return false
}
