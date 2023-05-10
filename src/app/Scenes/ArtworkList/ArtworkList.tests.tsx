import { ArtworkList } from "app/Scenes/ArtworkList/ArtworkList"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

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
})

const me = {
  artworkList: {
    internalID: "id-1",
    name: "Saved Artworks",
    artworks: {
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
    },
  },
}
