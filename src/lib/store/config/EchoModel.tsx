import { action, Action, computed, Computed, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import moment from "moment-timezone"
import { Platform } from "react-native"
import lessThan from "semver/functions/lt"
import appJson from "../../../../app.json"
import echoLaunchJSON from "../../../../Artsy/App/EchoNew.json"
import { GlobalStoreModel } from "../GlobalStoreModel"

type Echo = typeof echoLaunchJSON

export interface EchoModel {
  state: Echo
  setEchoState: Action<EchoModel, Echo>
  fetchRemoteEcho: Thunk<EchoModel>
  didRehydrate: ThunkOn<EchoModel, {}, GlobalStoreModel>
  stripePublishableKey: Computed<EchoModel, string, GlobalStoreModel>
  legacyFairSlugs: Computed<EchoModel, string[]>
  legacyFairProfileSlugs: Computed<EchoModel, string[]>
  forceUpdateMessage: Computed<EchoModel, string | undefined>
}

export const EchoModel: EchoModel = {
  state: echoLaunchJSON,
  setEchoState: action((state, echoJSON) => {
    state.state = echoJSON
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
      const persistedEchoTimestamp = moment(store.getState().state.updated_at)
      const launchEchoTimestamp = moment(echoLaunchJSON.updated_at)
      if (launchEchoTimestamp.isAfter(persistedEchoTimestamp)) {
        actions.setEchoState(echoLaunchJSON)
      }
      actions.fetchRemoteEcho()
    }
  ),
  stripePublishableKey: computed([(_, store) => store.config.environment.env, (state) => state], (env, state) => {
    const key = env === "production" ? "StripeProductionPublishableKey" : "StripeStagingPublishableKey"
    return state.state.messages.find((e) => e.name === key)?.content!
  }),
  legacyFairProfileSlugs: computed((state) => {
    return state.state.messages.find((e) => e.name === "LegacyFairProfileSlugs")?.content.split(",")!
  }),
  legacyFairSlugs: computed((state) => {
    return state.state.messages.find((e) => e.name === "LegacyFairSlugs")?.content.split(",")!
  }),
  forceUpdateMessage: computed((state) => {
    const appVersion = appJson.version
    const excludedVersions = state.state?.excludedVersions as any

    const excludedVersion = excludedVersions[Platform.OS][appVersion]

    // Check if the current version of the app is excluded
    // If it is, ask the user to update their app
    if (excludedVersion) {
      return excludedVersion.message
    }

    // Get the minumum required version by platform
    const minimumRequiredVersion = state.state.messages.find((message) => {
      if (Platform.OS === "ios") {
        return message.name === "KillSwitchBuildMinimum"
      }
      if (Platform.OS === "android") {
        return message.name === "KillSwitchBuildMinimumAndroid"
      }
    })?.content

    // Check if the current version of the app is less than the minimum required version
    // If it is, ask the user to update their app
    if (!!minimumRequiredVersion && lessThan(appVersion, minimumRequiredVersion)) {
      return "New app version required, Please update your Artsy app to continue."
    }
  }),
}
