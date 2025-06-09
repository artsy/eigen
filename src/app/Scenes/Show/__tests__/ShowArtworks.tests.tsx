import { ShowArtworksTestsQuery } from "__generated__/ShowArtworksTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ShowArtworks } from "app/Scenes/Show/Components/ShowArtworks"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("ShowArtworks", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => {
    const data = useLazyLoadQuery<ShowArtworksTestsQuery>(query, {
      showID: "catty-art-show",
    })

    if (!data.show) {
      return null
    }

    return (
      <ArtworkFiltersStoreProvider>
        <ShowArtworks show={data.show} />
      </ArtworkFiltersStoreProvider>
    )
  }

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  it("renders a grid of artworks", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Show: () => show,
    })

    await flushPromiseQueue()

    expect(getByText("Show Artwork")).toBeTruthy()
  })

  it("renders empty view if there are no artworks", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Show: () => ({
        showArtworks: {
          ...show.showArtworks,
          edges: [],
          counts: {
            total: 0,
          },
        },
      }),
    })

    await flushPromiseQueue()

    expect(getByText(/This show is currently unavailable./)).toBeTruthy()
  })
})

const showArtwork = {
  id: "show-artwork-id",
  internalID: "show-artwork-internalID",
  title: "Show Artwork",
}

const show = {
  showArtworks: {
    edges: [{ node: showArtwork }],
    counts: {
      total: 1,
    },
  },
}

const query = graphql`
  query ShowArtworksTestsQuery($showID: String!) @relay_test_operation {
    show(id: $showID) {
      ...ShowArtworks_show
    }
  }
`
