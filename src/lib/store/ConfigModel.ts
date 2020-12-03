import { action, Action, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import moment from "moment"
import Config from "react-native-config"
import echoLaunchJSON from "../../../Artsy/App/EchoNew.json"
import { GlobalStoreModel } from "./GlobalStoreModel"

type EchoJSON = typeof echoLaunchJSON

export interface ConfigModel {
  echoState: EchoJSON
  sessionState: {
    webURL: string
    gravityBaseURL: string
    gravitySecret: string
    gravityKey: string
    // features: {
    //   NewFairPage: {
    //     echoKey: "ARNewFairWhatever"
    //     readyForRelease: false
    //   }
    // }
  }
  didRehydrate: ThunkOn<ConfigModel, {}, GlobalStoreModel>
  setEchoState: Action<ConfigModel, EchoJSON>
  fetchRemoteEcho: Thunk<ConfigModel>
}
export const ConfigModel: ConfigModel = {
  echoState: echoLaunchJSON,
  sessionState: {
    webURL: "https://staging.artsy.net",
    gravityBaseURL: "https://stagingapi.artsy.net",
    gravityKey: Config.ARTSY_API_CLIENT_KEY,
    gravitySecret: Config.ARTSY_API_CLIENT_SECRET,
  },
  setEchoState: action((state, echoJSON) => {
    state.echoState = echoJSON
  }),
  fetchRemoteEcho: thunk(async (actions) => {
    const result = await fetch("https://echo.artsy.net/Echo.json")
    if (result.ok) {
      const json = await result.json()
      actions.setEchoState(json)
    }
  }),
  didRehydrate: thunkOn(
    (_, storeActions) => storeActions.rehydrate,
    (actions, __, store) => {
      const persistedEchoTimestamp = moment(store.getState().echoState.updated_at)
      const launchEchoTimestamp = moment(echoLaunchJSON.updated_at)
      console.log({ persistedEchoTimestamp, launchEchoTimestamp })
      if (launchEchoTimestamp.isAfter(persistedEchoTimestamp)) {
        console.log("HELLOOOOO")
        actions.setEchoState(echoLaunchJSON)
      }
      actions.fetchRemoteEcho()
    }
  ),
}
