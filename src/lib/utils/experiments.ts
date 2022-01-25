export interface ExperimentDescriptor {
  /**
   * Provide a split name to allow this feature to be toggled via split.io.
   */
  readonly splitName?: string
  /**
   * This refers to the value we show to the user in case something goes wrong with the client
   * initiation or when we no longer use split.io
   */
  readonly fallbackTreatment: string
}

// Helper function to get good typings and intellisense
function defineExperiments<T extends string>(expirmentMap: {
  readonly [experimentName in T]: ExperimentDescriptor
}) {
  return expirmentMap
}

export const experiments = defineExperiments({
  HomeScreenWorksForYouVsWorksByArtistsYouFollow: {
    splitName: "HomeScreenWorksForYouVsWorksByArtistsYouFollow",
    fallbackTreatment: "worksByArtistsYouFolow",
  },
  HomeScreenArtistRecommendations: {
    splitName: "HomeScreenArtistRecommendations",
    fallbackTreatment: "oldArtistRecommendations",
  },
  QueryPrefetching: {
    splitName: "QueryPrefetching",
    fallbackTreatment: "disabled",
  },
})
export type EXPERIMENT_NAME = keyof typeof experiments
