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
    variantSuggestions: ["variant-a", "variant-b", "variant-c"],
  },
  "onyx_nwfy-artworks-card-test": {
    description: "New card rail type for home view nwfy section",
  },
  onyx_auctions_hub: {
    description:
      "Adds AuctionsHub Section to the home view and replaces the existing Auctions screen",
  },
} satisfies { [key: string]: ExperimentDescriptor }

export type EXPERIMENT_NAME = keyof typeof experiments
