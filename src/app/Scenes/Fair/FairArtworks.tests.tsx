import { screen } from "@testing-library/react-native"
import { FairArtworksTestsQuery } from "__generated__/FairArtworksTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FairArtworksFragmentContainer } from "app/Scenes/Fair/Components/FairArtworks"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("FairArtworks", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<FairArtworksTestsQuery>
      query={query}
      environment={mockEnvironment}
      variables={{
        fairID: "art-basel-hong-kong-2020",
      }}
      render={({ props, error }) => {
        if (error) {
          console.log(error)
          return null
        }

        if (!props?.fair) {
          return null
        }

        return (
          <ArtworkFiltersStoreProvider>
            <FairArtworksFragmentContainer fair={props.fair} />
          </ArtworkFiltersStoreProvider>
        )
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  it("renders a grid of artworks", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Fair: () => fair,
    })

    await flushPromiseQueue()

    expect(screen.queryByText("Artwork Title")).toBeTruthy()
    expect(screen.queryByLabelText("Artworks Grid")).toBeTruthy()
  })

  it("renders empty view if there are no artworks", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Fair: () => ({
        fairArtworks: {
          edges: [],
          counts: {
            total: 0,
          },
        },
      }),
    })

    await flushPromiseQueue()

    expect(screen.queryByText(/No results found/)).toBeTruthy()
  })
})

const query = graphql`
  query FairArtworksTestsQuery($fairID: String!) @relay_test_operation {
    fair(id: $fairID) {
      ...FairArtworks_fair
    }
  }
`

const artwork = {
  slug: "artwork-slug",
  id: "artwork-id",
  internalID: "artwork-internalID",
  title: "Artwork Title",
}

const fair = {
  fairArtworks: {
    edges: [{ node: artwork }],
    counts: {
      total: 1,
    },
  },
}
