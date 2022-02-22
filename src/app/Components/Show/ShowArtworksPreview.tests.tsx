import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { ShowArtworksPreviewTestsQuery } from "__generated__/ShowArtworksPreviewTestsQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { ShowArtworksPreviewContainer as ShowArtworksPreview } from "./ShowArtworksPreview"

jest.unmock("react-relay")

it("renders without throwing an error", async () => {
  const env = createMockEnvironment()
  const TestRenderer = () => (
    <QueryRenderer<ShowArtworksPreviewTestsQuery>
      environment={env}
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
          artworks: { edges: [] },
          counts: { artworks: 10 },
        },
      },
    })
  })
})
