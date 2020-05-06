import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { ShowArtistsTestsQuery } from "__generated__/ShowArtistsTestsQuery.graphql"
import { ShowArtistsContainer as ShowArtistsScreen } from "../../../../Scenes/Show/Screens/ShowArtists"

jest.unmock("react-relay")

describe("AllArtists", () => {
  it("renders without throwing an error", async () => {
    const env = createMockEnvironment()
    const TestRenderer = () => (
      <QueryRenderer<ShowArtistsTestsQuery>
        environment={env}
        query={graphql`
          query ShowArtistsTestsQuery @raw_response_type {
            show(id: "anderson-fine-art-gallery-flickinger-collection") {
              ...ShowArtists_show
            }
          }
        `}
        variables={{}}
        render={({ props, error }) => {
          if (props?.show) {
            return <ShowArtistsScreen show={props.show} />
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
})
