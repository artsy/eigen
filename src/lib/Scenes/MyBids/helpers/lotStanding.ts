export const lotInActiveSale: (lotStanding: {
  saleArtwork: { sale: { status: string | null } | null } | null
}) => boolean = (lotStanding) => {
  const status = lotStanding?.saleArtwork?.sale?.status
  return !!status && ["open", "preview"].includes(status)
}

export const lotStandingIsClosed: (lotStanding: { lotState?: { soldStatus?: string } }) => boolean = (lotStanding) =>
  !!(lotStanding.lotState?.soldStatus && ["Sold", "Passed"].includes(lotStanding.lotState.soldStatus))

export const isLAIAuction = (sale: { liveStartAt?: string | null }) => !!sale.liveStartAt
