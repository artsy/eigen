import { ScreenDimensionsProvider } from "@artsy/palette-mobile"
import { act, renderHook } from "@testing-library/react-native"
import { InfiniteDiscoveryArtworkCard_artwork$data } from "__generated__/InfiniteDiscoveryArtworkCard_artwork.graphql"
import * as useSaveArtworkToArtworkListsModule from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { useInfiniteDiscoveryCardSave } from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryCardSave"
import { GlobalStore, GlobalStoreProvider, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useReducedMotion } from "react-native-reanimated"

const mockTrack = { savedArtwork: jest.fn() }

jest.mock("app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking", () => ({
  useInfiniteDiscoveryTracking: () => mockTrack,
}))

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  useReducedMotion: jest.fn(),
}))

const mockUseReducedMotion = useReducedMotion as jest.Mock

const mockArtwork = {
  internalID: "artwork-1",
  slug: "artwork-1-slug",
  images: [{ url: "https://example.com/image.jpg", blurhash: "blurhash-1" }],
} as unknown as InfiniteDiscoveryArtworkCard_artwork$data

const mockSaveArtworkToLists = jest.fn()
let capturedOptions: any

const mockUseSaveArtworkToArtworkLists = (isSaved: boolean) => {
  jest
    .spyOn(useSaveArtworkToArtworkListsModule, "useSaveArtworkToArtworkLists")
    .mockImplementation((options) => {
      capturedOptions = options
      return { isSaved, saveArtworkToLists: mockSaveArtworkToLists }
    })
}

const wrapper = ({ children }: any) => (
  <ScreenDimensionsProvider>
    <GlobalStoreProvider>{children}</GlobalStoreProvider>
  </ScreenDimensionsProvider>
)

const getState = () => __globalStoreTestUtils__!.getCurrentState().infiniteDiscovery

describe("useInfiniteDiscoveryCardSave", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()
    GlobalStore.actions.infiniteDiscovery.resetNewUserOnboardingSessionState()
    GlobalStore.actions.infiniteDiscovery.setHasSavedArtworks(false)
    GlobalStore.actions.onboarding.setOnboardingState("complete")
    mockUseReducedMotion.mockReturnValue(false)
  })

  it("saves the artwork: increments the count and marks that artworks have been saved", () => {
    mockUseSaveArtworkToArtworkLists(false)
    const { result } = renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

    act(() => result.current.handleSaveButtonPress())

    expect(getState().savedArtworksCount).toBe(1)
    expect(getState().hasSavedArtworks).toBe(true)
    expect(mockSaveArtworkToLists).toHaveBeenCalledTimes(1)
  })

  it("unsaves the artwork: decrements the count", () => {
    mockUseSaveArtworkToArtworkLists(true)
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    const { result } = renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

    act(() => result.current.handleSaveButtonPress())

    expect(getState().savedArtworksCount).toBe(0)
  })

  it("saves on double-tap when not already saved", () => {
    mockUseSaveArtworkToArtworkLists(false)
    const { result } = renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

    act(() => result.current.handleDoubleTapSave())

    expect(getState().savedArtworksCount).toBe(1)
    expect(mockSaveArtworkToLists).toHaveBeenCalledTimes(1)
  })

  it("ignores a double-tap when the artwork is already saved", () => {
    mockUseSaveArtworkToArtworkLists(true)
    const { result } = renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

    act(() => result.current.handleDoubleTapSave())

    expect(getState().savedArtworksCount).toBe(0)
    expect(mockSaveArtworkToLists).not.toHaveBeenCalled()
  })

  it("tracks the save once the mutation completes", () => {
    mockUseSaveArtworkToArtworkLists(false)
    renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

    act(() => capturedOptions.onCompleted(true))

    expect(mockTrack.savedArtwork).toHaveBeenCalledWith(true, "artwork-1", "artwork-1-slug")
  })

  it("reverts a failed save: decrements the count", () => {
    mockUseSaveArtworkToArtworkLists(false)
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

    act(() => capturedOptions.onError())

    expect(getState().savedArtworksCount).toBe(0)
  })

  it("reverts a failed unsave: increments the count", () => {
    mockUseSaveArtworkToArtworkLists(true)
    renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

    act(() => capturedOptions.onError())

    expect(getState().savedArtworksCount).toBe(1)
  })

  describe("during onboarding", () => {
    beforeEach(() => {
      GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    })

    it("stages the artwork for the flight animation when saved, without adding it to the onboarding list yet", () => {
      mockUseSaveArtworkToArtworkLists(false)
      const { result } = renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

      act(() => result.current.handleSaveButtonPress())

      expect(result.current.pendingSaveAnimationArtwork).toEqual(
        expect.objectContaining({ internalID: "artwork-1", blurhash: "blurhash-1" })
      )
      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([])
    })

    it("commits the artwork to the onboarding list immediately when Reduce Motion is enabled, skipping the flight animation", () => {
      mockUseReducedMotion.mockReturnValue(true)
      mockUseSaveArtworkToArtworkLists(false)
      const { result } = renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

      act(() => result.current.handleSaveButtonPress())

      expect(result.current.pendingSaveAnimationArtwork).toBeNull()
      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([
        expect.objectContaining({ internalID: "artwork-1", blurhash: "blurhash-1" }),
      ])
    })

    it("commits the artwork to the onboarding list immediately once the onboarding goal has been reached, skipping the flight animation", () => {
      mockUseSaveArtworkToArtworkLists(false)
      for (let i = 0; i < 5; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `goal-artwork-${i}`,
          url: "https://example.com/image.jpg",
          blurhash: "blurhash-1",
        })
      }
      const { result } = renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

      act(() => result.current.handleSaveButtonPress())

      expect(result.current.pendingSaveAnimationArtwork).toBeNull()
      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([
        ...Array.from({ length: 5 }, (_, i) =>
          expect.objectContaining({ internalID: `goal-artwork-${i}` })
        ),
        expect.objectContaining({ internalID: "artwork-1" }),
      ])
    })

    it("adds the artwork to the onboarding list once the flight animation completes", () => {
      mockUseSaveArtworkToArtworkLists(false)
      const { result } = renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

      act(() => result.current.handleSaveButtonPress())
      act(() => result.current.completeSaveAnimation())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([
        expect.objectContaining({ internalID: "artwork-1", blurhash: "blurhash-1" }),
      ])
      expect(result.current.pendingSaveAnimationArtwork).toBeNull()
    })

    it("removes the artwork from the onboarding list when unsaved", () => {
      mockUseSaveArtworkToArtworkLists(true)
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-1",
        url: "https://example.com/image.jpg",
        blurhash: "blurhash-1",
      })
      const { result } = renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

      act(() => result.current.handleSaveButtonPress())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([])
    })

    it("adds the artwork to the onboarding list once the flight animation completes after a double-tap save", () => {
      mockUseSaveArtworkToArtworkLists(false)
      const { result } = renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

      act(() => result.current.handleDoubleTapSave())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([])

      act(() => result.current.completeSaveAnimation())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([
        expect.objectContaining({ internalID: "artwork-1" }),
      ])
    })

    it("removes the artwork from the onboarding list when reverting a failed save", () => {
      mockUseSaveArtworkToArtworkLists(false)
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-1",
        url: "https://example.com/image.jpg",
        blurhash: "blurhash-1",
      })
      renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

      act(() => capturedOptions.onError())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([])
    })

    it("does not commit the artwork to the onboarding list if it was un-saved before the flight animation finished", () => {
      mockUseSaveArtworkToArtworkLists(false)
      const { result, rerender } = renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), {
        wrapper,
      })

      act(() => result.current.handleSaveButtonPress())

      mockUseSaveArtworkToArtworkLists(true)
      rerender(undefined)
      act(() => result.current.handleSaveButtonPress())

      act(() => result.current.completeSaveAnimation())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([])
    })

    it("re-adds the artwork to the onboarding list when reverting a failed unsave", () => {
      mockUseSaveArtworkToArtworkLists(true)
      renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

      act(() => capturedOptions.onError())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([
        expect.objectContaining({ internalID: "artwork-1" }),
      ])
    })
  })
})
