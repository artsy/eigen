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
} satisfies { [key: string]: ExperimentDescriptor }

export type EXPERIMENT_NAME = keyof typeof experiments
