import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { ShowHeaderTestsQuery } from "__generated__/ShowHeaderTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ShowHeaderContainer } from "../ShowHeader"

jest.unmock("react-relay")

it("renders without throwing an error", () => {
  const env = createMockEnvironment()
  const TestRenderer = () => (
    <QueryRenderer<ShowHeaderTestsQuery>
      environment={env}
      query={graphql`
        query ShowHeaderTestsQuery @raw_response_type {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...ShowHeader_show
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowHeaderContainer show={props.show} />
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
