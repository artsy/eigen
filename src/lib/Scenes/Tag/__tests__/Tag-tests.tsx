import { TagTestsQuery } from "__generated__/TagTestsQuery.graphql"
import { ArtworkFilterOptionsScreen } from "lib/Components/ArtworkFilter"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { TouchableHighlightColor } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { Tag } from "../Tag"

jest.unmock("react-relay")

describe("Tag", () => {
  const trackEvent = jest.fn()
  const tagID = "tag-id"
  let environment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    environment = createMockEnvironment()
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    trackEvent.mockClear()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<TagTestsQuery>
        environment={environment}
        query={graphql`
          query TagTestsQuery($tagID: String!, $input: FilterArtworksInput) @relay_test_operation {
            tag(id: $tagID) {
              slug
              ...TagHeader_tag
              ...About_tag
              ...TagArtworks_tag @arguments(input: $input)
            }
          }
        `}
        render={({ props }) => {
          if (props?.tag) {
            return <Tag tagID={tagID} tag={props.tag} />
          }

          return null
        }}
        variables={{
          tagID,
          input: {
            medium: "*",
            priceRange: "*-*",
          },
        }}
      />
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(environment)
  })

  it("renders filter modal", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(environment)

    act(() => tree.root.findByType(TouchableHighlightColor).props.onPress())

    expect(tree.root.findAllByType(ArtworkFilterOptionsScreen)).toHaveLength(1)
  })
})
