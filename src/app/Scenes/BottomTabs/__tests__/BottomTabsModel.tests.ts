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

  describe("setFavoritesTabIconPosition", () => {
    it("sets and clears favoritesTabIconPosition", () => {
      expect(state()?.sessionState.favoritesTabIconPosition).toBeNull()

      GlobalStore.actions.bottomTabs.setFavoritesTabIconPosition({
        x: 1,
        y: 2,
        width: 3,
        height: 4,
      })
      expect(state()?.sessionState.favoritesTabIconPosition).toEqual({
        x: 1,
        y: 2,
        width: 3,
        height: 4,
      })

      GlobalStore.actions.bottomTabs.setFavoritesTabIconPosition(null)
      expect(state()?.sessionState.favoritesTabIconPosition).toBeNull()
    })
  })

  describe("setFavoritesTabArtworkOverride", () => {
    it("sets and clears favoritesTabArtworkOverride", () => {
      expect(state()?.sessionState.favoritesTabArtworkOverride).toBeNull()

      GlobalStore.actions.bottomTabs.setFavoritesTabArtworkOverride({
        url: "https://example.com/artwork.jpg",
        blurhash: "blurhash-1",
      })
      expect(state()?.sessionState.favoritesTabArtworkOverride).toEqual({
        url: "https://example.com/artwork.jpg",
        blurhash: "blurhash-1",
      })

      GlobalStore.actions.bottomTabs.setFavoritesTabArtworkOverride(null)
      expect(state()?.sessionState.favoritesTabArtworkOverride).toBeNull()
    })
  })
})
