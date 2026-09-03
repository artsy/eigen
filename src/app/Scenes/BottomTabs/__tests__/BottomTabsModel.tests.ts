import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"

describe("BottomTabsModel", () => {
  const state = () => __globalStoreTestUtils__?.getCurrentState().bottomTabs

  describe("setIsHomeViewReadyForOnboardingCompletionAnimation", () => {
    it("toggles isHomeViewReadyForOnboardingCompletionAnimation", () => {
      expect(state()?.sessionState.isHomeViewReadyForOnboardingCompletionAnimation).toBe(false)

      GlobalStore.actions.bottomTabs.setIsHomeViewReadyForOnboardingCompletionAnimation(true)
      expect(state()?.sessionState.isHomeViewReadyForOnboardingCompletionAnimation).toBe(true)

      GlobalStore.actions.bottomTabs.setIsHomeViewReadyForOnboardingCompletionAnimation(false)
      expect(state()?.sessionState.isHomeViewReadyForOnboardingCompletionAnimation).toBe(false)
    })
  })
})
