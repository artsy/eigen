export const lotStandingIsClosed: (lotStanding: { lotState?: { soldStatus?: string } }) => boolean = lotStanding =>
  !!(lotStanding.lotState?.soldStatus && ["Sold", "Passed"].includes(lotStanding.lotState.soldStatus))
