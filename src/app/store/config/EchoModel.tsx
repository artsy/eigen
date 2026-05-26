import { captureMessage } from "@sentry/react-native"
import { unsafe_getDevToggle } from "app/store/GlobalStore"
import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { getAppVersion } from "app/utils/appVersion"
import { echoLaunchJson } from "app/utils/jsonFiles"
import { action, Action, computed, Computed, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import moment from "moment-timezone"
import { Platform } from "react-native"
import { lt as lessThan } from "semver"

export interface Echo {
  id: number // 1
  name: string // "eigen"
  created_at: string // iso string date
  updated_at: string // iso string date
  features: Array<{ name: string; value: boolean }>
  messages: Array<{ name: string; content: string }>
  routes: Array<{ name: string; path: string }>
  killedVersions: {
    ios: { [version: string]: { message: string } }
    android: { [version: string]: { message: string } }
  }
}

export interface EchoModel {
  state: Echo
  setEchoState: Action<EchoModel, Echo>
  fetchRemoteEcho: Thunk<EchoModel>
  didRehydrate: ThunkOn<EchoModel, {}, GlobalStoreModel>
  stripePublishableKey: Computed<EchoModel, string, GlobalStoreModel>
  forceUpdateMessage: Computed<EchoModel, string | undefined>
}

export const getEchoModel = (): EchoModel => ({
  state: echoLaunchJson(),
  setEchoState: action((state, echoJson) => {
    state.state = echoJson
  }),
  fetchRemoteEcho: thunk(async (actions) => {
    const disableRemoteFetch = unsafe_getDevToggle("DTDisableEchoRemoteFetch")
    if (disableRemoteFetch) {
      return
    }

    let result

    try {
      result = await fetch("https://echo.artsy.net/Echo.json")

      if (result?.ok) {
        const json = await result.json()
        actions.setEchoState(json)
      }
    } catch (error) {
      if (__DEV__) {
        console.warn(error)
      } else {
        captureMessage(`Failed to fetch Echo data: ${error}`)
      }
    }
  }),
  didRehydrate: thunkOn(
    (_, storeActions) => storeActions.rehydrate,
    (actions, __, store) => {
      // If the app was just updated, then it's possible that the persisted echo config is
      // older than the version in this JS bundle. We should always use the latest version
      const persistedEchoTimestamp = moment(store.getState().state.updated_at)
      const launchEchoTimestamp = moment(echoLaunchJson().updated_at)
      if (launchEchoTimestamp.isAfter(persistedEchoTimestamp)) {
        actions.setEchoState(echoLaunchJson())
      }

      actions.fetchRemoteEcho()
    }
  ),
  stripePublishableKey: computed(
    [(_, store) => store.devicePrefs.environment.env, (state) => state],
    (env, state) => {
      const key =
        env === "production" ? "StripeProductionPublishableKey" : "StripeStagingPublishableKey"
      return state.state.messages.find((e) => e.name === key)?.content!
    }
  ),
  forceUpdateMessage: computed((state) => {
    const appVersion = getAppVersion()
    const killedVersions = state.state.killedVersions

    const killedVersion = killedVersions[Platform.OS as keyof Echo["killedVersions"]][appVersion]

    // Check if the current version of the app is killed.
    // If it is, ask the user to update their app!
    if (killedVersion) {
      return killedVersion.message
    }

    // Get the minumum required version by platform
    const minimumRequiredVersion = state.state.messages
      .filter((message) => message.name.startsWith("KillSwitchBuildMinimum"))
      .find((message) => {
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
      return "New app version required. Please update your Artsy app to continue."
    }
  }),
})
