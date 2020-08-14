import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { ShowArtworksTestsQuery } from "__generated__/ShowArtworksTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ShowArtworksContainer as ShowArtworks } from "../../../../Scenes/Show/Screens/ShowArtworks"

jest.unmock("react-relay")

it("renders without throwing an error", async () => {
  const env = createMockEnvironment()
  const TestRenderer = () => (
    <QueryRenderer<ShowArtworksTestsQuery>
      environment={env}
      query={graphql`
        query ShowArtworksTestsQuery @raw_response_type {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...ShowArtworks_show
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowArtworks show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )
  renderWithWrappers(<TestRenderer />)
  act(() => {
    env.mock.resolveMostRecentOperation({
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
        },
      },
    })
  })
})
