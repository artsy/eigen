import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { ShowTestsQuery } from "__generated__/ShowTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ShowContainer } from "../Show"

jest.unmock("react-relay")

it("renders the Show screen", async () => {
  const env = createMockEnvironment()
  const TestRenderer = () => (
    <QueryRenderer<ShowTestsQuery>
      environment={env}
      query={graphql`
        query ShowTestsQuery @raw_response_type {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...Show_show
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowContainer show={props.show} />
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
          artistsWithoutArtworks: [],
        },
      },
    })
  })
})
