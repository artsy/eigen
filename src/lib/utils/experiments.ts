export interface ExperimentDescriptor {
  /**
   * Set readyForRelease to `true` when the experiment is ready to be shipped to user.
   */
  readonly readyForRelease: boolean
  /**
   * Provide a treatment key to allow this feature to be toggled via split.io.
   */
  readonly treatmentKey?: string
  /**
   * This refers to the value we show to the user in case something goes wrong with the client
   * initiation or when we no longer use split.io
   */
  readonly defaultKey: string
}

// Helper function to get good typings and intellisense
function defineExperiments<T extends string>(expirmentMap: { readonly [experimentName in T]: ExperimentDescriptor }) {
  return expirmentMap
}

export const experiments = defineExperiments({
  HomeScreenWorksForYouVsWorksByArtistsYouFollow: {
    readyForRelease: false,
    treatmentKey: "HomeScreenWorksForYouVsWorksByArtistsYouFollow",
    defaultKey: "worksByArtistsYouFolow",
  },
})
export type EXPERIMENT_NAME = keyof typeof experiments
