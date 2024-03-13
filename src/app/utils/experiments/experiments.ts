interface DisabledExperimentDescriptor {
  readonly fallbackEnabled: false
  readonly description: string
}

interface EnabledExperimentDescriptor {
  readonly fallbackEnabled: true
  readonly fallbackVariant?: string
  readonly fallbackPayload?: string
  readonly description: string
}

export const experiments = {
  // this can go away whenever
  "test-search-smudge": {
    fallbackEnabled: false,
    description: "description for test-search-smudge",
  },
  // this can go away whenever
  "test-eigen-smudge2": {
    fallbackEnabled: true,
    fallbackVariant: "variant-name",
    fallbackPayload: "payload-value",
    description: "description for test-eigen-smudge2",
  },
  "eigen-new-works-for-you-recommendations-model": {
    fallbackEnabled: false,
    description: "value controlling which model to use for new works for you recs",
  },
  onyx_new_works_for_you_feed: {
    fallbackEnabled: false,
    description: "Onyx experiment for new works for you feed vs grid",
  },
  "CX-impressions-tracking-home-rail-views": {
    fallbackEnabled: false,
    description: "Allow tracking impression for home screen rails",
  },
} satisfies { [key: string]: DisabledExperimentDescriptor | EnabledExperimentDescriptor }

export type EXPERIMENT_NAME = keyof typeof experiments
