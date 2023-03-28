import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { EnvironmentModel, getEnvironmentModel } from "app/store/config/EnvironmentModel"
import { action, Action, computed, Computed } from "easy-peasy"
import { Appearance } from "react-native"

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
})
