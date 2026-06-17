import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"

describe("InfiniteDiscoveryModel", () => {
  beforeEach(() => {
    GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()
    GlobalStore.actions.infiniteDiscovery.setIsNewUserOnboardingSession(false)
  })

  const state = () => __globalStoreTestUtils__?.getCurrentState().infiniteDiscovery

  describe("addOnboardingSavedArtworkImage", () => {
    it("adds an artwork image", () => {
      GlobalStore.actions.infiniteDiscovery.addOnboardingSavedArtworkImage({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
      })

      expect(state()?.sessionState.onboardingSavedArtworkImages).toHaveLength(1)
      expect(state()?.sessionState.onboardingSavedArtworkImages[0]).toMatchObject({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
      })
    })

    it("caps at 5 artworks", () => {
      for (let i = 1; i <= 6; i++) {
        GlobalStore.actions.infiniteDiscovery.addOnboardingSavedArtworkImage({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }

      expect(state()?.sessionState.onboardingSavedArtworkImages).toHaveLength(5)
    })

    it("stores the blurhash when provided", () => {
      GlobalStore.actions.infiniteDiscovery.addOnboardingSavedArtworkImage({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
        blurhash: "LGFFaS%2IV00",
      })

      expect(state()?.sessionState.onboardingSavedArtworkImages[0].blurhash).toBe("LGFFaS%2IV00")
    })
  })

  describe("removeOnboardingSavedArtworkImage", () => {
    it("removes the artwork with the given internalID", () => {
      GlobalStore.actions.infiniteDiscovery.addOnboardingSavedArtworkImage({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
      })
      GlobalStore.actions.infiniteDiscovery.addOnboardingSavedArtworkImage({
        internalID: "artwork-2",
        url: "https://example.com/2.jpg",
      })

      GlobalStore.actions.infiniteDiscovery.removeOnboardingSavedArtworkImage("artwork-1")

      expect(state()?.sessionState.onboardingSavedArtworkImages).toHaveLength(1)
      expect(state()?.sessionState.onboardingSavedArtworkImages[0].internalID).toBe("artwork-2")
    })

    it("is a no-op when the internalID is not in the list", () => {
      GlobalStore.actions.infiniteDiscovery.addOnboardingSavedArtworkImage({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
      })

      GlobalStore.actions.infiniteDiscovery.removeOnboardingSavedArtworkImage("does-not-exist")

      expect(state()?.sessionState.onboardingSavedArtworkImages).toHaveLength(1)
    })
  })

  describe("resetSavedArtworksCount", () => {
    it("clears onboardingSavedArtworkImages", () => {
      GlobalStore.actions.infiniteDiscovery.addOnboardingSavedArtworkImage({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
      })

      expect(state()?.sessionState.onboardingSavedArtworkImages).toHaveLength(1)

      GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()

      expect(state()?.sessionState.onboardingSavedArtworkImages).toHaveLength(0)
    })

    it("also resets savedArtworksCount", () => {
      GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
      GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()

      GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()

      expect(state()?.savedArtworksCount).toBe(0)
    })
  })
})
