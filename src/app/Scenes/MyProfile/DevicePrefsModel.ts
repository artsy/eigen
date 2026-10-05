import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { EnvironmentModel, getEnvironmentModel } from "app/store/config/EnvironmentModel"
import { setAndroidNavigationBarColor } from "app/utils/setAndroidNavigationBarColor"
import { action, Action, computed, Computed, effectOn, EffectOn } from "easy-peasy"
import { Appearance, Platform, StatusBar } from "react-native"

export type DarkModeOption = "on" | "off" | "system"

export const HOME_FEED_ARMS = [
  "off",
  "control",
  "reduced_current",
  "hierarchy_breadth",
  "merchandising",
] as const
export type HomeFeedArm = (typeof HOME_FEED_ARMS)[number]

export interface DevicePrefsModel {
  environment: EnvironmentModel
  sessionState: {
    isDeepZoomModalVisible: boolean
    key: number
  }
  // dev-only override that forces the server-composed home feed arm (via the
  // x-home-feed-arm header). "off" means send no header / normal assignment.
  homeFeedArm: HomeFeedArm

  // color scheme
  darkModeOption: DarkModeOption
  colorScheme: Computed<this, "light" | "dark", GlobalStoreModel>

  setHomeFeedArm: Action<this, HomeFeedArm>
  setDarkModeOption: Action<this, DarkModeOption>
  setIsDeepZoomModalVisible: Action<this, this["sessionState"]["isDeepZoomModalVisible"]>
  updateStatusBarStyle: EffectOn<this>
  setSessionState: Action<this, Partial<DevicePrefsModel["sessionState"]>>
}

export const getDevicePrefsModel = (): DevicePrefsModel => ({
  environment: getEnvironmentModel(),

  sessionState: {
    isDeepZoomModalVisible: false,
    key: 0,
  },

  homeFeedArm: "off",

  darkModeOption: "system",
  colorScheme: computed([(_, store) => store], (store) => {
    if (!store.artsyPrefs.features.flags.ARDarkModeSupport) {
      return "light"
    }

    const systemColorScheme = Appearance.getColorScheme()

    switch (store.devicePrefs.darkModeOption) {
      case "system":
        if (systemColorScheme === "dark") {
          return "dark"
        } else {
          return "light"
        }
      case "on":
        return "dark"
      default:
        return "light"
    }
  }),

  setHomeFeedArm: action((state, arm) => {
    state.homeFeedArm = arm
  }),
  setDarkModeOption: action((state, option) => {
    state.darkModeOption = option
  }),
  setIsDeepZoomModalVisible: action((state, isVisible) => {
    state.sessionState.isDeepZoomModalVisible = isVisible
  }),
  updateStatusBarStyle: effectOn([(state) => state], (_, change) => {
    const [state] = change.current

    if (state.colorScheme === "dark") {
      if (Platform.OS === "android") {
        setAndroidNavigationBarColor("dark")
      }

      requestAnimationFrame(() => {
        StatusBar.setBarStyle("light-content", true)
      })
    } else {
      if (Platform.OS === "android") {
        setAndroidNavigationBarColor("light")
      }

      requestAnimationFrame(() => {
        StatusBar.setBarStyle("dark-content", true)
      })
    }
  }),
  setSessionState: action((state, sessionState) => {
    state.sessionState = {
      ...state.sessionState,
      ...sessionState,
    }
  }),
})
