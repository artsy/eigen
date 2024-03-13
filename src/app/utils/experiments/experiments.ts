interface DisabledExperimentDescriptor {
  readonly fallbackEnabled: false
}

interface EnabledExperimentDescriptor {
  readonly fallbackEnabled: true
  readonly fallbackVariant?: string
  readonly fallbackPayload?: string
}

export const experiments = {
  // this can go away whenever
  "test-search-smudge": {
    fallbackEnabled: false,
  },
  // this can go away whenever
  "test-eigen-smudge2": {
    fallbackEnabled: true,
    fallbackVariant: "variant-name",
    fallbackPayload: "payload-value",
  },
  "eigen-new-works-for-you-recommendations-model": {
    fallbackEnabled: false,
  },
  onyx_new_works_for_you_feed: {
    fallbackEnabled: false,
  },
  "CX-impressions-tracking-home-rail-views": {
    fallbackEnabled: false,
  },
} satisfies { [key: string]: DisabledExperimentDescriptor | EnabledExperimentDescriptor }

export type EXPERIMENT_NAME = keyof typeof experiments
