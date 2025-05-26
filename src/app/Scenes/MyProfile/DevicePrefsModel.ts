import {
  ArtsyNativeModule,
  DEFAULT_NAVIGATION_BAR_COLOR,
} from "app/NativeModules/ArtsyNativeModule"
import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { EnvironmentModel, getEnvironmentModel } from "app/store/config/EnvironmentModel"
import { action, Action, computed, Computed, effectOn, EffectOn } from "easy-peasy"
import { Appearance, Platform, StatusBar } from "react-native"

export type DarkModeOption = "on" | "off" | "system"

export interface DevicePrefsModel {
  environment: EnvironmentModel
  sessionState: {
    isDeepZoomModalVisible: boolean
    hasChangedColorScheme: boolean
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
    hasChangedColorScheme: false,
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
    state.sessionState.hasChangedColorScheme = true
    state.darkModeOption = option
  }),
  setIsDeepZoomModalVisible: action((state, isVisible) => {
    state.sessionState.isDeepZoomModalVisible = isVisible
  }),
  updateStatusBarStyle: effectOn([(state) => state], (_, change) => {
    const [state] = change.current

    if (state.colorScheme === "dark") {
      StatusBar.setBarStyle("light-content")

      if (Platform.OS === "android") {
        ArtsyNativeModule.setNavigationBarColor("#000000")
        ArtsyNativeModule.setAppLightContrast(true)
      }
    } else {
      StatusBar.setBarStyle("dark-content")

      if (Platform.OS === "android") {
        ArtsyNativeModule.setNavigationBarColor(DEFAULT_NAVIGATION_BAR_COLOR)
        ArtsyNativeModule.setAppLightContrast(false)
      }
    }
  }),
  setSessionState: action((state, sessionState) => {
    state.sessionState = {
      ...state.sessionState,
      ...sessionState,
    }
  }),
})
