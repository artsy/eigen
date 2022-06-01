export type VisualClueName = keyof typeof visualClues

export interface VisualClueDescriptor {
  /**
   * Provide a short description for the admin menu
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
  ArtworkSubmissionMessage: {
    description: "The message shown after artwork submission with SWA flow",
  },
  CompleteCollectorProfileMessage: {
    description: "The message shown if the collector profile is incomplete",
  },
  AddedArtworkWithoutInsightsMessage_MyCTab: {
    description: "The message shown after addind an artwork without insights for the Insights tab",
  },
  MyCollectionInsights: {
    description: "The new My Collection insights tab",
  },
  AddedArtworkWithoutInsightsMessage_InsightsTab: {
    description: "The message shown after addind an artwork without insights for the Insights tab",
  },
  AddedArtworkWithInsightsMessage_MyCTab: {
    description: "The message shown after addind an artwork with insights for the Insights tab",
  },
  AddedArtworkWithInsightsMessage_InsightsTab: {
    description: "The message shown after addind an artwork with insights for the Insights tab",
  },
})

export const visualClueNames = Object.keys(visualClues) as VisualClueName[]
