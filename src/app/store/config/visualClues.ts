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
  MyCollectionArtistsCollectedOnboarding: {
    description: "Tha modal that shows the onboarding for the collected artists",
  },
  MyCollectionArtistsCollectedOnboardingTooltip1: {
    description: "Collected Artists: Tap to review your artist tooltip",
  },
  MyCollectionArtistsCollectedOnboardingTooltip2: {
    description: "Collected Artists: Tap to add more artists or artworks tooltip.",
  },
  PriceRangeToast: {
    description:
      "Toast that appears when the user scrolls through the recommendations section and has not updated the price range in a long time",
  },
})

export const visualClueNames = Object.keys(visualClues)

export const VisualCluesConstMap = (visualClueNames as [VisualClueName]).reduce(
  (obj, key) => {
    // @ts-ignore
    obj[key] = key
    return obj
  },
  {} as { [K in VisualClueName]: K }
)
