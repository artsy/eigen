import { screen } from "@testing-library/react-native"
import { NewWorksForYouTestsQuery } from "__generated__/NewWorksForYouTestsQuery.graphql"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { DEFAULT_RECS_MODEL_VERSION, NewWorksForYouFragmentContainer } from "./NewWorksForYou"

describe("NewWorksForYou", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<NewWorksForYouTestsQuery>
      query={graphql`
        query NewWorksForYouTestsQuery(
          $version: String
          $includeBackfill: Boolean!
          $maxWorksPerArtist: Int
        ) {
          viewer {
            ...NewWorksForYou_viewer
              @arguments(
                includeBackfill: $includeBackfill
                version: $version
                maxWorksPerArtist: $maxWorksPerArtist
              )
          }
        }
      `}
      render={({ props }) => {
        if (!props?.viewer) {
          return
        }

        return <NewWorksForYouFragmentContainer viewer={props.viewer} />
      }}
      variables={{
        version: DEFAULT_RECS_MODEL_VERSION,
        includeBackfill: true,
        maxWorksPerArtist: 3,
      }}
      environment={mockEnvironment}
    />
  )

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  it("renders NewWorksForYou", async () => {
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
