import { act } from "@testing-library/react-native"
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
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      resolveMostRecentRelayOperation(mockEnvironment, {
        Me: () => ({
          savedArtworksArtworkList,
          customArtworkLists,
        }),
      })

      await flushPromiseQueue()
    })

    expect(getByText("Saved Artworks")).toBeTruthy()
    expect(getByText("Custom Artwork List 1")).toBeTruthy()
    expect(getByText("Custom Artwork List 2")).toBeTruthy()
  })

  describe("Artwork lists item count", () => {
    it("renders 'Artworks' label for more than 1 artworks", async () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      await act(async () => {
        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList,
            customArtworkLists,
          }),
        })

        await flushPromiseQueue()
      })

      // Saved Artworks
      expect(getByText("5 Artworks")).toBeTruthy()

      // Custom Artworks
      expect(getByText("2 Artworks")).toBeTruthy()
    })

    it("renders 'Artwork' label for 1 artwork", async () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      await act(async () => {
        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            savedArtworksArtworkList,
            customArtworkLists,
          }),
        })

        await flushPromiseQueue()
      })

      // Custom Artworks
      expect(getByText("1 Artwork")).toBeTruthy()
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
