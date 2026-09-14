export type ExperimentDescriptor = {
  readonly description: string
  readonly payloadSuggestions?: string[]
  readonly variantSuggestions?: string[]
}

export const experiments = {
  test_experiment: {
    description: "Experiment description",
    variantSuggestions: ["control", "experiment"],
  },
  "onyx_artwork-recommendations-gravity": {
    description:
      "Enable Gravity-backed artwork recommendations for the Home screen We Think You'll Love recommendations rail",
  },
  "onyx_nwfy-gravity": {
    description:
      "Enable Gravity-backed artwork recommendations for the Home screen New Works for You rail",
  },
  "onyx_artwork-recommendations-refresh-eigen": {
    description: "Enable live-refreshing the Home screen recommendations rail in eigen",
  },
  "onyx_nwfy-refresh-eigen": {
    description: "Enable live-refreshing the Home screen New Works for You rail in eigen",
    variantSuggestions: ["control", "experiment"],
  },
  "onyx_artsy-lens": {
    description: "Enable Artsy Lens (reverse-image-search camera) entry points",
  },
  "onyx_demo-version-gate": {
    description: "Demo only: proves an appVersion constraint gates a flag per app version",
  },
  "onyx_demo-platform-gate": {
    description: "Demo only: proves an appPlatformOS constraint gates a flag per platform",
  },
} satisfies { [key: string]: ExperimentDescriptor }

export type EXPERIMENT_NAME = keyof typeof experiments
