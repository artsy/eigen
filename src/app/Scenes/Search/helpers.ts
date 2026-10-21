import { ContextModule } from "@artsy/cohesion"

const contextModuleByPillName: Record<string, ContextModule> = {
  Top: ContextModule.topTab,
  Artworks: ContextModule.artworksTab,
  Artist: ContextModule.artistsTab,
  Article: ContextModule.articleTab,
  Auction: ContextModule.auctionTab,
  "Artist Series": ContextModule.artistSeriesTab,
  Collection: ContextModule.marketingCollectionTab,
  Fair: ContextModule.fairTab,
  Show: ContextModule.showTab,
  Gallery: ContextModule.galleryTab,
}

export const getContextModuleByPillName = (pillName: string) => {
  return contextModuleByPillName[pillName]
}
