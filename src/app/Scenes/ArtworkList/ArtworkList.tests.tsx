import { ArtworkList } from "app/Scenes/ArtworkList/ArtworkList"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

const CONTEXTUAL_MENU_LABEL = "Contextual Menu Button"

describe("ArtworkList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders ArtworkList", async () => {
    const { getByText } = renderWithHookWrappersTL(
      <ArtworkList listID="some-id" />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => me,
    })

    await flushPromiseQueue()

    expect(getByText("Saved Artworks")).toBeTruthy()
    expect(getByText("2 Artworks")).toBeTruthy()
  })

  it("displays the artworks", async () => {
    const { findByText } = renderWithHookWrappersTL(
      <ArtworkList listID="some-id" />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => me,
    })

    await flushPromiseQueue()

    expect(findByText("Artwork Title 1")).toBeTruthy()
    expect(findByText("Artwork Title 2")).toBeTruthy()
  })

  describe("Contextual menu button", () => {
    it("should NOT be displayed for default artwork list", async () => {
      const { queryByLabelText } = renderWithHookWrappersTL(
        <ArtworkList listID="some-id" />,
        mockEnvironment
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Me: () => me,
      })

      await flushPromiseQueue()

      expect(queryByLabelText(CONTEXTUAL_MENU_LABEL)).toBeNull()
    })

    describe("custom artwork list", () => {
      it("should be displayed", async () => {
        const { getByLabelText } = renderWithHookWrappersTL(
          <ArtworkList listID="some-id" />,
          mockEnvironment
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            ...me,
            artworkList: customArtworkList,
          }),
        })

        await flushPromiseQueue()

        expect(getByLabelText(CONTEXTUAL_MENU_LABEL)).toBeTruthy()
      })

      it("should be displayed for empty state", async () => {
        const { getByLabelText } = renderWithHookWrappersTL(
          <ArtworkList listID="some-id" />,
          mockEnvironment
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            ...me,
            artworkList: {
              ...customArtworkList,
              artworks: {
                ...customArtworkList.artworks,
                totalCount: 0,
              },
            },
          }),
        })

        await flushPromiseQueue()

        expect(getByLabelText(CONTEXTUAL_MENU_LABEL)).toBeTruthy()
      })
    })
  })
})

const artworks = {
  totalCount: 2,
  edges: [
    {
      node: {
        title: "Artwork Title 1",
        internalID: "613a38d6611297000d7ccc1d",
      },
    },
    {
      node: {
        title: "Artwork Title 2",
        internalID: "614e4006f856a0000df1399c",
      },
    },
  ],
}

const defaultArtworkList = {
  internalID: "id-1",
  name: "Saved Artworks",
  default: true,
  artworks,
}

const customArtworkList = {
  internalID: "custom-artwork-list",
  name: "Custom Artwork List",
  default: false,
  artworks,
}

const me = {
  artworkList: defaultArtworkList,
}
