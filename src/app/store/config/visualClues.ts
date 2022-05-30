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
  // ExampleClueName: {
  //   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  // },
  ArtworkSubmissionMessage: {
    description: "The message shown after artwork submission with SWA flow",
  },
  CompleteCollectorProfileMessage: {
    description: "The message shown if the collector profile is incomplete",
  },
  AddArtworkWithoutInsightsMessage_MyCTab: {
    description: "The message shown after adding an artwork without insights for the Insights tab",
  },
  AddArtworkWithInsights: {
    description: "The visual cue shown on the Insights tab after adding an artwork with insights",
  },
})
