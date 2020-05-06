import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { ArtworksPreviewTestsQuery } from "__generated__/ArtworksPreviewTestsQuery.graphql"
import { fairFixture } from "../../__fixtures__"
import { ArtworksPreviewContainer as ArtworksPreview } from "../ArtworksPreview"

jest.unmock("react-relay")

it("renders without throwing an error", async () => {
  const env = createMockEnvironment()
  const TestRenderer = () => (
    <QueryRenderer<ArtworksPreviewTestsQuery>
      environment={env}
      query={graphql`
        query ArtworksPreviewTestsQuery @raw_response_type {
          fair(id: "sofa-chicago-2018") {
            ...ArtworksPreview_fair
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.fair) {
          return <ArtworksPreview fair={props.fair} />
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
        fair: fairFixture,
      },
    })
  })
})
