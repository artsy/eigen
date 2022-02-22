import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { action, Action, computed, Computed } from "easy-peasy"
import { Appearance } from "react-native"

export interface DevicePrefsModel {
  // color scheme
  colorScheme: Computed<this, "light" | "dark", GlobalStoreModel>
  usingSystemColorScheme: boolean
  forcedColorScheme: "light" | "dark"

  setUsingSystemColorScheme: Action<this, this["usingSystemColorScheme"]>
  setForcedColorScheme: Action<this, this["forcedColorScheme"]>
}

export const getDevicePrefsModel = (): DevicePrefsModel => ({
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
})
