export const lotInActiveSale: (lotStanding: {
  saleArtwork: { sale: { status: string | null } | null } | null
}) => boolean = (lotStanding) => {
  const status = lotStanding?.saleArtwork?.sale?.status
  return !!status && ["open", "preview"].includes(status)
}
