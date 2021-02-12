type Environment = "staging" | "production" | "local"

interface EnvironmentOptionDescriptor {
  readonly description: string
  readonly presets: { readonly [k in Environment]?: string }
}

// helper to get good typings
function defineEnvironmentOptions<EnvOptionName extends string>(
  options: { readonly [k in EnvOptionName]: EnvironmentOptionDescriptor }
) {
  return options
}

const environmentOptions = defineEnvironmentOptions({
  gravityURL: {
    description: "Gravity URL",
    presets: {
      local: "https://localhost:3000",
      staging: "https://stagingapi.artsy.net",
      production: "https://api.artsy.net",
    },
  },
  metaphysicsURL: {
    description: "Metaphysics URL",
    presets: {
      local: "https://localhost:3000/v2",
      staging: "https://metaphysics-staging.artsy.net/v2",
      production: "https://metaphysics.artsy.net/v2",
    },
  },
  predictionURL: {
    description: "Prediction URL",
    presets: {
      local: "https://localhost:3000/v2",
      staging: "https://live-staging.artsy.net",
      production: "https://live.artsy.net",
    },
  },
  webURL: {
    description: "Force URL",
    presets: {
      local: "https://localhost:5000",
      staging: "https://staging.artsy.net",
      production: "https://artsy.net",
    },
  },
})
