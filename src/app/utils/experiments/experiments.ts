export type ExperimentDescriptor = {
  readonly description: string
  readonly payloadSuggestions?: string[]
  readonly variantSuggestions?: string[]
}

export const experiments = {
  "eigen-new-works-for-you-recommendations-model": {
    description: "value controlling which model to use for new works for you recs",
  },
  "onyx_artwork-card-save-and-follow-cta-redesign": {
    description: "Redesign Save CTA and Add Follow CTA on Artwork Grid/Rail",
    variantSuggestions: ["control", "experiment", "variant-c"],
  },
  "onyx_quick-links-experiment": {
    description: "Add quick links section to home view",
  },
} satisfies { [key: string]: ExperimentDescriptor }

export type EXPERIMENT_NAME = keyof typeof experiments
