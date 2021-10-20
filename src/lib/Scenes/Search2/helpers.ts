import { ContextModule } from "@artsy/cohesion"

const contextModuleByPillName: Record<string, ContextModule> = {
  Top: ContextModule.topTab,
  Artworks: ContextModule.artworksTab,
  Artist: ContextModule.artistsTab,
  Auction: ContextModule.auctionTab,
  "Artist Series": ContextModule.artistSeriesTab,
  Fair: ContextModule.fairTab,
  Show: ContextModule.showTab,
  Gallery: ContextModule.galleryTab,
}

export const getContextModuleByPillName = (pillName: string) => {
  return contextModuleByPillName[pillName]
}

export const isAlgoliaApiKeyExpiredError = (error: Error) => {
  return error?.message?.includes("parameter expired")
}
