import { screen } from "@testing-library/react-native"
import { WorksForYouArtworksTestsQuery } from "__generated__/WorksForYouArtworksTestsQuery.graphql"
import { WorksForYouArtworks } from "app/Components/WorksForYouArtworks"
import { DEFAULT_RECS_MODEL_VERSION } from "app/Scenes/NewWorksForYou/NewWorksForYou"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("NewWorksForYouGrid", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<WorksForYouArtworksTestsQuery>
      query={graphql`
        query WorksForYouArtworksTestsQuery($version: String, $maxWorksPerArtist: Int) {
          viewer {
            ...WorksForYouArtworks_viewer
              @arguments(version: $version, maxWorksPerArtist: $maxWorksPerArtist)
          }
        }
      `}
      render={({ props }) => {
        if (!props?.viewer) {
          return
        }

        return <WorksForYouArtworks viewer={props.viewer} />
      }}
      variables={{
        version: DEFAULT_RECS_MODEL_VERSION,
        maxWorksPerArtist: 3,
      }}
      environment={mockEnvironment}
    />
  )

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  it("renders the grid items properly", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Viewer: () => viewer,
    })

    await flushPromiseQueue()

    const artworkTitle = "Sunflower Seeds Exhibition"
    expect(screen.getByText(artworkTitle)).toBeTruthy()
  })
})

const artwork = {
  slug: "artwork-one-slug",
  id: "artwork-one-id",
  image: {
    aspectRatio: 1.27,
    url: "https://d32dm0rphc51dk.cloudfront.net/ZRMpZo7ikbEdx3yqBNlDVA/large.jpg",
  },
  title: "Sunflower Seeds Exhibition",
  date: "2010",
  saleMessage: "US$1,750",
  internalID: "artwork-one-internalID",
  artistNames: "Ai Weiwei",
  href: "/artwork/ai-weiwei-sunflower-seeds-exhibition",
  sale: null,
  saleArtwork: null,
  partner: {
    name: "West Chelsea Contemporary",
  },
}

const viewer = {
  artworks: {
    edges: [{ node: artwork }],
  },
}
