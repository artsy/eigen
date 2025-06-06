import { MyCollectionCollectedArtistsPrivacyQueryRenderer } from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/MyCollectionCollectedArtistsPrivacy"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

describe("MyCollectionCollectedArtistsPrivacy", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("does shows a list of collected artists", async () => {
    const { getByText } = renderWithHookWrappersTL(
      <MyCollectionCollectedArtistsPrivacyQueryRenderer />,
      mockEnvironment
    )
    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => ({
        userInterestsConnection: {
          edges: userInterestsEdges,
        },
      }),
    })

    await flushPromiseQueue()

    expect(getByText("Artist 1")).toBeTruthy()
    expect(getByText("Artist 2")).toBeTruthy()
    expect(getByText("Artist 3")).toBeTruthy()
    expect(getByText("Artist 4")).toBeTruthy()
    expect(getByText("Artist 5")).toBeTruthy()
  })
})

const userInterestsEdges = [
  {
    internalID: "interest-1",
    private: true,
    node: {
      __typename: "Artist",
      internalID: "artist-1",
      name: "Artist 1",
    },
  },
  {
    internalID: "interest-2",
    private: false,
    node: {
      __typename: "Artist",
      internalID: "artist-2",
      name: "Artist 2",
    },
  },
  {
    __typename: "Artist",
    internalID: "interest-3",
    private: false,
    node: {
      internalID: "artist-3",
      name: "Artist 3",
    },
  },
  {
    __typename: "Artist",
    internalID: "interest-4",
    private: false,
    node: {
      internalID: "artist-4",
      name: "Artist 4",
    },
  },
  {
    __typename: "Artist",
    internalID: "interest-5",
    private: true,
    node: {
      internalID: "artist-5",
      name: "Artist 5",
    },
  },
]
