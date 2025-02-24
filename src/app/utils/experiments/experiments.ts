export type ExperimentDescriptorUnion =
  | { readonly fallbackEnabled: false }
  | {
      readonly fallbackEnabled: true
      readonly fallbackVariant?: string
      readonly fallbackPayload?: string
    }

export type ExperimentDescriptor = {
  readonly description: string
  // value suggestions for the payload ideally matching the ones coming from Unleash
  readonly payloadSuggestions?: string[]
  readonly variantSuggestions?: string[]
} & ExperimentDescriptorUnion

export const experiments = {
  "eigen-new-works-for-you-recommendations-model": {
    fallbackEnabled: false,
    description: "value controlling which model to use for new works for you recs",
  },
  "CX-impressions-tracking-home-rail-views": {
    fallbackEnabled: false,
    description: "Allow tracking impression for home screen rails",
  },
  "onyx_artwork-card-save-and-follow-cta-redesign": {
    fallbackEnabled: true,
    fallbackVariant: "variant-a",
    description: "Redesign Save CTA and Add Follow CTA on Artwork Grid/Rail",
    payloadSuggestions: ["variant-a", "variant-b", "variant-c"],
    variantSuggestions: ["variant-a", "variant-b", "variant-c"],
  },
  "onyx_activity-dot-experiment": {
    description: "Replace current visual clue dot with a larger or red variant",
    fallbackEnabled: true,
    fallbackVariant: "control",
    variantSuggestions: ["control", "variant-b", "variant-c"],
    payloadSuggestions: ['{"forceDots": "true"}', '{"forceDots": "false"}'],
  },
  "onyx_quick-links-on-homeview-experiment": {
    description: "Add quick links section to home view",
    fallbackEnabled: true,
    fallbackVariant: "control",
    variantSuggestions: ["control", "experiment"],
  },
} satisfies { [key: string]: ExperimentDescriptor }

export type EXPERIMENT_NAME = keyof typeof experiments
