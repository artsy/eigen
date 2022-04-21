interface ExperimentDescriptor {
  readonly fallbackEnabled: boolean
  readonly fallbackVariant?: string
  readonly fallbackPayload?: boolean
}

export const experiments: Record<string, ExperimentDescriptor> = {
  // this can go away whenever
  "test-search-smudge": {
    fallbackEnabled: false,
  },
  // this can go away whenever
  "test-eigen-smudge2": {
    fallbackEnabled: false,
  },
}
export type EXPERIMENT_NAME = keyof typeof experiments
