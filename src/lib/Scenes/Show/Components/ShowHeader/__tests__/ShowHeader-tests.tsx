import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { Theme } from "@artsy/palette"
import { ShowHeaderTestsQuery } from "__generated__/ShowHeaderTestsQuery.graphql"
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
          return (
            <Theme>
              <ShowHeaderContainer show={props.show} />
            </Theme>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )
  ReactTestRenderer.create(<TestRenderer />)
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
