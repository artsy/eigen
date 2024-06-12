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
} satisfies { [key: string]: ExperimentDescriptor }

export type EXPERIMENT_NAME = keyof typeof experiments
