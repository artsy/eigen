import { ShowArtworksPreviewTestsQuery } from "__generated__/ShowArtworksPreviewTestsQuery.graphql"
import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperationRawPayload } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { ShowArtworksPreviewContainer as ShowArtworksPreview } from "./ShowArtworksPreview"

it("renders without throwing an error", async () => {
  const TestRenderer = () => (
    <QueryRenderer<ShowArtworksPreviewTestsQuery>
      environment={getMockRelayEnvironment()}
      query={graphql`
        query ShowArtworksPreviewTestsQuery @raw_response_type {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...ShowArtworksPreview_show
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowArtworksPreview show={props.show} onViewAllArtworksPressed={jest.fn()} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  renderWithWrappersLEGACY(<TestRenderer />)

  resolveMostRecentRelayOperationRawPayload({
    errors: [],
    data: {
      show: {
        followedArtists: { edges: [] },
        artists: [],
        images: [],
        coverImage: null,
        partner: { __typename: "Partner", name: "Test Partner" },
        isStubShow: false,
        name: "Test Show",
        slug: "test-show",
        artworks: { edges: [] },
        counts: { artworks: 10 },
      },
    },
  })
})
