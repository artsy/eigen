import { Action, action } from "easy-peasy"

export type DarkModeOption = "light" | "dark" | "system"

export interface SettingsModel {
  darkMode: DarkModeOption

  setDarkMode: Action<SettingsModel, DarkModeOption>
}

export const SettingsModel: SettingsModel = {
  darkMode: "light",

  setDarkMode: action((state, option) => {
    console.log({ option })
    state.darkMode = option
  }),
}
