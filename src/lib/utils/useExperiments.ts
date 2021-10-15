import { SplitFactory } from "@splitsoftware/splitio-react-native"
import { useEffect } from "react"
import Config from "react-native-config"
import { GlobalStore } from "../store/GlobalStore"
import { TREATMENT_NAME } from "./treatments"

export const useExperiments = () => {
  // Instantiate the SDK
  const factory: SplitIO.ISDK = SplitFactory({
    core: {
      authorizationKey: Config.SPLIT_IO_API_KEY,
      key: GlobalStore.useAppState((store) => store.auth.userID) ?? "not-logged",
    },
  })

  // And get the client instance you'll use
  const client: SplitIO.IClient = factory.client()

  useEffect(() => {
    client.on(client.Event.SDK_READY, () => {
      GlobalStore.actions.config.experiments.setState({ isReady: true, client })
    })

    // TODO: Discuss client.destroy()
  }, [])
  return
}

export const useTreatment = (treatment: TREATMENT_NAME) => {
  const client = GlobalStore.useAppState((store) => store.config.experiments.client)
  const isReady = GlobalStore.useAppState((store) => store.config.experiments.isReady)

  if (isReady && client) {
    return client.getTreatment(treatment)
  }
  return undefined
}

export const useTreatments = (treatments: TREATMENT_NAME[]) => {
  const client = GlobalStore.useAppState((store) => store.config.experiments.client)
  const isReady = GlobalStore.useAppState((store) => store.config.experiments.isReady)

  if (isReady && client) {
    return client.getTreatments(treatments)
  }
  return undefined
}
