import { fireEvent } from "@testing-library/react-native"
import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { graphql, useLazyLoadQuery } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { CuratedCollections } from "./CuratedCollections"

jest.unmock("react-relay")

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
      {}
    )

    return <CuratedCollections collections={queryData} />
  }

  it("renders a list of curated collections", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({
        data: {
          collections,
        },
      })
    })

    await flushPromiseQueue()

    expect(getByText("Blue-Chip Artists")).toBeTruthy()
    expect(getByText("Top Auction Lots")).toBeTruthy()
  })

  it("navigates to /collection/slug", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({
        data: {
          collections,
        },
      })
    })

    await flushPromiseQueue()

    fireEvent.press(getByText("Blue-Chip Artists"))
    expect(navigate).toHaveBeenCalledWith(`/collection/blue-chip-artists`)
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
