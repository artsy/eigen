import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"

describe("InfiniteDiscoveryModel", () => {
  beforeEach(() => {
    GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(false)
  })

  const state = () => __globalStoreTestUtils__?.getCurrentState().infiniteDiscovery

  describe("addNewUserOnboardingSavedArtwork", () => {
    it("adds an artwork image", () => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
      })

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(1)
      expect(state()?.sessionState.newUserOnboardingSavedArtworks[0]).toMatchObject({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
      })
    })

    it("caps at 5 artworks", () => {
      for (let i = 1; i <= 6; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(5)
    })

    it("sets newUserOnboardingCompletionBottomSheetVisible to true when the 5th artwork is added", () => {
      expect(state()?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(false)

      for (let i = 1; i <= 4; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }

      expect(state()?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(false)

      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-5",
        url: "https://example.com/5.jpg",
      })

      expect(state()?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(true)
    })

    it("stores the blurhash when provided", () => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
        blurhash: "LGFFaS%2IV00",
      })

      expect(state()?.sessionState.newUserOnboardingSavedArtworks[0].blurhash).toBe("LGFFaS%2IV00")
    })
  })

  describe("setNewUserOnboardingCompletionBottomSheetVisible", () => {
    it("toggles newUserOnboardingCompletionBottomSheetVisible", () => {
      expect(state()?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(false)

      GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)
      expect(state()?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(true)

      GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(false)
      expect(state()?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(false)
    })
  })

  describe("setIsNewUserOnboardingSession", () => {
    it("clears newUserOnboardingCompletionBottomSheetVisible when set to false", () => {
      GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(true)
      expect(state()?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(true)

      GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(false)
      expect(state()?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(false)
    })
  })

  describe("removeNewUserOnboardingSavedArtwork", () => {
    it("removes the artwork with the given internalID", () => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
      })
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-2",
        url: "https://example.com/2.jpg",
      })

      GlobalStore.actions.infiniteDiscovery.removeNewUserOnboardingSavedArtwork("artwork-1")

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(1)
      expect(state()?.sessionState.newUserOnboardingSavedArtworks[0].internalID).toBe("artwork-2")
    })

    it("is a no-op when the internalID is not in the list", () => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
      })

      GlobalStore.actions.infiniteDiscovery.removeNewUserOnboardingSavedArtwork("does-not-exist")

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(1)
    })
  })

  describe("resetSavedArtworksCount", () => {
    it("clears newUserOnboardingSavedArtworks", () => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
      })

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(1)

      GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(0)
    })

    it("also resets savedArtworksCount", () => {
      GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
      GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()

      GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()

      expect(state()?.savedArtworksCount).toBe(0)
    })
  })
})
