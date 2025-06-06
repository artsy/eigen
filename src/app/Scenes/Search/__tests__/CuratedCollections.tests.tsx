import { fireEvent } from "@testing-library/react-native"
import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { CuratedCollections } from "app/Scenes/Search/CuratedCollections"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("CuratedCollections", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const queryData = useLazyLoadQuery<SearchQuery>(
      graphql`
        query CuratedCollectionsQuery {
          ...CuratedCollections_collections
        }
      `,
      { term: "", skipSearchQuery: false }
    )

    return <CuratedCollections collections={queryData} />
  }

  it("renders a list of curated collections", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        collections,
      }),
    })

    await flushPromiseQueue()

    expect(getByText("Blue-Chip Artists")).toBeTruthy()
    expect(getByText("Top Auction Lots")).toBeTruthy()
  })

  it("navigates to /collection/slug", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        collections,
      }),
    })

    await flushPromiseQueue()

    fireEvent.press(getByText("Blue-Chip Artists"))
    expect(navigate).toHaveBeenCalledWith(`/collection/blue-chip-artists`)
  })

  it("tracks an event when an item is tapped", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        collections,
      }),
    })

    await flushPromiseQueue()

    fireEvent.press(getByText("Blue-Chip Artists"))

    expect(navigate).toHaveBeenCalledWith(`/collection/blue-chip-artists`)

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedCollectionGroup",
          "context_module": "curatedCollections",
          "context_screen_owner_type": "search",
          "destination_screen_owner_id": "8fbef3cc-9c4a-4baf-81e2-276724341ae8",
          "destination_screen_owner_slug": "blue-chip-artists",
          "destination_screen_owner_type": "collection",
          "horizontal_slide_position": 0,
          "type": "thumbnail",
        },
      ]
    `)
  })
})

const collections = [
  {
    internalID: "8fbef3cc-9c4a-4baf-81e2-276724341ae8",
    slug: "blue-chip-artists",
    title: "Blue-Chip Artists",
    thumbnailImage: {
      url: "http://example.com/path/to/image",
    },
  },
  {
    internalID: "e68f3d81-d0e4-4778-a38f-a1a1a5760efa",
    slug: "top-auction-lots",
    title: "Top Auction Lots",
    thumbnailImage: {
      url: "http://example.com/path/to/another_image",
    },
  },
]
