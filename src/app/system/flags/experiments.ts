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
      "Enable Gravity-backed artwork recommendations for the Home screen We Think You'll Love recommendations rail",
  },
  "onyx_nwfy-gravity": {
    description:
      "Enable Gravity-backed artwork recommendations for the Home screen New Works for You rail",
  },
  "onyx_artwork-recommendations-refresh-eigen": {
    description: "Enable live-refreshing the Home screen recommendations rail in eigen",
  },
  "onyx_nwfy-refresh-eigen": {
    description: "Enable live-refreshing the Home screen New Works for You rail in eigen",
    variantSuggestions: ["control", "experiment"],
  },
  "onyx_artsy-lens": {
    description: "Enable Artsy Lens (reverse-image-search camera) entry points",
  },
  "onyx_art-assistant-app": {
    description: "Enable Art Assistant entry points in the app",
  },
  "onyx_send-art-assistant-messages-to-segment": {
    description: "Send Art Assistant message and response text to Segment",
  },
  "onyx_home-feed-simplification": {
    description:
      "Home feed simplification A/B/C test (reduced-content baseline + variants). Note: section composition is decided server-side in Metaphysics by userID; a dev-menu override here only affects client-side reads, not the MP-composed feed.",
    variantSuggestions: ["control", "reduced_current", "hierarchy_breadth", "merchandising"],
  },
} satisfies { [key: string]: ExperimentDescriptor }

export type EXPERIMENT_NAME = keyof typeof experiments
