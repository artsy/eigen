import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { EnvironmentModel, getEnvironmentModel } from "app/store/config/EnvironmentModel"
import { setAppStyling } from "app/utils/useAndroidAppStyling"
import { action, Action, computed, Computed, effectOn, EffectOn } from "easy-peasy"
import { Appearance } from "react-native"

export type DarkModeOption = "on" | "off" | "system"

export interface DevicePrefsModel {
  environment: EnvironmentModel
  sessionState: {
    isDeepZoomModalVisible: boolean
    key: number
  }
  // color scheme
  darkModeOption: DarkModeOption
  colorScheme: Computed<this, "light" | "dark", GlobalStoreModel>

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

  setDarkModeOption: action((state, option) => {
    state.darkModeOption = option
  }),
  setIsDeepZoomModalVisible: action((state, isVisible) => {
    state.sessionState.isDeepZoomModalVisible = isVisible
  }),
  updateStatusBarStyle: effectOn([(state) => state], (_, change) => {
    const [state] = change.current

    // Wait an animation frame to make sure the dark mode screen animation is in sync
    //  with the status bar and navigation bar
    requestAnimationFrame(() => {
      setAppStyling(state.colorScheme)
    })
  }),
  setSessionState: action((state, sessionState) => {
    state.sessionState = {
      ...state.sessionState,
      ...sessionState,
    }
  }),
})
