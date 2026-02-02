export type ExperimentDescriptor = {
  readonly description: string
  readonly payloadSuggestions?: string[]
  readonly variantSuggestions?: string[]
}

export const experiments = {
  "onyx_artwork-card-save-and-follow-cta-redesign": {
    description: "Redesign Save CTA and Add Follow CTA on Artwork Grid/Rail",
    variantSuggestions: ["variant-a", "variant-b", "variant-c"],
  },
  onyx_auctions_hub: {
    description:
      "Adds AuctionsHub Section to the home view and replaces the existing Auctions screen",
  },
  "topaz_retire-inquiry-template-messages": {
    description: "Retire the inquiry message templates in inquiry flow",
    variantSuggestions: ["control", "experiment"],
    payloadSuggestions: ["control", "experiment"],
  },
} satisfies { [key: string]: ExperimentDescriptor }

export type EXPERIMENT_NAME = keyof typeof experiments
