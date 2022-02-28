interface SplitExperimentDescriptor {
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

interface ExperimentDescriptor {
  readonly fallbackEnabled: boolean
  readonly fallbackVariant?: string
  readonly fallbackPayload?: boolean
}

export const splitExperiments: Record<string, SplitExperimentDescriptor> = {
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
}
export type SPLIT_EXPERIMENT_NAME = keyof typeof splitExperiments

export const experiments: Record<string, ExperimentDescriptor> = {
  // this can go away whenever
  "test-search-smudge": {
    fallbackEnabled: false,
  },
  // this can go away whenever
  "test-eigen-smudge2": {
    fallbackEnabled: false,
  },
}
export type EXPERIMENT_NAME = keyof typeof experiments
