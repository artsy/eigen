import { action, Action, computed, Computed } from "easy-peasy"

type DarkModeOption = "light" | "dark" | "system"

export interface SettingsModel {
  // dark mode
  darkMode: Computed<this, DarkModeOption, this>
  darkModeSyncWithSystem: boolean
  darkModeForceMode: "light" | "dark"

  setDarkModeSyncWithSystem: Action<this, this["darkModeSyncWithSystem"]>
  setDarkModeForceMode: Action<this, this["darkModeForceMode"]>
}

export const getSettingsModel = (): SettingsModel => ({
  darkMode: computed((store) =>
    store.darkModeSyncWithSystem ? "system" : store.darkModeForceMode
  ),
  darkModeSyncWithSystem: false, // TODO: put `true` as default when the flag is ready to go away
  darkModeForceMode: "light",

  setDarkModeSyncWithSystem: action((state, option) => {
    state.darkModeSyncWithSystem = option
  }),
  setDarkModeForceMode: action((state, option) => {
    state.darkModeForceMode = option
  }),
})
