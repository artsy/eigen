import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { DetailTestsQuery } from "__generated__/DetailTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { DetailContainer } from "../Detail"

jest.unmock("react-relay")

it("Renders the Show Detail Screen", async () => {
  const env = createMockEnvironment()
  const TestRenderer = () => (
    <QueryRenderer<DetailTestsQuery>
      environment={env}
      query={graphql`
        query DetailTestsQuery @raw_response_type {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...Detail_show
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.show) {
          return <DetailContainer show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )
  const tree = renderWithWrappers(<TestRenderer />)
  act(() => {
    env.mock.resolveMostRecentOperation({
      errors: [],
      data: {
        show: {
          followedArtists: { edges: [] },
          description: "Flickinger Collection",
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

  expect(extractText(tree.root)).toContain("Flickinger Collection")
})
