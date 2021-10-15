export interface ExperimentDescriptor {
  /**
   * Set readyForRelease to `true` when the feature is ready to be exposed outside of dev mode.
   * If an echo flag key is specified, the echo flag's value will be used after this is set to `true`.
   * If this is set to `false`, the feature will never be shown except if overridden in the admin menu.
   */
  readonly readyForRelease: boolean
  /**
   * Provide a treatment key to allow this feature to be toggled via split.io.
   */
  readonly treatmentKey?: string
  /**
   * Provide a short description for the admin menu
   */
  readonly description?: string
  /**
   * Whether or not to show the feature flag in the admin menu. Consider also providing a description.
   */
  readonly showInAdminMenu?: boolean
}

// Helper function to get good typings and intellisense
function defineExperiments<T extends string>(featureMap: { readonly [featureName in T]: ExperimentDescriptor }) {
  return featureMap
}

export const features = defineExperiments({
  HomeScreenWorksForYouVsWorksByArtistsYouFollow: {
    readyForRelease: false,
    treatmentKey: "HomeScreenWorksForYouVsWorksByArtistsYouFollow",
  },
})
export type TREATMENT_NAME = keyof typeof features
