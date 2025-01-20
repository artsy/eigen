import {
  ArtsyNativeModule,
  DEFAULT_NAVIGATION_BAR_COLOR,
} from "app/NativeModules/ArtsyNativeModule"
import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { EnvironmentModel, getEnvironmentModel } from "app/store/config/EnvironmentModel"
import { action, Action, computed, Computed, effectOn, EffectOn } from "easy-peasy"
import { Appearance, Platform, StatusBar } from "react-native"

export interface DevicePrefsModel {
  environment: EnvironmentModel
  sessionState: {
    isDeepZoomModalVisible: boolean
  }
  // color scheme
  colorScheme: Computed<this, "light" | "dark", GlobalStoreModel>
  usingSystemColorScheme: boolean
  forcedColorScheme: "light" | "dark"

  setUsingSystemColorScheme: Action<this, this["usingSystemColorScheme"]>
  setForcedColorScheme: Action<this, this["forcedColorScheme"]>
  setIsDeepZoomModalVisible: Action<this, this["sessionState"]["isDeepZoomModalVisible"]>
  updateStatusBarStyle: EffectOn<this>
}

export const getDevicePrefsModel = (): DevicePrefsModel => ({
  environment: getEnvironmentModel(),

  sessionState: {
    isDeepZoomModalVisible: false,
  },
  colorScheme: computed([(_, store) => store], (store) => {
    if (!store.artsyPrefs.features.flags.ARDarkModeSupport) {
      return "light"
    }
    return store.devicePrefs.usingSystemColorScheme
      ? Appearance.getColorScheme() ?? "light"
      : store.devicePrefs.forcedColorScheme
  }),
  usingSystemColorScheme: false, // TODO: put `true` as default when the flag is ready to go away
  forcedColorScheme: "light",

  setUsingSystemColorScheme: action((state, option) => {
    state.usingSystemColorScheme = option
  }),
  setForcedColorScheme: action((state, option) => {
    state.forcedColorScheme = option
  }),
  setIsDeepZoomModalVisible: action((state, isVisible) => {
    state.sessionState.isDeepZoomModalVisible = isVisible
  }),
  updateStatusBarStyle: effectOn([(state) => state], (_, change) => {
    const [state] = change.current
    if (state.colorScheme === "dark") {
      StatusBar.setBarStyle("light-content")
      Appearance.setColorScheme("dark")
      if (Platform.OS === "android") {
        ArtsyNativeModule.setNavigationBarColor("#000000")
        ArtsyNativeModule.setAppLightContrast(true)
      }
    } else {
      StatusBar.setBarStyle("dark-content")
      Appearance.setColorScheme("light")
      if (Platform.OS === "android") {
        ArtsyNativeModule.setNavigationBarColor(DEFAULT_NAVIGATION_BAR_COLOR)
        ArtsyNativeModule.setAppLightContrast(false)
      }
    }
  }),
})
