import { GlobalStore } from "app/store/GlobalStore"

export function useEnvironment() {
  const {
    echo: { stripePublishableKey },
  } = GlobalStore.useAppState((state) => state.artsyPrefs)

  const {
    environment: { env, strings },
  } = GlobalStore.useAppState((state) => state.devicePrefs)

  return { ...strings, stripePublishableKey, env }
}
