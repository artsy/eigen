import { action, Action, computed, Computed } from "easy-peasy"
import { GlobalStoreModel } from "lib/store/GlobalStoreModel"
import { Appearance } from "react-native"

export interface DevicePrefsModel {
  // dark mode
  darkMode: Computed<this, "light" | "dark", GlobalStoreModel>
  darkModeSyncWithSystem: boolean
  darkModeForceMode: "light" | "dark"

  setDarkModeSyncWithSystem: Action<this, this["darkModeSyncWithSystem"]>
  setDarkModeForceMode: Action<this, this["darkModeForceMode"]>
}

export const getDevicePrefsModel = (): DevicePrefsModel => ({
  darkMode: computed([(_, store) => store], (store) => {
    if (!store.artsyPrefs.features.flags.ARDarkModeSupport) {
      return "light"
    }
    return store.devicePrefs.darkModeSyncWithSystem
      ? Appearance.getColorScheme() ?? "light"
      : store.devicePrefs.darkModeForceMode
  }),
  darkModeSyncWithSystem: false, // TODO: put `true` as default when the flag is ready to go away
  darkModeForceMode: "light",

  setDarkModeSyncWithSystem: action((state, option) => {
    state.darkModeSyncWithSystem = option
  }),
  setDarkModeForceMode: action((state, option) => {
    state.darkModeForceMode = option
  }),
})
