import { createContext } from "react"

export const LegacyBackButtonContext = createContext<{
  updateShouldHideBackButton(shouldHideBackButton: boolean): void
}>({
  updateShouldHideBackButton() {
    if (__DEV__) {
      console.error("no LegacyBackButtonContext in tree")
    }
  },
})
