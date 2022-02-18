import { action, Action, computed, Computed } from "easy-peasy"
import { Appearance } from "react-native"
import { GlobalStoreModel } from "lib/store/GlobalStoreModel"

export interface SettingsModel {
  // dark mode
  darkMode: Computed<this, "light" | "dark", GlobalStoreModel>
  darkModeSyncWithSystem: boolean
  darkModeForceMode: "light" | "dark"

  setDarkModeSyncWithSystem: Action<this, this["darkModeSyncWithSystem"]>
  setDarkModeForceMode: Action<this, this["darkModeForceMode"]>
}

export const getSettingsModel = (): SettingsModel => ({
  darkMode: computed([(_, store) => store], (store) => {
    if (!store.config.features.flags.ARDarkModeSupport) {
      return "light"
    }
    return store.settings.darkModeSyncWithSystem
      ? Appearance.getColorScheme() ?? "light"
      : store.settings.darkModeForceMode
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
