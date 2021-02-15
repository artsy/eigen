import { action, Action, computed, Computed, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import moment from "moment-timezone"
import echoLaunchJSON from "../../../../Artsy/App/EchoNew.json"
import { GlobalStoreModel } from "../GlobalStoreModel"

type EchoJSON = typeof echoLaunchJSON

export interface EchoModel {
  json: EchoJSON
  setEchoState: Action<EchoModel, EchoJSON>
  fetchRemoteEcho: Thunk<EchoModel>
  didRehydrate: ThunkOn<EchoModel, {}, GlobalStoreModel>
  stripePublishableKey: Computed<EchoModel, string, GlobalStoreModel>
  legacyFairSlugs: Computed<EchoModel, string[]>
  legacyFairProfileSlugs: Computed<EchoModel, string[]>
}

export const EchoModel: EchoModel = {
  json: echoLaunchJSON,
  setEchoState: action((state, echoJSON) => {
    state.json = echoJSON
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
      // If the app was just updated, then it's possible that the persisted echo config is
      // older than the version in this JS bundle. We should always use the latest version
      const persistedEchoTimestamp = moment(store.getState().json.updated_at)
      const launchEchoTimestamp = moment(echoLaunchJSON.updated_at)
      if (launchEchoTimestamp.isAfter(persistedEchoTimestamp)) {
        actions.setEchoState(echoLaunchJSON)
      }
      actions.fetchRemoteEcho()
    }
  ),
  stripePublishableKey: computed([(_, store) => store.config.environment.env, (state) => state], (env, state) => {
    const key = env === "production" ? "StripeProductionPublishableKey" : "StripeStagingPublishableKey"
    return state.json.messages.find((e) => e.name === key)?.content!
  }),
  legacyFairProfileSlugs: computed((state) => {
    return state.json.messages.find((e) => e.name === "LegacyFairProfileSlugs")?.content.split(",")!
  }),
  legacyFairSlugs: computed((state) => {
    return state.json.messages.find((e) => e.name === "LegacyFairSlugs")?.content.split(",")!
  }),
}
