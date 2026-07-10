import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"

describe("InfiniteDiscoveryModel", () => {
  beforeEach(() => {
    GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()
    GlobalStore.actions.infiniteDiscovery.resetNewUserOnboardingSessionState()
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

    it("keeps tracking saved artworks beyond 5 once the goal is reached", () => {
      for (let i = 1; i <= 7; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(7)
    })

    it("stores the blurhash when provided", () => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
        blurhash: "LGFFaS%2IV00",
      })

      expect(state()?.sessionState.newUserOnboardingSavedArtworks[0].blurhash).toBe("LGFFaS%2IV00")
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

    it("sets newUserOnboardingGoalReached to true when the 5th artwork is added", () => {
      expect(state()?.sessionState.newUserOnboardingGoalReached).toBe(false)

      for (let i = 1; i <= 4; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }

      expect(state()?.sessionState.newUserOnboardingGoalReached).toBe(false)

      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-5",
        url: "https://example.com/5.jpg",
      })

      expect(state()?.sessionState.newUserOnboardingGoalReached).toBe(true)
    })

    it("captures an immutable snapshot of the first 5 artworks when the goal is reached", () => {
      for (let i = 1; i <= 5; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }

      expect(state()?.sessionState.newUserOnboardingGoalSnapshot.map((a) => a.internalID)).toEqual([
        "artwork-1",
        "artwork-2",
        "artwork-3",
        "artwork-4",
        "artwork-5",
      ])

      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-6",
        url: "https://example.com/6.jpg",
      })

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(6)
      expect(state()?.sessionState.newUserOnboardingGoalSnapshot.map((a) => a.internalID)).toEqual([
        "artwork-1",
        "artwork-2",
        "artwork-3",
        "artwork-4",
        "artwork-5",
      ])
    })

    it("does not re-trigger the completion sheet or overwrite the snapshot if the count dips below 5 and returns to 5", () => {
      for (let i = 1; i <= 5; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }
      GlobalStore.actions.infiniteDiscovery.setNewUserOnboardingCompletionBottomSheetVisible(false)

      GlobalStore.actions.infiniteDiscovery.removeNewUserOnboardingSavedArtwork("artwork-1")
      GlobalStore.actions.infiniteDiscovery.removeNewUserOnboardingSavedArtwork("artwork-2")
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-6",
        url: "https://example.com/6.jpg",
      })
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-7",
        url: "https://example.com/7.jpg",
      })

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(5)
      expect(state()?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(false)
      expect(state()?.sessionState.newUserOnboardingGoalSnapshot.map((a) => a.internalID)).toEqual([
        "artwork-1",
        "artwork-2",
        "artwork-3",
        "artwork-4",
        "artwork-5",
      ])
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

    it("keeps removing artworks after the goal is reached, without touching the first-five snapshot", () => {
      for (let i = 1; i <= 5; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }

      GlobalStore.actions.infiniteDiscovery.removeNewUserOnboardingSavedArtwork("artwork-1")

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(4)
      expect(state()?.sessionState.newUserOnboardingGoalSnapshot.map((a) => a.internalID)).toEqual([
        "artwork-1",
        "artwork-2",
        "artwork-3",
        "artwork-4",
        "artwork-5",
      ])
    })
  })

  describe("resetSavedArtworksCount", () => {
    it("resets savedArtworksCount", () => {
      GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
      GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()

      GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()

      expect(state()?.savedArtworksCount).toBe(0)
    })
  })

  describe("resetNewUserOnboardingSessionState", () => {
    it("clears newUserOnboardingSavedArtworks", () => {
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-1",
        url: "https://example.com/1.jpg",
      })

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(1)

      GlobalStore.actions.infiniteDiscovery.resetNewUserOnboardingSessionState()

      expect(state()?.sessionState.newUserOnboardingSavedArtworks).toHaveLength(0)
    })

    it("clears newUserOnboardingCompletionBottomSheetVisible", () => {
      for (let i = 1; i <= 5; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }

      expect(state()?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(true)

      GlobalStore.actions.infiniteDiscovery.resetNewUserOnboardingSessionState()

      expect(state()?.sessionState.newUserOnboardingCompletionBottomSheetVisible).toBe(false)
    })

    it("clears newUserOnboardingGoalReached", () => {
      for (let i = 1; i <= 5; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }

      expect(state()?.sessionState.newUserOnboardingGoalReached).toBe(true)

      GlobalStore.actions.infiniteDiscovery.resetNewUserOnboardingSessionState()

      expect(state()?.sessionState.newUserOnboardingGoalReached).toBe(false)
    })

    it("clears newUserOnboardingGoalSnapshot", () => {
      for (let i = 1; i <= 5; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }

      expect(state()?.sessionState.newUserOnboardingGoalSnapshot).toHaveLength(5)

      GlobalStore.actions.infiniteDiscovery.resetNewUserOnboardingSessionState()

      expect(state()?.sessionState.newUserOnboardingGoalSnapshot).toHaveLength(0)
    })
  })
})
