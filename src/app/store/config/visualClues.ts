export type VisualClueName = keyof typeof visualClues

export interface VisualClueDescriptor {
  /**
   * Provide a short description for the Dev Menu
   */
  readonly description?: string
}

// Helper function to get good typings and intellisense
function defineVisualClues<T extends string>(visualClueMap: {
  readonly [visualClueName in T]: VisualClueDescriptor
}) {
  return visualClueMap
}

export const visualClues = defineVisualClues({
  MyCollectionInsights: {
    description: "The new My Collection insights tab",
  },
  MyCollectionInsightsIncompleteMessage: {
    description: "The message that indicates that only some artworks have insights",
  },
  MedianAuctionPriceListItemTooltip: {
    description: "Tooltip on the first item of median auction price list",
  },
})

export const visualClueNames = Object.keys(visualClues)

export const VisualCluesConstMap = (visualClueNames as [VisualClueName]).reduce((obj, key) => {
  // @ts-ignore
  obj[key] = key
  return obj
}, {} as { [K in VisualClueName]: K })
