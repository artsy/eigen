import { SplitFactory } from "@splitsoftware/splitio-react-native"
import { useEffect } from "react"
import Config from "react-native-config"
import { GlobalStore } from "../store/GlobalStore"
import { EXPERIMENT_NAME, experiments } from "./experiments"

let client: SplitIO.IClient

export const useExperiments = () => {
  // Instantiate the SDK
  const factory: SplitIO.ISDK = SplitFactory({
    core: {
      authorizationKey: Config.SPLIT_IO_API_KEY,
      key: GlobalStore.useAppState((store) => store.auth.userID) ?? "not-logged",
    },
  })

  // And get the client instance you'll use
  client = factory.client()

  useEffect(() => {
    client.on(client.Event.SDK_READY, () => {
      GlobalStore.actions.config.experiments.setState({ isReady: true })
    })

    // TODO: Discuss client.destroy()
  }, [])
  return
}

export const useTreatment = (treatment: EXPERIMENT_NAME) => {
  const isReady = GlobalStore.useAppState((store) => store.config.experiments.isReady)

  if (isReady) {
    return client?.getTreatment(treatment) ?? experiments[treatment].fallbackTreatment
  }
  return undefined
}
