import { ScreenDimensionsProvider } from "@artsy/palette-mobile"
import FastImage from "@d11/react-native-fast-image"
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

jest.mock("@d11/react-native-fast-image", () => ({ preload: jest.fn() }))

const mockFastImagePreload = FastImage.preload as jest.Mock

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

  it("saves the artwork: increments the count and marks that artworks have been saved", async () => {
    mockUseSaveArtworkToArtworkLists(false)
    const { result } = await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), {
      wrapper,
    })

    await act(() => result.current.handleSaveButtonPress())

    expect(getState().savedArtworksCount).toBe(1)
    expect(getState().hasSavedArtworks).toBe(true)
    expect(mockSaveArtworkToLists).toHaveBeenCalledTimes(1)
  })

  it("unsaves the artwork: decrements the count", async () => {
    mockUseSaveArtworkToArtworkLists(true)
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    const { result } = await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), {
      wrapper,
    })

    await act(() => result.current.handleSaveButtonPress())

    expect(getState().savedArtworksCount).toBe(0)
  })

  it("saves on double-tap when not already saved", async () => {
    mockUseSaveArtworkToArtworkLists(false)
    const { result } = await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), {
      wrapper,
    })

    await act(() => result.current.handleDoubleTapSave())

    expect(getState().savedArtworksCount).toBe(1)
    expect(mockSaveArtworkToLists).toHaveBeenCalledTimes(1)
  })

  it("ignores a double-tap when the artwork is already saved", async () => {
    mockUseSaveArtworkToArtworkLists(true)
    const { result } = await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), {
      wrapper,
    })

    await act(() => result.current.handleDoubleTapSave())

    expect(getState().savedArtworksCount).toBe(0)
    expect(mockSaveArtworkToLists).not.toHaveBeenCalled()
  })

  it("tracks the save once the mutation completes", async () => {
    mockUseSaveArtworkToArtworkLists(false)
    await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

    await act(() => capturedOptions.onCompleted(true))

    expect(mockTrack.savedArtwork).toHaveBeenCalledWith(true, "artwork-1", "artwork-1-slug")
  })

  it("reverts a failed save: decrements the count", async () => {
    mockUseSaveArtworkToArtworkLists(false)
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

    await act(() => capturedOptions.onError())

    expect(getState().savedArtworksCount).toBe(0)
  })

  it("reverts a failed unsave: increments the count", async () => {
    mockUseSaveArtworkToArtworkLists(true)
    await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

    await act(() => capturedOptions.onError())

    expect(getState().savedArtworksCount).toBe(1)
  })

  describe("during onboarding", () => {
    beforeEach(() => {
      GlobalStore.actions.onboarding.setOnboardingState("incomplete")
    })

    it("stages the artwork for the flight animation when saved, without adding it to the onboarding list yet", async () => {
      mockUseSaveArtworkToArtworkLists(false)
      const { result } = await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), {
        wrapper,
      })

      await act(() => result.current.handleSaveButtonPress())

      expect(result.current.pendingSaveAnimationArtwork).toEqual(
        expect.objectContaining({ internalID: "artwork-1", blurhash: "blurhash-1" })
      )
      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([])
      expect(mockFastImagePreload).toHaveBeenCalledWith([
        { uri: result.current.pendingSaveAnimationArtwork?.url },
      ])
    })

    it("commits the artwork to the onboarding list immediately when Reduce Motion is enabled, skipping the flight animation", async () => {
      mockUseReducedMotion.mockReturnValue(true)
      mockUseSaveArtworkToArtworkLists(false)
      const { result } = await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), {
        wrapper,
      })

      await act(() => result.current.handleSaveButtonPress())

      expect(result.current.pendingSaveAnimationArtwork).toBeNull()
      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([
        expect.objectContaining({ internalID: "artwork-1", blurhash: "blurhash-1" }),
      ])
    })

    it("commits the artwork to the onboarding list immediately once the onboarding goal has been reached, skipping the flight animation", async () => {
      mockUseSaveArtworkToArtworkLists(false)
      for (let i = 0; i < 5; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `goal-artwork-${i}`,
          url: "https://example.com/image.jpg",
          blurhash: "blurhash-1",
        })
      }
      const { result } = await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), {
        wrapper,
      })

      await act(() => result.current.handleSaveButtonPress())

      expect(result.current.pendingSaveAnimationArtwork).toBeNull()
      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([
        ...Array.from({ length: 5 }, (_, i) =>
          expect.objectContaining({ internalID: `goal-artwork-${i}` })
        ),
        expect.objectContaining({ internalID: "artwork-1" }),
      ])
    })

    it("adds the artwork to the onboarding list once the flight animation completes", async () => {
      mockUseSaveArtworkToArtworkLists(false)
      const { result } = await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), {
        wrapper,
      })

      await act(() => result.current.handleSaveButtonPress())
      await act(() => result.current.completeSaveAnimation())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([
        expect.objectContaining({ internalID: "artwork-1", blurhash: "blurhash-1" }),
      ])
      expect(result.current.pendingSaveAnimationArtwork).toBeNull()
    })

    it("removes the artwork from the onboarding list when unsaved", async () => {
      mockUseSaveArtworkToArtworkLists(true)
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-1",
        url: "https://example.com/image.jpg",
        blurhash: "blurhash-1",
      })
      const { result } = await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), {
        wrapper,
      })

      await act(() => result.current.handleSaveButtonPress())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([])
    })

    it("adds the artwork to the onboarding list once the flight animation completes after a double-tap save", async () => {
      mockUseSaveArtworkToArtworkLists(false)
      const { result } = await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), {
        wrapper,
      })

      await act(() => result.current.handleDoubleTapSave())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([])

      await act(() => result.current.completeSaveAnimation())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([
        expect.objectContaining({ internalID: "artwork-1" }),
      ])
    })

    it("removes the artwork from the onboarding list when reverting a failed save", async () => {
      mockUseSaveArtworkToArtworkLists(false)
      GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
        internalID: "artwork-1",
        url: "https://example.com/image.jpg",
        blurhash: "blurhash-1",
      })
      await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

      await act(() => capturedOptions.onError())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([])
    })

    it("does not commit the artwork to the onboarding list if it was un-saved before the flight animation finished", async () => {
      mockUseSaveArtworkToArtworkLists(false)
      const { result, rerender } = await renderHook(
        () => useInfiniteDiscoveryCardSave(mockArtwork),
        {
          wrapper,
        }
      )

      await act(() => result.current.handleSaveButtonPress())

      mockUseSaveArtworkToArtworkLists(true)
      await rerender(undefined)
      await act(() => result.current.handleSaveButtonPress())

      await act(() => result.current.completeSaveAnimation())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([])
    })

    it("re-adds the artwork to the onboarding list when reverting a failed unsave", async () => {
      mockUseSaveArtworkToArtworkLists(true)
      await renderHook(() => useInfiniteDiscoveryCardSave(mockArtwork), { wrapper })

      await act(() => capturedOptions.onError())

      expect(getState().sessionState.newUserOnboardingSavedArtworks).toEqual([
        expect.objectContaining({ internalID: "artwork-1" }),
      ])
    })
  })
})
