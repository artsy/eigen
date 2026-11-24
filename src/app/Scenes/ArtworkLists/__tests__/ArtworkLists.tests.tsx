import { act, screen } from "@testing-library/react-native"
import { ArtworkLists } from "app/Scenes/ArtworkLists/ArtworkLists"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

describe("ArtworkLists", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => <ArtworkLists />

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders Artwork lists", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Me: () => ({
          savedArtworksArtworkList,
          customArtworkLists,
        }),
      })

      await flushPromiseQueue()
    })

    expect(screen.getByText("Saved Artworks")).toBeTruthy()
    expect(screen.getByText("Custom Artwork List 1")).toBeTruthy()
    expect(screen.getByText("Custom Artwork List 2")).toBeTruthy()
  })

  describe("Artwork lists item count", () => {
    it("renders 'Artworks' label for more than 1 artworks", async () => {
      await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      await act(async () => {
        await resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList,
            customArtworkLists,
          }),
        })

        await flushPromiseQueue()
      })

      // Saved Artworks
      expect(screen.getByText("5 Artworks")).toBeTruthy()

      // Custom Artworks
      expect(screen.getByText("2 Artworks")).toBeTruthy()
    })

    it("renders 'Artwork' label for 1 artwork", async () => {
      await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      await act(async () => {
        await resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList,
            customArtworkLists,
          }),
        })

        await flushPromiseQueue()
      })

      // Custom Artworks
      expect(screen.getByText("1 Artwork")).toBeTruthy()
    })
  })
})

const savedArtworksArtworkList = {
  internalID: "saved-artworks",
  name: "Saved Artworks",
  isSavedArtwork: true,
  artworksCount: 5,
}

const customArtworkListOne = {
  internalID: "custom-artwork-list-one",
  name: "Custom Artwork List 1",
  isSavedArtwork: false,
  artworksCount: 1,
}

const customArtworkListTwo = {
  internalID: "custom-artwork-list-two",
  name: "Custom Artwork List 2",
  isSavedArtwork: false,
  artworksCount: 2,
}

const customArtworkLists = {
  edges: [
    {
      node: customArtworkListOne,
    },
    {
      node: customArtworkListTwo,
    },
  ],
}
