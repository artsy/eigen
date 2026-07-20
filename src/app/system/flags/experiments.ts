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
      "Enable Gravity-backed artwork recommendations for the Home screen recommendations rail",
  },
  "onyx_artwork-recommendations-refresh-eigen": {
    description: "Enable live-refreshing the Home screen recommendations rail in eigen",
  },
  "onyx_artsy-lens": {
    description:
      "Enable Artsy Lens image search (take a photo / add an image) in the global search overlay",
    variantSuggestions: ["control", "variant"],
  },
} satisfies { [key: string]: ExperimentDescriptor }

export type EXPERIMENT_NAME = keyof typeof experiments
